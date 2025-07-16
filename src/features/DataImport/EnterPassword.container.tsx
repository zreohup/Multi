import React, { useCallback } from 'react'
import { useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useDataImportContext } from './context/DataImportProvider'
import { EnterPasswordView } from './components/EnterPasswordView'

export const EnterPassword = () => {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const { handlePasswordChange, handleImport, password, isLoading, fileName } = useDataImportContext()

  const handleDecrypt = useCallback(async () => {
    const result = await handleImport()
    if (result) {
      // Navigate to review data screen to show what will be imported
      router.push('/import-data/review-data')
    } else {
      // Navigate to error screen when import fails
      router.push('/import-data/import-error')
    }
    handlePasswordChange('')
  }, [handleImport, router])

  return (
    <EnterPasswordView
      topInset={insets.top}
      bottomInset={insets.bottom}
      password={password}
      isLoading={isLoading}
      fileName={fileName ?? undefined}
      onPasswordChange={handlePasswordChange}
      onDecrypt={handleDecrypt}
    />
  )
}
