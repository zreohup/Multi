import {
  transformSafeData,
  transformKeyData,
  transformContactsData,
  storeSafes,
  storeKeys,
  storeContacts,
  LegacyDataStructure,
} from './transforms'
import { addSafe } from '@/src/store/safesSlice'
import { addContact, addContacts, Contact } from '@/src/store/addressBookSlice'
import { addSignerWithEffects } from '@/src/store/signersSlice'
import { storePrivateKey } from '@/src/hooks/useSign/useSign'

jest.mock('@/src/hooks/useSign/useSign', () => ({
  storePrivateKey: jest.fn(),
}))

jest.mock('@/src/store/signersSlice', () => ({
  addSignerWithEffects: jest.fn(() => ({ type: 'addSignerWithEffects' })),
}))

describe('Data import helpers', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Pure transformation functions', () => {
    it('transforms safe data correctly', () => {
      const safeData = {
        address: '0x1',
        chain: '1',
        name: 'Test Safe',
        threshold: 2,
        owners: ['0x2', '0x3'],
      }

      const result = transformSafeData(safeData)

      expect(result).toEqual({
        address: { value: '0x1', name: 'Test Safe' },
        chainId: '1',
        threshold: 2,
        owners: [
          { value: '0x2', name: null },
          { value: '0x3', name: null },
        ],
        fiatTotal: '0',
        queued: 0,
        awaitingConfirmation: null,
      })
    })

    it('transforms key data correctly', () => {
      const key = Buffer.from('abcd', 'hex').toString('base64')
      const keyData = {
        address: '0x1',
        name: 'Owner',
        key,
      }

      const result = transformKeyData(keyData)

      expect(result).toEqual({
        address: '0x1',
        privateKey: '0xabcd',
        signerInfo: {
          value: '0x1',
          name: 'Owner',
        },
      })
    })

    describe('transformContactsData', () => {
      it('transforms single contact correctly', () => {
        const contacts = [{ address: '0x1', name: 'Alice', chain: '1' }]

        const result = transformContactsData(contacts)

        expect(result).toEqual([{ value: '0x1', name: 'Alice', chainIds: ['1'] }])
      })

      it('groups contacts with same address on different chains', () => {
        const contacts = [
          { address: '0x1', name: 'Alice', chain: '1' },
          { address: '0x2', name: 'Bob', chain: '1' },
          { address: '0x1', name: 'Alice on Polygon', chain: '137' },
        ]

        const result = transformContactsData(contacts)

        expect(result).toEqual([
          { value: '0x1', name: 'Alice', chainIds: ['1', '137'] },
          { value: '0x2', name: 'Bob', chainIds: ['1'] },
        ])
      })

      it('handles duplicate chains for same address', () => {
        const contacts = [
          { address: '0x1', name: 'Alice', chain: '1' },
          { address: '0x1', name: 'Alice Again', chain: '1' }, // Same chain, should not duplicate
          { address: '0x1', name: 'Alice on Polygon', chain: '137' },
        ]

        const result = transformContactsData(contacts)

        expect(result).toEqual([{ value: '0x1', name: 'Alice', chainIds: ['1', '137'] }])
      })

      it('handles mixed case addresses correctly', () => {
        const contacts = [
          { address: '0xAbc123', name: 'Alice', chain: '1' },
          { address: '0xabc123', name: 'Alice Lowercase', chain: '137' },
          { address: '0xABC123', name: 'Alice Uppercase', chain: '100' },
        ]

        const result = transformContactsData(contacts)

        expect(result).toHaveLength(1)
        expect(result[0]).toEqual({
          value: '0xAbc123', // Should preserve original casing of first occurrence
          name: 'Alice',
          chainIds: ['1', '137', '100'],
        })
      })

      it('handles empty contacts array', () => {
        const result = transformContactsData([])
        expect(result).toEqual([])
      })

      it('preserves original address casing from first occurrence', () => {
        const contacts = [
          { address: '0xabc123', name: 'Alice Lowercase', chain: '137' },
          { address: '0xABC123', name: 'Alice Uppercase', chain: '1' },
        ]

        const result = transformContactsData(contacts)

        expect(result).toHaveLength(1)
        expect(result[0].value).toBe('0xabc123') // Should preserve first occurrence casing
      })

      it('handles complex real-world example', () => {
        const contacts = [
          { address: '0x8675B754342754A30A2AeF474D114d8460bca19b', name: 'test contact 1', chain: '1' },
          { address: '0xDCF613c4B117a5D904325544ccb24e76813D8426', name: 'test contact 2', chain: '100' },
          { address: '0xDCF613c4B117a5D904325544ccb24e76813D8426', name: 'test polygon contact', chain: '137' },
        ]

        const result = transformContactsData(contacts)

        expect(result).toHaveLength(2)
        expect(result).toEqual([
          { value: '0x8675B754342754A30A2AeF474D114d8460bca19b', name: 'test contact 1', chainIds: ['1'] },
          { value: '0xDCF613c4B117a5D904325544ccb24e76813D8426', name: 'test contact 2', chainIds: ['100', '137'] },
        ])
      })
    })
  })

  describe('Store functions', () => {
    it('dispatches addSafe and addContact for safes', () => {
      const dispatch = jest.fn()
      const data: LegacyDataStructure = {
        safes: [
          {
            address: '0x1',
            chain: '1',
            name: 'Test Safe',
            threshold: 2,
            owners: ['0x2'],
          },
        ],
      }

      storeSafes(data, dispatch)

      const expectedSafeOverview = {
        address: { value: '0x1', name: 'Test Safe' },
        chainId: '1',
        threshold: 2,
        owners: [{ value: '0x2', name: null }],
        fiatTotal: '0',
        queued: 0,
        awaitingConfirmation: null,
      }

      expect(dispatch).toHaveBeenCalledWith(addSafe({ address: '0x1', info: { '1': expectedSafeOverview } }))
      expect(dispatch).toHaveBeenCalledWith(addContact({ value: '0x1', name: 'Test Safe', chainIds: [] }))
    })

    it('stores keys and dispatches addSignerWithEffects', async () => {
      const dispatch = jest.fn()
      const key = Buffer.from('abcd', 'hex').toString('base64')
      const data: LegacyDataStructure = {
        keys: [
          {
            address: '0x1',
            name: 'Owner',
            key,
          },
        ],
      }

      await storeKeys(data, dispatch)

      expect(storePrivateKey).toHaveBeenCalledWith('0x1', '0xabcd')
      expect(addSignerWithEffects).toHaveBeenCalledWith({ value: '0x1', name: 'Owner' })
      expect(dispatch).toHaveBeenCalledWith({ type: 'addSignerWithEffects' })
    })

    it('dispatches addContacts with transformed contacts', () => {
      const dispatch = jest.fn()
      const data: LegacyDataStructure = {
        contacts: [
          { address: '0x1', name: 'Alice', chain: '1' },
          { address: '0x2', name: 'Bob', chain: '1' },
          { address: '0x2', name: 'Bob on Polygon', chain: '137' },
        ],
      }

      storeContacts(data, dispatch)

      const expectedContacts: Contact[] = [
        { value: '0x1', name: 'Alice', chainIds: ['1'] },
        { value: '0x2', name: 'Bob', chainIds: ['1', '137'] },
      ]

      expect(dispatch).toHaveBeenCalledWith(addContacts(expectedContacts))
    })

    it('handles empty contacts array', () => {
      const dispatch = jest.fn()
      const data: LegacyDataStructure = {
        contacts: [],
      }

      storeContacts(data, dispatch)

      expect(dispatch).toHaveBeenCalledWith(addContacts([]))
    })

    it('handles missing contacts property', () => {
      const dispatch = jest.fn()
      const data: LegacyDataStructure = {}

      storeContacts(data, dispatch)

      expect(dispatch).not.toHaveBeenCalled()
    })
  })
})
