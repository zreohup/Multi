import { useMemo } from 'react'
import { Platform } from 'react-native'
import { useTheme } from 'tamagui'

export const useSignersActions = (disableImport: boolean) => {
  const theme = useTheme()
  const color = theme.color?.get()
  const actions = useMemo(
    () => [
      {
        id: 'rename',
        title: 'Rename',
        image: Platform.select({
          ios: 'pencil',
          android: 'baseline_create_24',
        }),
        imageColor: Platform.select({ ios: color, android: '#000' }),
      },
      {
        id: 'copy',
        title: 'Copy address',
        image: Platform.select({
          ios: 'doc.on.doc',
          android: 'baseline_content_copy_24',
        }),
        imageColor: Platform.select({ ios: color, android: '#000' }),
      },
      !disableImport && {
        id: 'import',
        title: 'Import signer',
        image: Platform.select({
          ios: 'square.and.arrow.up.on.square',
          android: 'baseline_arrow_outward_24',
        }),
        imageColor: Platform.select({ ios: color, android: '#000' }),
      },
    ],
    [color, disableImport],
  )

  return actions
}
