import React from 'react'

import '@testing-library/react-native'
import mockRNDeviceInfo from 'react-native-device-info/jest/react-native-device-info-mock'
import mockSafeAreaContext from 'react-native-safe-area-context/jest/mock'

import { server } from './server'

jest.useFakeTimers()

/**
 *  This mock is necessary because useFonts is async and we get an error
 *  Warning: An update to FontProvider inside a test was not wrapped in act(...)
 */
jest.mock('expo-font', () => ({
  useFonts: () => [true],
  isLoaded: () => true,
}))

jest.mock('@/src/navigation/useScrollableHeader', () => ({
  useScrollableHeader: () => ({
    handleScroll: jest.fn(),
  }),
}))

jest.mock('react-native-mmkv', () => ({
  MMKV: function () {
    // @ts-ignore
    this.getString = jest.fn()
    // @ts-ignore
    this.delete = jest.fn()
    // @ts-ignore
    this.set = jest.fn()
  },
}))

jest.mock('react-native-device-info', () => mockRNDeviceInfo)
jest.mock('react-native-device-crypto', () => {
  return {
    getOrCreateAsymmetricKey: jest.fn(),
    encrypt: jest.fn((_asymmetricKey: string, privateKey: string) => {
      return Promise.resolve({
        encryptedText: 'encryptedText',
        iv: privateKey + '000',
      })
    }),
    decrypt: jest.fn((_name, _password, iv) => Promise.resolve(iv.slice(0, -3))),
  }
})

jest.mock('react-native-keychain', () => {
  let password: string | null = null
  return {
    setGenericPassword: jest.fn((_user, newPassword: string) => {
      password = newPassword

      return Promise.resolve(password)
    }),
    getGenericPassword: jest.fn(() =>
      Promise.resolve({
        password,
      }),
    ),
    resetGenericPassword: jest.fn(() => {
      password = null
      Promise.resolve(null)
    }),
    ACCESS_CONTROL: {
      BIOMETRY_CURRENT_SET_OR_DEVICE_PASSCODE: 'BIOMETRY_CURRENT_SET_OR_DEVICE_PASSCODE',
    },
    ACCESSIBLE: {
      WHEN_UNLOCKED_THIS_DEVICE_ONLY: 'WHEN_UNLOCKED_THIS_DEVICE_ONLY',
    },
  }
})

jest.mock('expo-splash-screen', () => ({
  preventAutoHideAsync: jest.fn(),
  setOptions: jest.fn(),
  hideAsync: jest.fn(),
}))

jest.mock('redux-persist', () => {
  const real = jest.requireActual('redux-persist')
  return {
    ...real,
    persistReducer: jest.fn().mockImplementation((_, reducers) => reducers),
  }
})
jest.mock('redux-devtools-expo-dev-plugin', () => ({
  default: () => jest.fn(),
}))

jest.mock('@react-native-firebase/messaging', () => {
  const module = () => {
    return {
      getToken: jest.fn(() => Promise.resolve('fcmToken')),
      deleteToken: jest.fn(() => Promise.resolve()),
      subscribeToTopic: jest.fn(),
      unsubscribeFromTopic: jest.fn(),
      hasPermission: jest.fn(() => Promise.resolve(module.AuthorizationStatus.AUTHORIZED)),
      requestPermission: jest.fn(() => Promise.resolve(module.AuthorizationStatus.AUTHORIZED)),
      setBackgroundMessageHandler: jest.fn(() => Promise.resolve()),
      isDeviceRegisteredForRemoteMessages: jest.fn(() => Promise.resolve(false)),
      registerDeviceForRemoteMessages: jest.fn(() => Promise.resolve('registered')),
      unregisterDeviceForRemoteMessages: jest.fn(() => Promise.resolve('unregistered')),
      onMessage: jest.fn(),
      onTokenRefresh: jest.fn(),
    }
  }

  module.AuthorizationStatus = {
    NOT_DETERMINED: -1,
    DENIED: 0,
    AUTHORIZED: 1,
    PROVISIONAL: 2,
  }

  return module
})

jest.mock('@notifee/react-native', () => {
  const notifee = {
    getInitialNotification: jest.fn().mockResolvedValue(null),
    displayNotification: jest.fn().mockResolvedValue({}),
    onForegroundEvent: jest.fn().mockReturnValue(jest.fn()),
    onBackgroundEvent: jest.fn(),
    createChannelGroup: jest.fn().mockResolvedValue('channel-group-id'),
    createChannel: jest.fn().mockResolvedValue({}),
  }

  return {
    ...jest.requireActual('@notifee/react-native/dist/types/Notification'),
    __esModule: true,
    default: notifee,
    AndroidImportance: {
      NONE: 0,
      MIN: 1,
      LOW: 2,
      DEFAULT: 3,
      HIGH: 4,
    },
    AndroidVisibility: {
      SECRET: -1,
      PRIVATE: 0,
      PUBLIC: 1,
    },
  }
})

