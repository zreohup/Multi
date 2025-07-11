import React from 'react'
import { act, render } from '@/src/tests/test-utils'
import { ImportProgressScreen } from '../ImportProgressScreen.container'
import { useDataImportContext } from '../context/DataImportProvider'
import { useRouter } from 'expo-router'
import { useAppDispatch, useAppSelector } from '@/src/store/hooks'
import { storePrivateKey } from '@/src/hooks/useSign/useSign'
import * as transforms from '../helpers/transforms'

jest.mock('../context/DataImportProvider', () => ({
  useDataImportContext: jest.fn(),
}))

jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
}))

jest.mock('@/src/store/hooks', () => ({
  useAppDispatch: jest.fn(),
  useAppSelector: jest.fn(),
}))

jest.mock('@/src/hooks/useSign/useSign', () => ({
  storePrivateKey: jest.fn(),
}))

jest.mock('../helpers/transforms', () => ({
  ...jest.requireActual('../helpers/transforms'),
  fetchSafeOwnersInBatches: jest.fn(),
  storeKeysWithValidation: jest.fn(),
}))

describe('ImportProgressScreen', () => {
  const pushMock = jest.fn()
  const dispatchMock = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    jest
      .mocked(useRouter)
      .mockReturnValue({ push: pushMock, back: jest.fn() } as unknown as ReturnType<typeof useRouter>)
    jest.mocked(useAppDispatch).mockReturnValue(dispatchMock)
    jest.mocked(useAppSelector).mockReturnValue('auto')
    jest.mocked(storePrivateKey).mockResolvedValue(undefined)
  })

  it('dispatches actions and navigates on success', async () => {
    const updateNotImportedKeys = jest.fn()

    jest.mocked(useDataImportContext).mockReturnValue({
      importedData: {
        data: {
          safes: [{ address: '0x1', chain: '1', name: 'Safe' }],
          keys: [{ address: '0x2', name: 'Key', key: 'AAAA' }],
          contacts: [{ address: '0x3', name: 'Contact', chain: '1' }],
        },
      },
      updateNotImportedKeys,
    } as unknown as ReturnType<typeof useDataImportContext>)

    // Mock the API call to return a set of owners
    jest.mocked(transforms.fetchSafeOwnersInBatches).mockResolvedValue(new Set(['0x2']))

    // Mock the key validation function
    jest.mocked(transforms.storeKeysWithValidation).mockResolvedValue(undefined)

    render(<ImportProgressScreen />)

    // Wait for the async operations to complete
    await act(async () => {
      jest.runAllTimers()
    })
    await act(async () => {
      jest.runAllTimers()
    })
    await act(async () => {
      jest.runAllTimers()
    })

    expect(dispatchMock).toHaveBeenCalled()
    expect(transforms.fetchSafeOwnersInBatches).toHaveBeenCalled()
    expect(transforms.storeKeysWithValidation).toHaveBeenCalled()
    expect(pushMock).toHaveBeenCalledWith('/import-data/import-success')
  })
})
