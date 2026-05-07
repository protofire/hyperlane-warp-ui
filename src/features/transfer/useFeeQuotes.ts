import { Token, TokenAmount, WarpCore, WarpCoreFeeEstimate } from '@hyperlane-xyz/sdk';
import { HexString, ProtocolType, toWei } from '@hyperlane-xyz/utils';
import { getAccountAddressAndPubKey, useAccounts, useDebounce } from '@hyperlane-xyz/widgets';
import { useQuery } from '@tanstack/react-query';
import { logger } from '../../utils/logger';
import { useMultiProvider } from '../chains/hooks';
import { useWarpCore } from '../tokens/hooks';
import { getLowestFeeTransferToken } from './fees';
import { TransferFormValues } from './types';

const FEE_QUOTE_REFRESH_INTERVAL = 30_000; // 30s

export function useFeeQuotes(
  { destination, amount, recipient, tokenIndex }: TransferFormValues,
  enabled: boolean,
  originToken: Token | undefined,
  searchForLowestFee: boolean = false,
) {
  const multiProvider = useMultiProvider();
  const warpCore = useWarpCore();
  const debouncedAmount = useDebounce(amount, 500);

  const { accounts } = useAccounts(multiProvider);
  const { address: sender, publicKey: senderPubKey } = getAccountAddressAndPubKey(
    multiProvider,
    originToken?.chainName,
    accounts,
  );

  const isFormValid = !!(originToken && destination && debouncedAmount && recipient && sender);
  const shouldFetch = enabled && isFormValid;

  const { isLoading, isError, data, isFetching } = useQuery({
    // The WarpCore class is not serializable, so we can't use it as a key
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: [
      'useFeeQuotes',
      tokenIndex,
      destination,
      sender,
      senderPubKey,
      debouncedAmount,
      recipient,
    ],
    queryFn: () =>
      fetchFeeQuotes(
        warpCore,
        originToken,
        destination,
        sender,
        senderPubKey,
        debouncedAmount,
        recipient,
        searchForLowestFee,
      ),
    enabled: shouldFetch,
    refetchInterval: FEE_QUOTE_REFRESH_INTERVAL,
  });

  return { isLoading: isLoading || isFetching, isError, fees: data };
}

async function fetchFeeQuotes(
  warpCore: WarpCore,
  originToken: Token | undefined,
  destination?: ChainName,
  sender?: Address,
  senderPubKey?: Promise<HexString>,
  amount?: string,
  recipient?: string,
  searchForLowestFee: boolean = false,
): Promise<WarpCoreFeeEstimate | null> {
  if (!originToken || !destination || !sender || !originToken || !amount || !recipient) return null;
  let transferToken = originToken;
  const amountWei = toWei(amount, transferToken.decimals);

  // when true attempt to get route with lowest fee
  if (searchForLowestFee) {
    const destinationToken = originToken.getConnectionForChain(destination)?.token;
    if (destinationToken) {
      transferToken = await getLowestFeeTransferToken(
        warpCore,
        originToken,
        destinationToken,
        amountWei,
        recipient,
        sender,
      );
    }
  }

  const originTokenAmount = transferToken.amount(amountWei);
  logger.debug('Fetching fee quotes');
  const fees = await warpCore.estimateTransferRemoteFees({
    originTokenAmount,
    destination,
    sender,
    senderPubKey: await senderPubKey,
    recipient: recipient,
  });
  return correctSealevelLocalFee(fees, transferToken);
}

// Workaround for a bug in @hyperlane-xyz/sdk's estimateTransactionFeeSolanaWeb3:
// it returns `unitsConsumed * prioritizationFee` without the
// microLamports → lamports conversion (missing /1_000_000), inflating the local
// quote by ~1e6×. It also omits Solana's base 5000-lamport-per-signature fee.
// A warp transferRemote tx is signed by the sender and an ephemeral random
// keypair (see SealevelTokenAdapter), so 2 signatures = 10_000 lamports base.
function correctSealevelLocalFee(
  fees: WarpCoreFeeEstimate | null,
  originToken: Token,
): WarpCoreFeeEstimate | null {
  if (!fees || originToken.protocol !== ProtocolType.Sealevel) return fees;
  const SOLANA_BASE_FEE_LAMPORTS = 10_000n;
  const corrected = fees.localQuote.amount / 1_000_000n + SOLANA_BASE_FEE_LAMPORTS;
  return {
    ...fees,
    localQuote: new TokenAmount(corrected, fees.localQuote.token),
  };
}
