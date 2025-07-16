import { SafeOverview } from '@safe-global/store/gateway/AUTO_GENERATED/safes'
import { SafeInfo } from '../types/address'
import { FirebaseMessagingTypes } from '@react-native-firebase/messaging'
import { Dimensions } from 'react-native'

export const WINDOW_HEIGHT = Dimensions.get('window').height
export const WINDOW_WIDTH = Dimensions.get('window').width
export const Layout = {
  window: {
    width: WINDOW_WIDTH,
    height: WINDOW_HEIGHT,
  },
  isSmallDevice: WINDOW_WIDTH < 375,
}

export const mockedActiveAccount: SafeInfo = {
  address: '0xA77DE01e157f9f57C7c4A326eeE9C4874D0598b6',
  chainId: '1',
}

export const mockedActiveSafeInfo: SafeOverview = {
  address: { value: '0xA77DE01e157f9f57C7c4A326eeE9C4874D0598b6', name: null, logoUri: null },
  awaitingConfirmation: null,
  chainId: mockedActiveAccount.chainId,
  fiatTotal: '758.926',
  owners: [{ value: '0xA77DE01e157f9f57C7c4A326eeE9C4874D0598b6', name: null, logoUri: null }],
  queued: 1,
  threshold: 1,
}

export const mockedAccounts = [
  mockedActiveSafeInfo,
  {
    address: { value: '0xc7c2E116A3027D0BFd9817781c717A81a8bC5518', name: null, logoUri: null },
    awaitingConfirmation: null,
    chainId: '42161',
    fiatTotal: '0',
    owners: [{ value: '0xc7c2E116A3027D0BFd9817781c717A81a8bC5518', name: null, logoUri: null }],
    queued: 1,
    threshold: 1,
  },
  {
    address: { value: '0xF7a47Bf5705572B7EB9cb0F7007C66B770Ea120f', name: null, logoUri: null },
    awaitingConfirmation: null,
    chainId: '100',
    fiatTotal: '0',
    owners: [{ value: '0xF7a47Bf5705572B7EB9cb0F7007C66B770Ea120f', name: null, logoUri: null }],
    queued: 1,
    threshold: 1,
  },
  {
    address: { value: '0x7bF7cF1D8375ad2B25B9050FeF93181ec3E15f08', name: null, logoUri: null },
    awaitingConfirmation: null,
    chainId: '1',
    fiatTotal: '0',
    owners: [{ value: '0x7bF7cF1D8375ad2B25B9050FeF93181ec3E15f08', name: null, logoUri: null }],
    queued: 1,
    threshold: 1,
  },
  {
    address: {
      value: '0xF7a47Bf5705572B7EB9cb0F7007C66B770Ea120f',
      name: null,
      logoUri: null,
    },
    chainId: '11155111',
    threshold: 2,
    owners: [
      {
        value: '0x79964FA459D36EbFfc2a2cA66321B689F6E4aC52',
        name: null,
        logoUri: null,
      },
      {
        value: '0xDa5e9FA404881Ff36DDa97b41Da402dF6430EE6b',
        name: null,
        logoUri: null,
      },
      {
        value: '0x4cF25c77De50baBAB44c6BcC76D88624DDb3EbBE',
        name: null,
        logoUri: null,
      },
    ],
    fiatTotal: '138.558',
    queued: 0,
    awaitingConfirmation: 0,
  },
]

