import { safelyDecodeURIComponent } from 'expo-router/build/fork/getStateFromPath-forks'
import React, { useState } from 'react'

import { SafeTab } from '@/src/components/SafeTab'
import { POLLING_INTERVAL } from '@/src/config/constants'
import {
  Collectible,
  CollectiblePage,
  useCollectiblesGetCollectiblesV2Query,
} from '@safe-global/store/gateway/AUTO_GENERATED/collectibles'

import { Fallback } from '../Fallback'
import { NFTItem } from './NFTItem'
import { useInfiniteScroll } from '@/src/hooks/useInfiniteScroll'
import { useDefinedActiveSafe } from '@/src/store/hooks/activeSafe'
import { NoFunds } from '@/src/features/Assets/components/NoFunds'
import { AssetError } from '../../Assets.error'
import { Loader } from '@/src/components/Loader'
import { getTokenValue } from 'tamagui'

export function NFTsContainer() {
  const activeSafe = useDefinedActiveSafe()
  const [pageUrl, setPageUrl] = useState<string>()

  const { data, isFetching, error, refetch } = useCollectiblesGetCollectiblesV2Query(
    {
      chainId: activeSafe.chainId,
      safeAddress: activeSafe.address,
      cursor: pageUrl && safelyDecodeURIComponent(pageUrl?.split('cursor=')[1]),
    },
    {
      pollingInterval: POLLING_INTERVAL,
    },
  )
  const { list, onEndReached } = useInfiniteScroll<CollectiblePage, Collectible>({
    refetch,
    setPageUrl,
    data,
  })

  if (error) {
    return (
      <Fallback loading={isFetching}>
        <AssetError assetType={'nft'} onRetry={() => refetch()} />
      </Fallback>
    )
  }

  if (!list?.results.length) {
    return (
      <Fallback loading={isFetching || !list}>
        <NoFunds fundsType={'nft'} />
      </Fallback>
    )
  }

  return (
    <SafeTab.FlatList<Collectible>
      onEndReached={onEndReached}
      data={list?.results}
      renderItem={NFTItem}
      ListFooterComponent={isFetching ? <Loader size={24} /> : undefined}
      keyExtractor={(item, index) => `${item.address}-${index}`}
      style={{ marginTop: getTokenValue('$2') }}
    />
  )
}
