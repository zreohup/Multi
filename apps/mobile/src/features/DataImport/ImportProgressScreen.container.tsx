import React, { useEffect, useState, useRef } from 'react'
import { useRouter } from 'expo-router'
import { useDataImportContext } from './context/DataImportProvider'
import { useAppDispatch, useAppSelector } from '@/src/store/hooks'
import { selectCurrency } from '@/src/store/settingsSlice'
import Logger from '@/src/utils/logger'
import {
  storeSafes,
  storeContacts,
  LegacyDataStructure,
  fetchSafeOwnersInBatches,
  storeKeysWithValidation,
} from './helpers/transforms'
import { ImportProgressScreenView } from './components/ImportProgressScreenView'

export const ImportProgressScreen = () => {
  const router = useRouter()
  const { importedData, updateNotImportedKeys } = useDataImportContext()
  const dispatch = useAppDispatch()
  const currency = useAppSelector(selectCurrency)

  const [progress, setProgress] = useState(0)
  const hasImportStarted = useRef(false)

  useEffect(() => {
    if (!importedData?.data) {
      router.back()
      return
    }

    // Prevent multiple imports
    if (hasImportStarted.current) {
      Logger.info('Import already in progress, skipping...')
      return
    }

    const performImport = async () => {
      try {
        // Set the flag to prevent multiple imports
        hasImportStarted.current = true

        const data = importedData.data as LegacyDataStructure

        // Step 1: Fetch safe information to get owners
        setProgress(10)
        Logger.info('Starting safe information fetch...')

        const safeInfos =
          data.safes?.map((safe) => ({
            address: safe.address,
            chainId: safe.chain,
          })) || []

        const allOwners = await fetchSafeOwnersInBatches(safeInfos, currency, dispatch)
        setProgress(33)

        // Step 2: Import Safe Accounts
        Logger.info('Starting safe import...')
        storeSafes(data, dispatch)
        setProgress(50)

        // Step 3: Import Signers/Private Keys with validation
        Logger.info('Starting key import with validation...')
        await storeKeysWithValidation(data, allOwners, dispatch, updateNotImportedKeys)
        setProgress(75)

        // Step 4: Import Address Book/Contacts
        Logger.info('Starting contacts import...')
        storeContacts(data, dispatch)
        setProgress(100)

        // Wait a bit to show completion
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Navigate to success screen
        router.push('/import-data/import-success')
      } catch (error) {
        Logger.error('Import failed:', error)
        // Reset the flag on error so user can retry
        hasImportStarted.current = false
        // Navigate back to review screen on error
        router.back()
      }
    }

    performImport()
  }, [importedData, dispatch, router, currency])

  return <ImportProgressScreenView progress={progress} />
}
