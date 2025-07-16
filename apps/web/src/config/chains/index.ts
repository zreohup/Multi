import { networks } from '@safe-global/protocol-kit/dist/src/utils/eip-3770/config'
import { hermitChain } from './hermit'

/**
 * A static shortName<->chainId dictionary
 * E.g.:
 *
 * {
 *   eth: '1',
 *   gor: '5',
 *   hermit: '387159',
 *   ...
 * }
 */
type Chains = Record<string, string>

const chains = networks.reduce<Chains>((result, { shortName, chainId }) => {
  result[shortName] = chainId.toString()
  return result
}, {})

// 添加Hermit网络
chains.hermit = '387159'

export default chains

// 导出所有链配置
export const allChains = [hermitChain]
