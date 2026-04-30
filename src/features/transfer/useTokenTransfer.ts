import {
  MultiProtocolProvider,
  ProviderType,
  TypedTransactionReceipt,
  WarpCore,
  WarpTxCategory,
  WarpTypedTransaction,
} from '@hyperlane-xyz/sdk';
import { toTitleCase, toWei } from '@hyperlane-xyz/utils';
import {
  getAccountAddressForChain,
  useAccounts,
  useActiveChains,
  useTransactionFns,
} from '@hyperlane-xyz/widgets';
import { BigNumber } from 'ethers';
import { useCallback, useState } from 'react';
import { toast } from 'react-toastify';
import { toastTxSuccess } from '../../components/toast/TxSuccessToast';
import { config } from '../../consts/config';
import { logger } from '../../utils/logger';
import { EVENT_NAME } from '../analytics/types';
import { trackEvent } from '../analytics/utils';
import { useMultiProvider } from '../chains/hooks';
import { getChainDisplayName } from '../chains/utils';
import { AppState, useStore } from '../store';
import { getTokenByIndex, useWarpCore } from '../tokens/hooks';
import { TransferContext, TransferFormValues, TransferStatus } from './types';
import { tryGetMsgIdFromTransferReceipt } from './utils';

const CHAIN_MISMATCH_ERROR = 'ChainMismatchError';
const TRANSFER_TIMEOUT_ERROR1 = 'block height exceeded';
const TRANSFER_TIMEOUT_ERROR2 = 'timeout';

// Default gas estimate for EVM transfer remote transactions (from SDK)
const EVM_TRANSFER_REMOTE_GAS_ESTIMATE = 450000n;

/**
 * Apply gas limit and gas price multipliers to EVM transactions.
 * Handles both legacy (gasLimit/gasPrice) and EIP-1559 (maxFeePerGas/maxPriorityFeePerGas) transactions.
 * If gasLimit is not set, uses SDK's default EVM_TRANSFER_REMOTE_GAS_ESTIMATE.
 * Fetches current fee data from the RPC and applies gasPriceMultiplier as a buffer.
 */
async function applyGasMultipliers(
  tx: WarpTypedTransaction,
  multiProvider: MultiProtocolProvider,
  originChain: string,
): Promise<WarpTypedTransaction> {
  const limitMultiplier = config.gasLimitMultiplier;
  const priceMultiplier = config.gasPriceMultiplier;

  // Only apply to EVM transactions that have a transaction object
  if (tx.type !== ProviderType.EthersV5 || !tx.transaction) {
    return tx;
  }

  const transaction = tx.transaction as Record<string, unknown>;

  // --- Gas Limit Multiplier ---
  let gasLimitBigInt: bigint;
  const originalGasLimit = transaction.gasLimit;

  if (originalGasLimit !== undefined && originalGasLimit !== null) {
    // Handle different gasLimit types (BigNumber, bigint, number, string)
    if (typeof originalGasLimit === 'bigint') {
      gasLimitBigInt = originalGasLimit;
    } else if (typeof originalGasLimit === 'number') {
      gasLimitBigInt = BigInt(originalGasLimit);
    } else if (typeof originalGasLimit === 'string') {
      gasLimitBigInt = BigInt(originalGasLimit);
    } else if (typeof originalGasLimit === 'object' && originalGasLimit !== null) {
      // Handle ethers BigNumber (has toString method)
      const bn = originalGasLimit as { toString: () => string };
      gasLimitBigInt = BigInt(bn.toString());
    } else {
      logger.warn('Unknown gasLimit type, skipping multiplier');
      return tx;
    }
  } else {
    // gasLimit not set - use SDK's default estimate
    gasLimitBigInt = EVM_TRANSFER_REMOTE_GAS_ESTIMATE;
    logger.debug(`Using default gas estimate: ${gasLimitBigInt}`);
  }

  // Apply multiplier: multiply by (multiplier * 100) / 100 to handle decimals
  const multipliedLimit =
    (gasLimitBigInt * BigInt(Math.round(limitMultiplier * 100))) / BigInt(100);

  // Convert back to ethers BigNumber for SDK compatibility
  const multipliedLimitBN = BigNumber.from(multipliedLimit.toString());

  logger.debug(
    `Applied gas limit multiplier: ${gasLimitBigInt} -> ${multipliedLimit} (${limitMultiplier}x)`,
  );

  let gasPriceFields: Record<string, unknown> = {};

  // --- Gas Price Multiplier ---
  try {
    const provider = multiProvider.getEthersV5Provider(originChain);
    const feeData = await provider.getFeeData();

    if (feeData.maxFeePerGas) {
      // EIP-1559 chain
      const maxFee = BigInt(feeData.maxFeePerGas.toString());
      const maxPriority = BigInt((feeData.maxPriorityFeePerGas ?? feeData.maxFeePerGas).toString());

      const multipliedMaxFee =
        (maxFee * BigInt(Math.round(priceMultiplier * 100))) / BigInt(100);
      const multipliedMaxPriority =
        (maxPriority * BigInt(Math.round(priceMultiplier * 100))) / BigInt(100);

      gasPriceFields = {
        maxFeePerGas: BigNumber.from(multipliedMaxFee.toString()),
        maxPriorityFeePerGas: BigNumber.from(multipliedMaxPriority.toString()),
      };

      logger.debug(
        `Applied gas price multiplier (EIP-1559): maxFeePerGas ${maxFee} -> ${multipliedMaxFee}, maxPriorityFeePerGas ${maxPriority} -> ${multipliedMaxPriority} (${priceMultiplier}x)`,
      );
    } else if (feeData.gasPrice) {
      // Legacy chain
      const gasPrice = BigInt(feeData.gasPrice.toString());
      const multipliedGasPrice =
        (gasPrice * BigInt(Math.round(priceMultiplier * 100))) / BigInt(100);

      gasPriceFields = {
        gasPrice: BigNumber.from(multipliedGasPrice.toString()),
      };

      logger.debug(
        `Applied gas price multiplier (legacy): gasPrice ${gasPrice} -> ${multipliedGasPrice} (${priceMultiplier}x)`,
      );
    }
  } catch (error) {
    logger.warn('Failed to fetch fee data for gas price multiplier, proceeding without', error);
  }

  return {
    ...tx,
    transaction: {
      ...transaction,
      gasLimit: multipliedLimitBN,
      ...gasPriceFields,
    },
  } as WarpTypedTransaction;
}

