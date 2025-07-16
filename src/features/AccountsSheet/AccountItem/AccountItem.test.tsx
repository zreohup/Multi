import React from 'react'
import { render, screen, fireEvent } from '@/src/tests/test-utils'
import { AccountItem } from './AccountItem'
import { Chain } from '@safe-global/store/gateway/AUTO_GENERATED/chains'
import { faker } from '@faker-js/faker'
import { shortenAddress } from '@/src/utils/formatters'

jest.mock('expo-router', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
    dispatch: jest.fn(),
  }),
  useSegments: () => ['test'], // if you use useSegments anywhere
}))

const mockAccount = {
  address: { value: faker.finance.ethereumAddress() as `0x${string}`, name: 'Test Account' },
  threshold: 1,
  owners: [{ value: faker.finance.ethereumAddress() as `0x${string}` }],
  fiatTotal: '1000',
  chainId: '1',
  queued: 0,
}

const mockChains = [
  {
    chainId: '1',
    chainName: 'Ethereum',
    shortName: 'eth',
    description: 'Ethereum',
    l2: false,
    isTestnet: false,
    nativeCurrency: { symbol: 'ETH', decimals: 18, name: 'Ether' },
    blockExplorerUriTemplate: { address: '', txHash: '', api: '' },
    transactionService: '',
    theme: { backgroundColor: '', textColor: '' },
    gasPrice: [],
    ensRegistryAddress: '',
    features: [],
    disabledWallets: [],
    rpcUri: { authentication: '', value: '' },
    beaconChainExplorerUriTemplate: { address: '', api: '' },
    balancesProvider: '',
    contractAddresses: {},
    publicRpcUri: { authentication: '', value: '' },
    safeAppsRpcUri: { authentication: '', value: '' },
  },
]

describe('AccountItem', () => {
  const mockOnSelect = jest.fn()
  const mockDrag = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders account details correctly', () => {
    render(
      <AccountItem
        account={mockAccount}
        chains={mockChains as unknown as Chain[]}
        activeAccount="0x789"
        onSelect={mockOnSelect}
      />,
    )

    expect(screen.getByText(shortenAddress(mockAccount.address.value))).toBeTruthy()
    expect(screen.getByText('1/1')).toBeTruthy()
    expect(screen.getByText('$ 1,000.00')).toBeTruthy()
  })

  it('renders account details correctly when a contact for the address exists', () => {
    render(
      <AccountItem
        account={mockAccount}
        chains={mockChains as unknown as Chain[]}
        activeAccount="0x789"
        onSelect={mockOnSelect}
      />,
      {
        initialStore: {
          addressBook: {
            contacts: {
              [mockAccount.address.value]: { name: 'Test Safe', value: mockAccount.address.value, chainIds: [] },
            },
            selectedContact: null,
          },
        },
      },
    )

    expect(screen.getByText('Test Safe')).toBeTruthy()
    expect(screen.getByText('1/1')).toBeTruthy()
    expect(screen.getByText('$ 1,000.00')).toBeTruthy()
  })

  it('shows active state when account is selected', () => {
    render(
      <AccountItem
        account={mockAccount}
        chains={mockChains as unknown as Chain[]}
        activeAccount={mockAccount.address.value}
        onSelect={mockOnSelect}
      />,
    )

    const wrapper = screen.getByTestId('account-item-wrapper')
    expect(wrapper.props.style.backgroundColor).toBe('#DCDEE0')
  })

  it('calls onSelect when pressed', () => {
    render(
      <AccountItem
        account={mockAccount}
        chains={mockChains as unknown as Chain[]}
        activeAccount="0x789"
        onSelect={mockOnSelect}
      />,
    )

    fireEvent.press(screen.getByTestId('account-item-wrapper'))
    expect(mockOnSelect).toHaveBeenCalledWith(mockAccount.address.value)
  })

  it('enables drag functionality when provided', () => {
    render(
      <AccountItem
        account={mockAccount}
        chains={mockChains as unknown as Chain[]}
        activeAccount="0x789"
        onSelect={mockOnSelect}
        drag={mockDrag}
      />,
    )

    fireEvent(screen.getByTestId('account-item-wrapper'), 'longPress')
    expect(mockDrag).toHaveBeenCalled()
  })

  it('disables press when dragging', () => {
    render(
      <AccountItem
        account={mockAccount}
        chains={mockChains as unknown as Chain[]}
        activeAccount="0x789"
        onSelect={mockOnSelect}
        isDragging={true}
      />,
    )

    fireEvent.press(screen.getByTestId('account-item-wrapper'))
    expect(mockOnSelect).not.toHaveBeenCalled()
  })
})