jest.mock('@gorhom/bottom-sheet', () => {
  const reactNative = jest.requireActual('react-native')
  const { useState, forwardRef, useImperativeHandle } = jest.requireActual('react')
  const { View } = reactNative
  const MockBottomSheetComponent = forwardRef(
    (
      {
        children,
        backdropComponent: Backdrop,
        backgroundComponent: Background,
      }: { backgroundComponent: React.FC<unknown>; backdropComponent: React.FC<unknown>; children: React.ReactNode },
      ref: React.ForwardedRef<unknown>,
    ) => {
      const [isOpened, setIsOpened] = useState()

      // Exposing some imperative methods to the parent.
      useImperativeHandle(ref, () => ({
        // Add methods here that can be accessed using the ref from parent
        present: () => {
          setIsOpened(true)
        },
        dismiss: () => {
          setIsOpened(false)
        },
      }))

      return isOpened ? (
        <>
          <Backdrop /> <Background />
          {children}
        </>
      ) : null
    },
  )

  MockBottomSheetComponent.displayName = 'MockBottomSheetComponent'

  return {
    __esModule: true,
    default: View,
    BottomSheetFooter: View,
    BottomSheetFooterContainer: View,
    BottomSheetModal: MockBottomSheetComponent,
    BottomSheetModalProvider: View,
    BottomSheetView: View,
    useBottomSheetModal: () => ({
      dismiss: () => {
        return null
      },
    }),
  }
})

jest.mock('@react-native-clipboard/clipboard', () => ({
  setString: jest.fn(),
  getString: jest.fn(),
}))

jest.mock('react-native-quick-crypto', () => ({
  default: {
    randomBytes: jest.fn((size) => Buffer.alloc(size)),
    createHash: jest.fn(() => ({
      update: jest.fn().mockReturnThis(),
      digest: jest.fn(() => Buffer.from('mockedHash')),
    })),
    pbkdf2Sync: jest.fn(() => Buffer.alloc(32)),
    createCipheriv: jest.fn(() => ({
      update: jest.fn(() => Buffer.from([])),
      final: jest.fn(() => Buffer.from([])),
      getAuthTag: jest.fn(() => Buffer.alloc(16)),
      setAuthTag: jest.fn(),
    })),
    createDecipheriv: jest.fn(() => ({
      update: jest.fn(() => Buffer.from([])),
      final: jest.fn(() => Buffer.from([])),
      setAuthTag: jest.fn(),
    })),
  },
  randomBytes: jest.fn((size) => Buffer.alloc(size)),
  createHash: jest.fn(() => ({
    update: jest.fn().mockReturnThis(),
    digest: jest.fn(() => Buffer.from('mockedHash')),
  })),
  pbkdf2Sync: jest.fn(() => Buffer.alloc(32)),
  createCipheriv: jest.fn(() => ({
    update: jest.fn(() => Buffer.from([])),
    final: jest.fn(() => Buffer.from([])),
    getAuthTag: jest.fn(() => Buffer.alloc(16)),
    setAuthTag: jest.fn(),
  })),
  createDecipheriv: jest.fn(() => ({
    update: jest.fn(() => Buffer.from([])),
    final: jest.fn(() => Buffer.from([])),
    setAuthTag: jest.fn(),
  })),
}))

jest.mock('react-native-safe-area-context', () => mockSafeAreaContext)

jest.mock('@react-native-firebase/analytics', () => {
  const mockAnalytics = {
    logEvent: jest.fn(() => Promise.resolve()),
    setAnalyticsCollectionEnabled: jest.fn(() => Promise.resolve()),
    setUserId: jest.fn(() => Promise.resolve()),
    setUserProperty: jest.fn(() => Promise.resolve()),
    setUserProperties: jest.fn(() => Promise.resolve()),
    resetAnalyticsData: jest.fn(() => Promise.resolve()),
    setDefaultEventParameters: jest.fn(() => Promise.resolve()),
    setSessionTimeoutDuration: jest.fn(() => Promise.resolve()),
  }

  return {
    __esModule: true,
    default: () => mockAnalytics,
    getAnalytics: jest.fn(() => mockAnalytics),
    firebase: {
      analytics: jest.fn(() => mockAnalytics),
    },
  }
})

jest.mock('@react-native-firebase/crashlytics', () => {
  const mockCrashlytics = {
    crash: jest.fn(() => Promise.resolve()),
    log: jest.fn(() => Promise.resolve()),
    recordError: jest.fn(() => Promise.resolve()),
    setAttribute: jest.fn(() => Promise.resolve()),
    setAttributes: jest.fn(() => Promise.resolve()),
    setUserId: jest.fn(() => Promise.resolve()),
    setCrashlyticsCollectionEnabled: jest.fn(() => Promise.resolve()),
    checkForUnsentReports: jest.fn(() => Promise.resolve(false)),
    deleteUnsentReports: jest.fn(() => Promise.resolve()),
    didCrashOnPreviousExecution: jest.fn(() => Promise.resolve(false)),
    sendUnsentReports: jest.fn(() => Promise.resolve()),
    setCustomKey: jest.fn(() => Promise.resolve()),
  }

  return {
    __esModule: true,
    default: () => mockCrashlytics,
    getCrashlytics: jest.fn(() => mockCrashlytics),
    firebase: {
      crashlytics: jest.fn(() => mockCrashlytics),
    },
  }
})

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