export function useTokenTransfer(onDone?: () => void) {
  const { transfers, addTransfer, updateTransferStatus } = useStore((s) => ({
    transfers: s.transfers,
    addTransfer: s.addTransfer,
    updateTransferStatus: s.updateTransferStatus,
  }));
  const transferIndex = transfers.length;

  const multiProvider = useMultiProvider();
  const warpCore = useWarpCore();

  const activeAccounts = useAccounts(multiProvider);
  const activeChains = useActiveChains(multiProvider);
  const transactionFns = useTransactionFns(multiProvider);

  const [isLoading, setIsLoading] = useState(false);

  // TODO implement cancel callback for when modal is closed?
  const triggerTransactions = useCallback(
    (values: TransferFormValues) =>
      executeTransfer({
        warpCore,
        values,
        transferIndex,
        activeAccounts,
        activeChains,
        transactionFns,
        addTransfer,
        updateTransferStatus,
        setIsLoading,
        onDone,
      }),
    [
      warpCore,
      transferIndex,
      activeAccounts,
      activeChains,
      transactionFns,
      setIsLoading,
      addTransfer,
      updateTransferStatus,
      onDone,
    ],
  );

  return {
    isLoading,
    triggerTransactions,
  };
}

async function executeTransfer({
  warpCore,
  values,
  transferIndex,
  activeAccounts,
  activeChains,
  transactionFns,
  addTransfer,
  updateTransferStatus,
  setIsLoading,
  onDone,
}: {
  warpCore: WarpCore;
  values: TransferFormValues;
  transferIndex: number;
  activeAccounts: ReturnType<typeof useAccounts>;
  activeChains: ReturnType<typeof useActiveChains>;
  transactionFns: ReturnType<typeof useTransactionFns>;
  addTransfer: (t: TransferContext) => void;
  updateTransferStatus: AppState['updateTransferStatus'];
  setIsLoading: (b: boolean) => void;
  onDone?: () => void;
}) {
  logger.debug('Preparing transfer transaction(s)');
  setIsLoading(true);
  let transferStatus: TransferStatus = TransferStatus.Preparing;
  updateTransferStatus(transferIndex, transferStatus);

  const { origin, destination, tokenIndex, amount, recipient } = values;
  const multiProvider = warpCore.multiProvider;

  try {
    const originToken = getTokenByIndex(warpCore, tokenIndex);
    const connection = originToken?.getConnectionForChain(destination);
    if (!originToken || !connection) throw new Error('No token route found between chains');

    const originProtocol = originToken.protocol;
    const isNft = originToken.isNft();
    const weiAmountOrId = isNft ? amount : toWei(amount, originToken.decimals);
    const originTokenAmount = originToken.amount(weiAmountOrId);

    const sendTransaction = transactionFns[originProtocol].sendTransaction;
    const sendMultiTransaction = transactionFns[originProtocol].sendMultiTransaction;
    const activeChain = activeChains.chains[originProtocol];
    const sender = getAccountAddressForChain(multiProvider, origin, activeAccounts.accounts);
    if (!sender) throw new Error('No active account found for origin chain');

    const isCollateralSufficient = await warpCore.isDestinationCollateralSufficient({
      originTokenAmount,
      destination,
    });
    if (!isCollateralSufficient) {
      toast.error('Insufficient collateral on destination for transfer');
      throw new Error('Insufficient destination collateral');
    }

    addTransfer({
      timestamp: new Date().getTime(),
      status: TransferStatus.Preparing,
      origin,
      destination,
      originTokenAddressOrDenom: originToken.addressOrDenom,
      destTokenAddressOrDenom: connection.token.addressOrDenom,
      sender,
      recipient,
      amount,
    });

    updateTransferStatus(transferIndex, (transferStatus = TransferStatus.CreatingTxs));

    const txs = await warpCore.getTransferRemoteTxs({
      originTokenAmount,
      destination,
      sender,
      recipient,
    });

    const hashes: string[] = [];
    let txReceipt: TypedTransactionReceipt | undefined = undefined;

    if (txs.length > 1 && txs.every((tx) => tx.type === ProviderType.Starknet)) {
      updateTransferStatus(
        transferIndex,
        (transferStatus = txCategoryToStatuses[WarpTxCategory.Transfer][0]),
      );
      // Apply gas multipliers to transactions
      const modifiedTxs = await Promise.all(
        txs.map((t) => applyGasMultipliers(t, multiProvider, origin)),
      );
      const { hash, confirm } = await sendMultiTransaction({
        txs: modifiedTxs,
        chainName: origin,
        activeChainName: activeChain.chainName,
      });
      updateTransferStatus(
        transferIndex,
        (transferStatus = txCategoryToStatuses[WarpTxCategory.Transfer][1]),
      );
      txReceipt = await confirm();
      const description = toTitleCase(WarpTxCategory.Transfer);
      logger.debug(`${description} transaction confirmed, hash:`, hash);
      toastTxSuccess(`${description} transaction sent!`, hash, origin);

      hashes.push(hash);
    } else {
      for (const tx of txs) {
        // Apply gas multipliers to EVM transactions
        const modifiedTx = await applyGasMultipliers(tx, multiProvider, origin);
        updateTransferStatus(
          transferIndex,
          (transferStatus = txCategoryToStatuses[tx.category][0]),
        );
        const { hash, confirm } = await sendTransaction({
          tx: modifiedTx,
          chainName: origin,
          activeChainName: activeChain.chainName,
        });
        updateTransferStatus(
          transferIndex,
          (transferStatus = txCategoryToStatuses[tx.category][1]),
        );
        txReceipt = await confirm();
        const description = toTitleCase(tx.category);
        logger.debug(`${description} transaction confirmed, hash:`, hash);
        toastTxSuccess(`${description} transaction sent!`, hash, origin);

        hashes.push(hash);
      }
    }

    const msgId = txReceipt
      ? tryGetMsgIdFromTransferReceipt(multiProvider, origin, txReceipt)
      : undefined;

    const originTxHash = hashes.at(-1);
    updateTransferStatus(transferIndex, (transferStatus = TransferStatus.ConfirmedTransfer), {
      originTxHash,
      msgId,
    });

    // track event after tx submission
    const originChainId = warpCore.multiProvider.getChainId(origin);
    const destinationChainId = warpCore.multiProvider.getChainId(destination);
    trackEvent(EVENT_NAME.TRANSACTION_SUBMITTED, {
      amount,
      recipient,
      chains: `${origin}|${originChainId}|${destination}|${destinationChainId}`,
      tokenAddress: originToken.addressOrDenom,
      tokenSymbol: originToken.symbol,
      walletAddress: sender,
      transactionHash: originTxHash || '',
    });
  } catch (error: any) {
    logger.error(`Error at stage ${transferStatus}`, error);
    const errorDetails = error.message || error.toString();
    updateTransferStatus(transferIndex, TransferStatus.Failed);
    if (errorDetails.includes(CHAIN_MISMATCH_ERROR)) {
      // Wagmi switchNetwork call helps prevent this but isn't foolproof
      toast.error('Wallet must be connected to origin chain');
    } else if (
      errorDetails.includes(TRANSFER_TIMEOUT_ERROR1) ||
      errorDetails.includes(TRANSFER_TIMEOUT_ERROR2)
    ) {
      toast.error(
        `Transaction timed out, ${getChainDisplayName(multiProvider, origin)} may be busy. Please try again.`,
      );
    } else {
      toast.error(errorMessages[transferStatus] || 'Unable to transfer tokens.');
    }
  }

  setIsLoading(false);
  if (onDone) onDone();
}

const errorMessages: Partial<Record<TransferStatus, string>> = {
  [TransferStatus.Preparing]: 'Error while preparing the transactions.',
  [TransferStatus.CreatingTxs]: 'Error while creating the transactions.',
  [TransferStatus.SigningApprove]: 'Error while signing the approve transaction.',
  [TransferStatus.ConfirmingApprove]: 'Error while confirming the approve transaction.',
  [TransferStatus.SigningTransfer]: 'Error while signing the transfer transaction.',
  [TransferStatus.ConfirmingTransfer]: 'Error while confirming the transfer transaction.',
};

const txCategoryToStatuses: Record<WarpTxCategory, [TransferStatus, TransferStatus]> = {
  [WarpTxCategory.Approval]: [TransferStatus.SigningApprove, TransferStatus.ConfirmingApprove],
  [WarpTxCategory.Revoke]: [TransferStatus.SigningRevoke, TransferStatus.ConfirmingRevoke],
  [WarpTxCategory.Transfer]: [TransferStatus.SigningTransfer, TransferStatus.ConfirmingTransfer],
};
