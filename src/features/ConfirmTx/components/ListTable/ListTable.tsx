import { Container } from '@/src/components/Container'
import React from 'react'
import { Text, View } from 'tamagui'

type BaseItem = {
  direction?: 'row' | 'column'
  alignItems?: 'center' | 'flex-start'
}

type RenderRowItem = BaseItem & {
  renderRow: () => React.ReactNode
}

type LabelValueItem = BaseItem & {
  label: string
  value?: string
  render?: () => React.ReactNode
}

export type ListTableItem = RenderRowItem | LabelValueItem

interface ListTableProps {
  items: ListTableItem[]
  children?: React.ReactNode
  padding?: string
  gap?: string
}

const isRenderRowItem = (item: ListTableItem): item is RenderRowItem => {
  return (item as RenderRowItem).renderRow !== undefined
}

export const ListTable = ({ items, children, padding = '$4', gap = '$5' }: ListTableProps) => {
  return (
    <Container padding={padding} gap={gap} borderRadius="$3">
      {items.map((item, index) => {
        return (
          <View
            key={index}
            alignItems={item.alignItems || 'center'}
            flexDirection={item.direction || 'row'}
            justifyContent="space-between"
            gap={'$2'}
            flexWrap="wrap"
          >
            {isRenderRowItem(item) ? (
              item.renderRow()
            ) : (
              <>
                <Text color="$textSecondaryLight" fontSize="$4" flex={1}>
                  {item.label}
                </Text>

                {item.render ? (
                  item.render()
                ) : (
                  <Text fontSize="$4" flex={2} textAlign="right">
                    {item.value}
                  </Text>
                )}
              </>
            )}
          </View>
        )
      })}

      {children}
    </Container>
  )
}
