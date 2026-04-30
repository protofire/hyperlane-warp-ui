import {
  eclipsemainnet,
  eclipsemainnetAddresses,
  solanamainnet,
  solaxy,
  solaxyAddresses,
  sonicsvm,
  sonicsvmAddresses,
  soon,
  soonAddresses,
} from '@hyperlane-xyz/registry';
import { ChainMap, ChainMetadata } from '@hyperlane-xyz/sdk';

// Override registry's canonical Hyperlane Labs solanamainnet core with the AMN⇄Solana
// bridge's private deployment. The registry ships canonical Hyperlane addresses, but this
// bridge runs its own Solana core (Phase B; see deployments/autonomys-solana-mainnet/LEDGER.md).
// Warp programs (Fspt3tEJ… SOL, and AI3 once D.1 lands) bake `mailbox = H9fQ4J…` into their
// PDA and reject anything else with IncorrectProgramId (processor.rs:308-311).
const solanamainnetAddresses = {
  mailbox: 'H9fQ4JAahkhbNk1eMQd43WYhXYBXT7LMsZ9eXPMo6NrM',
  merkleTreeHook: 'H9fQ4JAahkhbNk1eMQd43WYhXYBXT7LMsZ9eXPMo6NrM',
  interchainGasPaymaster: '4BdGAVnK4eY3PzEaLV7USzTcmaKteaNUaWhjfHaVUiBJ',
  interchainSecurityModule: 'E4eiycW8PS5AQAdYCyQBcRuyEZiaFP2ghXSBBTDnCCqe',
  validatorAnnounce: '3nnF9TNNfuboAT49ZeCbu6Wqb3QJLcM9UeCsRBGokmng',
};

// A map of chain names to ChainMetadata
// Chains can be defined here, in chains.json, or in chains.yaml
// Chains already in the SDK need not be included here unless you want to override some fields
// Schema here: https://github.com/hyperlane-xyz/hyperlane-monorepo/blob/main/typescript/sdk/src/metadata/chainMetadataTypes.ts
export const chains: ChainMap<ChainMetadata & { mailbox?: Address }> = {
  solanamainnet: {
    ...solanamainnet,
    // SVM chains require mailbox addresses for the token adapters.
    mailbox: solanamainnetAddresses.mailbox,
    rpcUrls: [{ http: 'https://api.mainnet.solana.com' }],
  },
  eclipsemainnet: {
    ...eclipsemainnet,
    mailbox: eclipsemainnetAddresses.mailbox,
  },
  soon: {
    ...soon,
    mailbox: soonAddresses.mailbox,
  },
  sonicsvm: {
    ...sonicsvm,
    mailbox: sonicsvmAddresses.mailbox,
  },
  solaxy: {
    ...solaxy,
    mailbox: solaxyAddresses.mailbox,
  },
  // mycustomchain: {
  //   protocol: ProtocolType.Ethereum,
  //   chainId: 123123,
  //   domainId: 123123,
  //   name: 'mycustomchain',
  //   displayName: 'My Chain',
  //   nativeToken: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  //   rpcUrls: [{ http: 'https://mycustomchain-rpc.com' }],
  //   blockExplorers: [
  //     {
  //       name: 'MyCustomScan',
  //       url: 'https://mycustomchain-scan.com',
  //       apiUrl: 'https://api.mycustomchain-scan.com/api',
  //       family: ExplorerFamily.Etherscan,
  //     },
  //   ],
  //   blocks: {
  //     confirmations: 1,
  //     reorgPeriod: 1,
  //     estimateBlockTime: 10,
  //   },
  //   logoURI: '/logo.svg',
  // },
};

// rent account payment for (mostly for) SVM chains added on top of IGP,
// not exact but should be pretty close to actual payment
export const chainsRentEstimate: ChainMap<bigint> = {
  eclipsemainnet: BigInt(Math.round(0.00004019 * 10 ** 9)),
  solanamainnet: BigInt(Math.round(0.00411336 * 10 ** 9)),
  sonicsvm: BigInt(Math.round(0.00411336 * 10 ** 9)),
  soon: BigInt(Math.round(0.00000355 * 10 ** 9)),
};
