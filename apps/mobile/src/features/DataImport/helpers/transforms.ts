export interface LegacyDataStructure {
  safes?: {
    address: string
    chain: string
    name: string
    threshold?: number
    owners?: string[]
  }[]
  contacts?: {
    address: string
    name: string
    chain: string
  }[]
  keys?: {
    address: string
    name: string
    key: string
  }[]
}

import { AppDispatch } from '@/src/store'
import { addSafe as _addSafe } from '@/src/store/safesSlice'
import { addSignerWithEffects as _addSignerWithEffects } from '@/src/store/signersSlice'
import { addContact as _addContact, addContacts, Contact } from '@/src/store/addressBookSlice'
import { storePrivateKey as _storePrivateKey } from '@/src/hooks/useSign/useSign'
import { SafeOverview } from '@safe-global/store/gateway/AUTO_GENERATED/safes'
import { AddressInfo } from '@safe-global/store/gateway/AUTO_GENERATED/transactions'
import { additionalSafesRtkApi } from '@safe-global/store/gateway/safes'
import { addSignerWithEffects } from '@/src/store/signersSlice'
import { storePrivateKey } from '@/src/hooks/useSign/useSign'
import Logger from '@/src/utils/logger'

export interface NotImportedKey {
  address: string
  name: string
  reason: string
}

export const transformSafeData = (safe: NonNullable<LegacyDataStructure['safes']>[0]): SafeOverview => {
  return {
    address: {
      value: safe.address,
      name: safe.name || null,
    },
    chainId: safe.chain,
    threshold: safe.threshold || 1,
    owners: (safe.owners || []).map((owner: string) => ({
      value: owner,
      name: null,
    })),
    fiatTotal: '0',
    queued: 0,
    awaitingConfirmation: null,
  }
}

export const transformKeyData = (
  key: NonNullable<LegacyDataStructure['keys']>[0],
): { address: string; privateKey: string; signerInfo: AddressInfo } => {
  const hexPrivateKey = `0x${Buffer.from(key.key, 'base64').toString('hex')}`

  const signerInfo: AddressInfo = {
    value: key.address,
    name: key.name || null,
  }

  return {
    address: key.address,
    privateKey: hexPrivateKey,
    signerInfo,
  }
}

export const transformContactsData = (contacts: NonNullable<LegacyDataStructure['contacts']>): Contact[] => {
  // Group contacts by address to handle same address on multiple chains
  const contactsMap = new Map<string, Contact>()

  for (const contact of contacts) {
    const address = contact.address.toLowerCase() // Normalize address for consistency

    if (contactsMap.has(address)) {
      // Address already exists, add the chainId if not already present
      const existingContact = contactsMap.get(address)
      if (existingContact && !existingContact.chainIds.includes(contact.chain)) {
        existingContact.chainIds.push(contact.chain)
      }
    } else {
      // New address, create new contact
      contactsMap.set(address, {
        value: contact.address, // Keep original casing
        name: contact.name,
        chainIds: [contact.chain],
      })
    }
  }

  return Array.from(contactsMap.values())
}

export const storeSafes = (data: LegacyDataStructure, dispatch: AppDispatch): void => {
  if (!data.safes) {
    return
  }

  console.log('data.safes', data.safes)

  for (const safe of data.safes) {
    const safeOverview = transformSafeData(safe)

    dispatch(
      _addSafe({
        address: safe.address as `0x${string}`,
        info: { [safe.chain]: safeOverview },
      }),
    )

    dispatch(
      _addContact({
        value: safe.address,
        name: safe.name,
        chainIds: [],
      }),
    )
  }

  Logger.info(`Imported ${data.safes.length} safes`)
}

export const storeContacts = (data: LegacyDataStructure, dispatch: AppDispatch): void => {
  if (!data.contacts) {
    return
  }

  const contactsToAdd = transformContactsData(data.contacts)

  dispatch(addContacts(contactsToAdd))
  Logger.info(`Imported ${contactsToAdd.length} contacts from ${data.contacts.length} contact entries`)
}