export const mockedChains = [
  {
    balancesProvider: { chainName: 'hermit', enabled: true },
    beaconChainExplorerUriTemplate: { publicKey: null },
    blockExplorerUriTemplate: {
      address: 'https://scan.hermit.plus/address/{{address}}',
      api: 'https://scan.hermit.plus/api?module={{module}}&action={{action}}&address={{address}}&apiKey={{apiKey}}',
      txHash: 'https://scan.hermit.plus/tx/{{txHash}}',
    },
    chainId: '387159',
    chainLogoUri: 'https://safe-transaction-assets.safe.global/chains/387159/chain_logo.png',
    chainName: 'Hermit',
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
    description: 'Hermit Network - 多签钱包网络',
    disabledWallets: [
      'keystone',
      'ledger_v2',
      'NONE',
      'opera',
      'operaTouch',
      'pk',
      'safeMobile',
      'socialSigner',
      'tally',
      'trust',
      'walletConnect',
    ],
    ensRegistryAddress: null,
    features: [
      'COUNTERFACTUAL',
      'DEFAULT_TOKENLIST',
      'DELETE_TX',
      'EIP1271',
      'ERC721',
      'MULTI_CHAIN_SAFE_ADD_NETWORK',
      'MULTI_CHAIN_SAFE_CREATION',
      'NATIVE_WALLETCONNECT',
      'PROPOSERS',
      'PUSH_NOTIFICATIONS',
      'RECOVERY',
      'RELAYING',
      'RISK_MITIGATION',
      'SAFE_141',
      'SAFE_APPS',
      'SPEED_UP_TX',
      'TX_SIMULATION',
      'ZODIAC_ROLES',
    ],
    gasPrice: [],
    isTestnet: false,
    l2: false,
    nativeCurrency: {
      decimals: 18,
      logoUri: 'https://safe-transaction-assets.safe.global/chains/387159/currency_logo.png',
      name: 'GHM',
      symbol: 'GHM',
    },
    publicRpcUri: { authentication: 'NO_AUTHENTICATION', value: 'https://rpc1.hermitlk.com' },
    rpcUri: { authentication: 'NO_AUTHENTICATION', value: 'https://rpc1.hermitlk.com' },
    safeAppsRpcUri: { authentication: 'NO_AUTHENTICATION', value: 'https://rpc1.hermitlk.com' },
    shortName: 'hermit',
    theme: { backgroundColor: '#48A9A6', textColor: '#ffffff' },
    transactionService: 'http://localhost:8000',
  },
  {
    balancesProvider: { chainName: 'xdai', enabled: true },
    beaconChainExplorerUriTemplate: { publicKey: null },
    blockExplorerUriTemplate: {
      address: 'https://gnosisscan.io/address/{{address}}',
      api: 'https://api.gnosisscan.io/api?module={{module}}&action={{action}}&address={{address}}&apiKey={{apiKey}}',
      txHash: 'https://gnosisscan.io/tx/{{txHash}}/',
    },
    chainId: '100',
    chainLogoUri: 'https://safe-transaction-assets.safe.global/chains/100/chain_logo.png',
    chainName: 'Gnosis Chain',
    contractAddresses: {
      createCallAddress: null,
      fallbackHandlerAddress: null,
      multiSendAddress: null,
      multiSendCallOnlyAddress: null,
      safeProxyFactoryAddress: null,
      safeSingletonAddress: null,
      safeWebAuthnSignerFactoryAddress: null,
      signMessageLibAddress: null,
      simulateTxAccessorAddress: null,
    },
    description: '',
    disabledWallets: [
      'keystone',
      'ledger_v2',
      'NONE',
      'opera',
      'operaTouch',
      'pk',
      'safeMobile',
      'tally',
      'trust',
      'walletConnect',
    ],
    ensRegistryAddress: null,
    features: [
      'COUNTERFACTUAL',
      'DEFAULT_TOKENLIST',
      'DELETE_TX',
      'EIP1271',
      'EIP1559',
      'ERC721',
      'MULTI_CHAIN_SAFE_ADD_NETWORK',
      'MULTI_CHAIN_SAFE_CREATION',
      'NATIVE_SWAPS',
      'NATIVE_SWAPS_FEE_ENABLED',
      'NATIVE_WALLETCONNECT',
      'PROPOSERS',
      'PUSH_NOTIFICATIONS',
      'RECOVERY',
      'RELAYING',
      'RELAYING_MOBILE',
      'RISK_MITIGATION',
      'SAFE_141',
      'SAFE_APPS',
      'SPEED_UP_TX',
      'SPENDING_LIMIT',
      'TX_SIMULATION',
      'ZODIAC_ROLES',
    ],
    gasPrice: [],
    isTestnet: false,
    l2: true,
    nativeCurrency: {
      decimals: 18,
      logoUri: 'https://safe-transaction-assets.safe.global/chains/100/currency_logo.png',
      name: 'xDai',
      symbol: 'XDAI',
    },
    publicRpcUri: { authentication: 'NO_AUTHENTICATION', value: 'https://rpc.gnosischain.com/' },
    rpcUri: { authentication: 'NO_AUTHENTICATION', value: 'https://rpc.gnosischain.com/' },
    safeAppsRpcUri: { authentication: 'NO_AUTHENTICATION', value: 'https://rpc.gnosischain.com/' },
    shortName: 'gno',
    theme: { backgroundColor: '#48A9A6', textColor: '#ffffff' },
    transactionService: 'https://safe-transaction-gnosis-chain.safe.global',
  },
  {
    balancesProvider: { chainName: 'polygon', enabled: true },
    beaconChainExplorerUriTemplate: { publicKey: null },
    blockExplorerUriTemplate: {
      address: 'https://polygonscan.com/address/{{address}}',
      api: 'https://api.polygonscan.com/api?module={{module}}&action={{action}}&address={{address}}&apiKey={{apiKey}}',
      txHash: 'https://polygonscan.com/tx/{{txHash}}',
    },
    chainId: '137',
    chainLogoUri: 'https://safe-transaction-assets.safe.global/chains/137/chain_logo.png',
    chainName: 'Polygon',
    contractAddresses: {
      createCallAddress: null,
      fallbackHandlerAddress: null,
      multiSendAddress: null,
      multiSendCallOnlyAddress: null,
      safeProxyFactoryAddress: null,
      safeSingletonAddress: null,
      safeWebAuthnSignerFactoryAddress: null,
      signMessageLibAddress: null,
      simulateTxAccessorAddress: null,
    },
    description: 'L2 chain',
    disabledWallets: [
      'keystone',
      'ledger_v2',
      'NONE',
      'opera',
      'operaTouch',
      'pk',
      'safeMobile',
      'socialSigner',
      'tally',
      'trezor',
      'trust',
      'walletConnect',
    ],
    ensRegistryAddress: null,
    features: [
      'COUNTERFACTUAL',
      'DEFAULT_TOKENLIST',
      'DELETE_TX',
      'EIP1271',
      'EIP1559',
      'ERC721',
      'MOONPAY_MOBILE',
      'MULTI_CHAIN_SAFE_ADD_NETWORK',
      'MULTI_CHAIN_SAFE_CREATION',
      'NATIVE_WALLETCONNECT',
      'PROPOSERS',
      'PUSH_NOTIFICATIONS',
      'RECOVERY',
      'RELAYING',
      'RISK_MITIGATION',
      'SAFE_141',
      'SAFE_APPS',
      'SPEED_UP_TX',
      'SPENDING_LIMIT',
      'TX_SIMULATION',
      'ZODIAC_ROLES',
    ],
    gasPrice: [],
    isTestnet: false,
    l2: true,
    nativeCurrency: {
      decimals: 18,
      logoUri: 'https://safe-transaction-assets.safe.global/chains/137/currency_logo.png',
      name: 'POL (ex-MATIC)',
      symbol: 'POL',
    },
    publicRpcUri: { authentication: 'NO_AUTHENTICATION', value: 'https://polygon-rpc.com' },
    rpcUri: { authentication: 'API_KEY_PATH', value: 'https://polygon-mainnet.infura.io/v3/' },
    safeAppsRpcUri: { authentication: 'API_KEY_PATH', value: 'https://polygon-mainnet.infura.io/v3/' },
    shortName: 'matic',
    theme: { backgroundColor: '#8248E5', textColor: '#ffffff' },
    transactionService: 'https://safe-transaction-polygon.safe.global',
  },
  {
    balancesProvider: { chainName: 'arbitrum', enabled: true },
    beaconChainExplorerUriTemplate: { publicKey: null },
    blockExplorerUriTemplate: {
      address: 'https://arbiscan.io/address/{{address}}',
      api: 'https://api.arbiscan.io/api?module={{module}}&action={{action}}&address={{address}}&apiKey={{apiKey}}',
      txHash: 'https://arbiscan.io/tx/{{txHash}}',
    },
    chainId: '42161',
    chainLogoUri: 'https://safe-transaction-assets.safe.global/chains/42161/chain_logo.png',
    chainName: 'Arbitrum',
    contractAddresses: {
      createCallAddress: null,
      fallbackHandlerAddress: null,
      multiSendAddress: null,
      multiSendCallOnlyAddress: null,
      safeProxyFactoryAddress: null,
      safeSingletonAddress: null,
      safeWebAuthnSignerFactoryAddress: null,
      signMessageLibAddress: null,
      simulateTxAccessorAddress: null,
    },
    description: '',
    disabledWallets: [
      'keystone',
      'ledger_v2',
      'NONE',
      'opera',
      'operaTouch',
      'pk',
      'safeMobile',
      'socialSigner',
      'tally',
      'trust',
      'walletConnect',
    ],
    ensRegistryAddress: null,
    features: [
      'COUNTERFACTUAL',
      'DEFAULT_TOKENLIST',
      'DELETE_TX',
      'EIP1271',
      'ERC721',
      'MOONPAY_MOBILE',
      'MULTI_CHAIN_SAFE_ADD_NETWORK',
      'MULTI_CHAIN_SAFE_CREATION',
      'NATIVE_SWAPS',
      'NATIVE_SWAPS_FEE_ENABLED',
      'NATIVE_WALLETCONNECT',
      'PROPOSERS',
      'PUSH_NOTIFICATIONS',
      'RECOVERY',
      'RISK_MITIGATION',
      'SAFE_141',
      'SAFE_APPS',
      'SPEED_UP_TX',
      'TX_SIMULATION',
      'ZODIAC_ROLES',
    ],
    gasPrice: [],
    isTestnet: false,
    l2: true,
    nativeCurrency: {
      decimals: 18,
      logoUri: 'https://safe-transaction-assets.safe.global/chains/42161/currency_logo.png',
      name: 'AETH',
      symbol: 'AETH',
    },
    publicRpcUri: { authentication: 'NO_AUTHENTICATION', value: 'https://arb1.arbitrum.io/rpc' },
    rpcUri: { authentication: 'NO_AUTHENTICATION', value: 'https://arb1.arbitrum.io/rpc' },
    safeAppsRpcUri: { authentication: 'NO_AUTHENTICATION', value: 'https://arb1.arbitrum.io/rpc' },
    shortName: 'arb1',
    theme: { backgroundColor: '#28A0F0', textColor: '#ffffff' },
    transactionService: 'https://safe-transaction-arbitrum.safe.global',
  },
]

