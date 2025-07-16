import React, { useCallback, useState, useMemo, useEffect } from 'react'
import { router } from 'expo-router'

import { useAppSelector } from '@/src/store/hooks'
import { AddressBookListView } from './components/AddressBookListView'
import { selectAllContacts } from '@/src/store/addressBookSlice'
import { AddressInfo } from '@safe-global/store/gateway/AUTO_GENERATED/transactions'
import { trackEvent } from '@/src/services/analytics'
import { createAddressBookScreenVisitEvent } from '@/src/services/analytics/events/addressBook'

export const AddressBookListContainer = () => {
  const contacts = useAppSelector(selectAllContacts)
  const [searchQuery, setSearchQuery] = useState('')

  // Track screen visit when component mounts
  useEffect(() => {
    try {
      const totalContactCount = contacts.length
      const event = createAddressBookScreenVisitEvent(totalContactCount)
      trackEvent(event)
    } catch (error) {
      console.error('Error tracking address book screen visit:', error)
    }
  }, [contacts.length])

  // Memoized filtered contacts for performance
  const filteredContacts = useMemo(() => {
    if (!searchQuery.trim()) {
      return contacts
    }

    const lowercaseQuery = searchQuery.toLowerCase()
    return contacts.filter((contact) => {
      const matchesName = contact.name?.toLowerCase().includes(lowercaseQuery)
      const matchesAddress = contact.value.toLowerCase().includes(lowercaseQuery)
      return matchesName || matchesAddress
    })
  }, [contacts, searchQuery])

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query)
  }, [])

  const handleSelectContact = useCallback((contact: AddressInfo) => {
    router.push({
      pathname: '/contact',
      params: {
        address: contact.value,
        mode: 'view',
      },
    })
  }, [])

  const handleAddContact = useCallback(() => {
    router.push({
      pathname: '/contact',
      params: {
        mode: 'new',
      },
    })
  }, [])

  return (
    <AddressBookListView
      contacts={contacts}
      filteredContacts={filteredContacts}
      onSearch={handleSearch}
      onSelectContact={handleSelectContact}
      onAddContact={handleAddContact}
    />
  )
}
