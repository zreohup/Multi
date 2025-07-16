import React from 'react'
import { Text, View } from 'tamagui'
import { SafeListItem } from '@/src/components/SafeListItem'
import { ellipsis } from '@/src/utils/formatters'
import { IdenticonWithBadge } from '@/src/features/Settings/components/IdenticonWithBadge'
import { Address } from '@/src/types/address'
import { Chain } from '@safe-global/store/gateway/AUTO_GENERATED/chains'
import { ChainsDisplay } from '@/src/components/ChainsDisplay'
import { shouldDisplayPreciseBalance } from '@/src/utils/balance'
import { formatCurrency, formatCurrencyPrecise } from '@safe-global/utils/utils/formatNumber'
import { useAppSelector } from '@/src/store/hooks'
import { selectCurrency } from '@/src/store/settingsSlice'

interface AccountCardProps {
  name: string | Address
  balance: string
  address: Address
  owners: number
  threshold: number
  rightNode?: string | React.ReactNode
  leftNode?: React.ReactNode
  chains?: Chain[]
  spaced?: boolean
}

export function AccountCard({
  name,
  chains,
  spaced,
  owners,
  leftNode,
  balance,
  address,
  threshold,
  rightNode,
}: AccountCardProps) {
  const currency = useAppSelector(selectCurrency)
  const formattedBalance = shouldDisplayPreciseBalance(balance, 8)
    ? formatCurrencyPrecise(balance, currency)
    : formatCurrency(balance, currency)

  return (
    <SafeListItem
      spaced={spaced}
      label={
        <View>
          <Text fontSize="$4" fontWeight={600}>
            {ellipsis(name, 18)}
          </Text>
          <Text fontSize="$4" color="$colorSecondary" fontWeight={400}>
            {ellipsis(formattedBalance, 14)}
          </Text>
        </View>
      }
      leftNode={
        <View marginRight="$2" flexDirection="row" gap="$2" justifyContent="center" alignItems="center">
          {leftNode}
          <IdenticonWithBadge
            testID="threshold-info-badge"
            size={40}
            badgeSize={24}
            fontSize={owners > 9 ? 9 : 12}
            address={address}
            badgeContent={`${threshold}/${owners}`}
          />
        </View>
      }
      rightNode={
        <View columnGap="$2" flexDirection="row">
          {chains && <ChainsDisplay chains={chains} max={3} />}
          {rightNode}
        </View>
      }
      transparent
    />
  )
}