export enum STORAGE_IDS {
  SAFE = 'safe',
  NOTIFICATIONS = 'notifications',
  GLOBAL_PUSH_NOTIFICATION_SETTINGS = 'globalNotificationSettings',
  SAFE_FCM_TOKEN = 'safeFcmToken',
  PUSH_NOTIFICATIONS_PROMPT_COUNT = 'pushNotificationsPromptCount',
  PUSH_NOTIFICATIONS_PROMPT_TIME = 'pushNotificationsPromptTime',
  DEVICE_ID_STORAGE_KEY = 'pns=deviceId',
  DEFAULT_NOTIFICATION_CHANNEL_ID = 'DEFAULT_NOTIFICATION_CHANNEL_ID',
  ANNOUNCEMENT_NOTIFICATION_CHANNEL_ID = 'ANNOUNCEMENT_NOTIFICATION_CHANNEL_ID',
  DEFAULT_PUSH_NOTIFICATION_CHANNEL_PRIORITY = 'high',
  REQUEST_PERMISSION_ASKED = 'REQUEST_PERMISSION_ASKED',
  REQUEST_PERMISSION_GRANTED = 'REQUEST_PERMISSION_GRANTED',
  NOTIFICATION_DATE_FORMAT = 'DD/MM/YYYY HH:mm:ss',
  NOTIFICATIONS_SETTINGS = 'notifications-settings',
  PN_USER_STORAGE = 'safePnUserStorage',
  NOTIFICATION_EXTENSION_DATA = 'notification-extension-data',
}

