import { SafeOverviewResult } from '@safe-global/store/gateway/types'
import { POLLING_INTERVAL } from '@/src/config/constants'
import { getChainsByIds, selectAllChains, selectChainById } from '@/src/store/chains'
import { Balance } from './Balance'
import { makeSafeId } from '@/src/utils/formatters'
import { RootState } from '@/src/store'
import { selectSafeChains } from '@/src/store/safesSlice'
import { useAppSelector } from '@/src/store/hooks'
import { useSafesGetOverviewForManyQuery } from '@safe-global/store/gateway/safes'
import React, { useCallback } from 'react'
import { useSelector } from 'react-redux'
import { useDefinedActiveSafe } from '@/src/store/hooks/activeSafe'
import { useCopyAndDispatchToast } from '@/src/hooks/useCopyAndDispatchToast'
import { selectCurrency } from '@/src/store/settingsSlice'

export function BalanceContainer() {
  const chains = useAppSelector(selectAllChains)
  const activeSafe = useDefinedActiveSafe()
  const chainsIds = useAppSelector((state: RootState) => selectSafeChains(state, activeSafe.address))
  const activeSafeChains = useAppSelector((state: RootState) => getChainsByIds(state, chainsIds))
  const copy = useCopyAndDispatchToast()
  const currency = useAppSelector(selectCurrency)
  const { data, isLoading } = useSafesGetOverviewForManyQuery<SafeOverviewResult>(
    {
      safes: [makeSafeId(activeSafe.chainId, activeSafe.address)],
      currency,
      trusted: true,
      excludeSpam: true,
    },
    {
      pollingInterval: POLLING_INTERVAL,
      skip: chains.length === 0,
    },
  )
  const activeChain = useSelector((state: RootState) => selectChainById(state, activeSafe.chainId))
  const balance = data?.find((chain) => chain.chainId === activeSafe.chainId)

  const onPressAddressCopy = useCallback(() => {
    copy(activeSafe.address)
  }, [activeSafe.address])

  return (
    <Balance
      chainName={activeChain?.chainName}
      chains={activeSafeChains}
      isLoading={isLoading}
      activeChainId={activeSafe.chainId}
      safeAddress={activeSafe.address}
      balanceAmount={balance?.fiatTotal || ''}
      onPressAddressCopy={onPressAddressCopy}
    />
  )
}
