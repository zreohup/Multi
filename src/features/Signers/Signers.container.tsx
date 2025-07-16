import { View } from 'tamagui'
import React, { useMemo } from 'react'

import { SafeButton } from '@/src/components/SafeButton'

import { SignersList } from './components/SignersList'
import { useSignersGroupService } from './hooks/useSignersGroupService'
import { useRouter } from 'expo-router'

export const SignersContainer = () => {
  const { group, isFetching } = useSignersGroupService()
  const router = useRouter()

  const onImportSigner = () => {
    router.push('/import-signers')
  }

  const signersSections = useMemo(() => {
    if (!group.imported) {
      return []
    }

    return group.imported?.data.length ? Object.values(group) : [group.notImported]
  }, [group])

  return (
    <View gap="$6" testID={'signers-screen'} flex={1}>
      <View flex={1}>
        <SignersList
          isFetching={isFetching}
          hasLocalSigners={!!group.imported?.data.length}
          signersGroup={signersSections}
        />
      </View>

      <SafeButton onPress={onImportSigner} testID={'import-signer-button'}>
        Import signer
      </SafeButton>
    </View>
  )
}