export enum STORAGE_TYPES {
  STRING = 'string',
  BOOLEAN = 'boolean',
  NUMBER = 'number',
  OBJECT = 'object',
}

// Map all non string storage ids to their respective types
export const mapStorageTypeToIds = (id: STORAGE_IDS): STORAGE_TYPES => {
  switch (id) {
    case STORAGE_IDS.NOTIFICATIONS:
    case STORAGE_IDS.GLOBAL_PUSH_NOTIFICATION_SETTINGS:
    case STORAGE_IDS.SAFE_FCM_TOKEN:
    case STORAGE_IDS.NOTIFICATIONS_SETTINGS:
    case STORAGE_IDS.PN_USER_STORAGE:
    case STORAGE_IDS.NOTIFICATION_EXTENSION_DATA:
      return STORAGE_TYPES.OBJECT
    case STORAGE_IDS.PUSH_NOTIFICATIONS_PROMPT_COUNT:
      return STORAGE_TYPES.NUMBER
    case STORAGE_IDS.REQUEST_PERMISSION_ASKED:
    case STORAGE_IDS.REQUEST_PERMISSION_GRANTED:
      return STORAGE_TYPES.BOOLEAN
    default:
      return STORAGE_TYPES.STRING
  }
}

export type HandleNotificationCallback = (data: FirebaseMessagingTypes.RemoteMessage['data'] | undefined) => void

export enum PressActionId {
  OPEN_NOTIFICATIONS_VIEW = 'open-notifications-view-press-action-id',
  OPEN_TRANSACTION_VIEW = 'open-transactions-view-press-action-id',
}

const IS_DEV = process.env.EXPO_PUBLIC_APP_VARIANT === 'development'

export const LAUNCH_ACTIVITY = IS_DEV ? 'global.safe.mobileapp.dev.MainActivity' : 'global.safe.mobileapp.MainActivity'

export const ERROR_MSG = 'useDelegateKey: Something went wrong'

export enum NOTIFICATION_ACCOUNT_TYPE {
  REGULAR = 'REGULAR',
  OWNER = 'OWNER',
}
