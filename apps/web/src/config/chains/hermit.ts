import type { ChainInfo } from '@safe-global/safe-gateway-typescript-sdk'
import { GAS_PRICE_TYPE, RPC_AUTHENTICATION } from '@safe-global/safe-gateway-typescript-sdk'

export const hermitChain: ChainInfo = {
  chainId: '387159',
  chainName: 'Hermit',
  blockExplorerUriTemplate: {
    address: 'https://scan.hermit.plus/address/{{address}}',
    txHash: 'https://scan.hermit.plus/tx/{{txHash}}',
    api: 'https://scan.hermit.plus/api',
  },
  nativeCurrency: {
    name: 'GHM',
    symbol: 'GHM',
    decimals: 18,
    logoUri: 'https://safe-transaction-assets.safe.global/chains/387159/currency_logo.png',
  },
  transactionService: 'http://localhost:8000',
  l2: false,
  features: ['DOMAIN_LOOKUP', 'SAFE_APPS', 'ERC721'] as any,
  gasPrice: [
    {
      type: GAS_PRICE_TYPE.ORACLE,
      uri: 'https://scan.hermit.plus/api',
      gasParameter: 'standard',
      gweiFactor: '1000000000',
    },
  ],
  disabledWallets: ['lattice'],
  ensRegistryAddress: null,
  shortName: 'hermit',
  rpcUri: {
    authentication: RPC_AUTHENTICATION.NO_AUTHENTICATION,
    value: 'https://rpc1.hermitlk.com',
  },
  safeAppsRpcUri: {
    authentication: RPC_AUTHENTICATION.NO_AUTHENTICATION,
    value: 'https://rpc1.hermitlk.com',
  },
  publicRpcUri: {
    authentication: RPC_AUTHENTICATION.NO_AUTHENTICATION,
    value: 'https://rpc1.hermitlk.com',
  },
  theme: {
    backgroundColor: '#48A9A6',
    textColor: '#ffffff',
  },
  chainLogoUri: 'https://safe-transaction-assets.safe.global/chains/387159/chain_logo.png',
  contractAddresses: {
    createCallAddress: null,
    fallbackHandlerAddress: null,
    multiSendAddress: '0x909ba109AD91873CC7090f62aB739d5fff52959D',
    multiSendCallOnlyAddress: '0x5b3695b1ED7BfE6Ab44e11D3a39B48c541EB1b23',
    safeProxyFactoryAddress: '0x95108F064D41ef26f8444c7F8547bAb38F9D9167',
    safeSingletonAddress: '0xc58fD683d3B22A8172E7a2D365398579a9b1C7Bd',
    safeWebAuthnSignerFactoryAddress: null,
    signMessageLibAddress: null,
    simulateTxAccessorAddress: null,
  },
  balancesProvider: { chainName: 'hermit', enabled: true },
  description: 'Hermit Network - 多签钱包网络',
  isTestnet: false,
  recommendedMasterCopyVersion: '1.4.1',
}