export const storeKeysWithValidation = async (
  data: LegacyDataStructure,
  allOwners: Set<string>,
  dispatch: AppDispatch,
  updateNotImportedKeys: (keys: NotImportedKey[]) => void,
): Promise<void> => {
  if (!data.keys) {
    return
  }

  const notImportedKeys: NotImportedKey[] = []
  let importedCount = 0

  Logger.info(`Validating ${data.keys.length} keys against ${allOwners.size} safe owners`)

  for (const key of data.keys) {
    const keyAddress = key.address.toLowerCase()

    if (!allOwners.has(keyAddress)) {
      // Key is not an owner of any safe, don't import it
      notImportedKeys.push({
        address: key.address,
        name: key.name || 'Unknown',
        reason: 'Not an owner of any imported safe',
      })

      Logger.info(`Key ${key.address} not imported - not an owner of any safe`)
      continue
    }

    // Key is an owner, proceed with import
    try {
      const { address, privateKey, signerInfo } = transformKeyData(key)

      await storePrivateKey(address, privateKey)
      dispatch(addSignerWithEffects(signerInfo))

      importedCount++
      Logger.info(`Key ${key.address} successfully imported`)
    } catch (error) {
      Logger.error('Failed to import validated key', {
        error: error instanceof Error ? error.message : 'Unknown error',
        address: key.address,
      })

      notImportedKeys.push({
        address: key.address,
        name: key.name || 'Unknown',
        reason: 'Import failed due to technical error',
      })
    }
  }

  // Update the context with not imported keys
  updateNotImportedKeys(notImportedKeys)

  Logger.info(`Import validation complete: ${importedCount} keys imported, ${notImportedKeys.length} keys not imported`)
}

interface SafeInfo {
  address: string
  chainId: string
}

// Function to create delay for throttling
const delay = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms))

// Function to chunk array into smaller arrays
const chunkArray = <T>(array: T[], size: number): T[][] => {
  const chunks: T[][] = []
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size))
  }
  return chunks
}

export const fetchSafeOwnersInBatches = async (
  safes: SafeInfo[],
  currency = 'USD',
  dispatch: AppDispatch,
): Promise<Set<string>> => {
  if (safes.length === 0) {
    return new Set()
  }

  const allOwners = new Set<string>()
  const BATCH_SIZE = 10
  const THROTTLE_DELAY = 300 // 300ms between requests

  // Create safe IDs in the format expected by the API
  const safeIds = safes.map((safe) => `${safe.chainId}:${safe.address}`)
  const chunks = chunkArray(safeIds, BATCH_SIZE)

  Logger.info(`Fetching safe information for ${safes.length} safes in ${chunks.length} batches`)

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i]
    Logger.info(`Processing batch ${i + 1}/${chunks.length} with ${chunk.length} safes`)

    try {
      // Make the API call for this batch using the endpoint directly
      const response = await dispatch(
        additionalSafesRtkApi.endpoints.safesGetOverviewForMany.initiate({
          safes: chunk,
          currency,
          trusted: true,
          excludeSpam: true,
        }),
      ).unwrap()

      // Extract owners from the response
      for (const safeOverview of response) {
        if (safeOverview.owners) {
          safeOverview.owners.forEach((owner: AddressInfo) => {
            allOwners.add(owner.value.toLowerCase())
          })
        }
      }

      // Add throttling delay between requests (except for the last batch)
      if (i < chunks.length - 1) {
        await delay(THROTTLE_DELAY)
      }
    } catch (error) {
      Logger.error(`Failed to fetch safe information for batch ${i + 1}`, {
        error: error instanceof Error ? error.message : 'Unknown error',
        chunk,
      })
      // Continue with next batch even if one fails
    }
  }

  Logger.info(`Extracted ${allOwners.size} unique owners from ${safes.length} safes`)
  return allOwners
}
