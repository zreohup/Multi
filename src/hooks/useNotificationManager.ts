import { useCallback, useEffect, useRef } from 'react'
import { AppState, Platform } from 'react-native'
import NotificationsService from '@/src/services/notifications/NotificationService'
import useRegisterForNotifications from '@/src/hooks/useRegisterForNotifications'
import Logger from '@/src/utils/logger'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import {
  selectAppNotificationStatus,
  selectPromptAttempts,
  toggleDeviceNotifications,
  updatePromptAttempts,
} from '../store/notificationsSlice'
import { selectActiveSafe } from '../store/activeSafeSlice'
import { selectSafeSubscriptionStatus } from '../store/safeSubscriptionsSlice'

export const useNotificationManager = () => {
  const dispatch = useAppDispatch()
  const promptAttempts = useAppSelector(selectPromptAttempts)
  const isAppNotificationEnabled = useAppSelector(selectAppNotificationStatus)
  const activeSafe = useAppSelector(selectActiveSafe)
  const isSubscribed = useAppSelector((state) =>
    activeSafe ? selectSafeSubscriptionStatus(state, activeSafe.address, activeSafe.chainId) : false,
  )
  const isAndroid = Platform.OS === 'android'
  const promptThreshold = isAndroid ? 3 : 2
  const { registerForNotifications, unregisterForNotifications, updatePermissionsForNotifications, isLoading } =
    useRegisterForNotifications()

  const appState = useRef(AppState.currentState)

  // Using a ref instead of state to ensure the value persists across app background/foreground cycles
  const pendingPermissionRequestRef = useRef(false)

  const requestAndRegister = useCallback(
    async (updateNotificationSettings = true, openSettingsOnDenied = false) => {
      const { permission } = await NotificationsService.getAllPermissions()

      if (permission === 'granted') {
        const { loading, error } = await registerForNotifications(updateNotificationSettings)

        pendingPermissionRequestRef.current = false

        if (!loading && !error) {
          dispatch(toggleDeviceNotifications(true))
          return true
        }
      } else if (openSettingsOnDenied) {
        pendingPermissionRequestRef.current = true
        await NotificationsService.getAllPermissions(true)
      }

      return false
    },
    [dispatch, registerForNotifications],
  )

  const enableNotification = useCallback(async () => {
    try {
      Logger.info('enableNotification :: STARTED', { promptAttempts })
      // Check if device notifications are enabled
      const deviceNotificationStatus = await NotificationsService.isDeviceNotificationEnabled()

      if (deviceNotificationStatus) {
        const { loading, error } = await registerForNotifications()

        if (!loading && !error) {
          dispatch(toggleDeviceNotifications(true))
          return true
        }
        return false
      } else if (promptAttempts < promptThreshold) {
        dispatch(updatePromptAttempts(promptAttempts + 1))
        return await requestAndRegister()
      } else {
        pendingPermissionRequestRef.current = true
        await NotificationsService.getAllPermissions(true)
      }
    } catch (error) {
      pendingPermissionRequestRef.current = false
      Logger.error('Error enabling push notifications', error)
      return false
    }
  }, [dispatch, registerForNotifications, promptAttempts, requestAndRegister, promptThreshold])

  const disableNotification = useCallback(async () => {
    try {
      const { loading, error } = await unregisterForNotifications()
      if (!loading && !error) {
        return true
      }
      return false
    } catch (error) {
      Logger.error('Error disabling push notifications', error)
      return false
    }
  }, [unregisterForNotifications])

  const toggleNotificationState = useCallback(async () => {
    if (!activeSafe) {
      return
    }
    try {
      const deviceNotificationStatus = await NotificationsService.isDeviceNotificationEnabled()

      if (!isSubscribed) {
        if (!deviceNotificationStatus) {
          const success = await requestAndRegister(false, true)
          if (success) {
            return true
          }
          // Don't clear the flag here if not granted immediately
        } else {
          await registerForNotifications(false)
        }
      } else {
        await unregisterForNotifications(false)
      }
    } catch (error) {
      pendingPermissionRequestRef.current = false
      Logger.error('Error toggling notifications', error)
    }
  }, [isSubscribed, registerForNotifications, unregisterForNotifications, dispatch, activeSafe, requestAndRegister])

  const updateNotificationPermissions = useCallback(async () => {
    try {
      const { loading, error } = await updatePermissionsForNotifications()

      if (!loading && !error) {
        return true
      }
    } catch (error) {
      Logger.error('Error updating push notifications permissions', error)
      return false
    }
  }, [updatePermissionsForNotifications])

  useEffect(() => {
    const subscription = AppState.addEventListener('change', async (nextAppState) => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        // App has come to the foreground
        const deviceNotificationStatus = await NotificationsService.isDeviceNotificationEnabled()

        // CASE 1: App notifications enabled but device notifications disabled
        // Action: Disable app notifications to keep in sync
        if (!deviceNotificationStatus && isAppNotificationEnabled) {
          await disableNotification()
        }

        // CASE 2: Device notifications enabled but app notifications disabled
        // Action: Only enable app notifications if we were waiting for the user to return from settings
        else if (deviceNotificationStatus && !isAppNotificationEnabled && pendingPermissionRequestRef.current) {
          await registerForNotifications()
          // Clear the pending flag after handling
          pendingPermissionRequestRef.current = false
        }
      }

      appState.current = nextAppState
    })

    return () => {
      subscription.remove()
    }
  }, [isAppNotificationEnabled, registerForNotifications, disableNotification])

  return {
    isAppNotificationEnabled,
    enableNotification,
    disableNotification,
    toggleNotificationState,
    updateNotificationPermissions,
    isLoading,
  }
}
