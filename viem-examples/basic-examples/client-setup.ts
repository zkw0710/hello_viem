import { createPublicClient, http } from 'viem'
import { mainnet, sepolia, polygon } from 'viem/chains'

// 主网客户端
export const mainnetClient = createPublicClient({
  chain: mainnet,
  transport: http('https://eth-mainnet.g.alchemy.com/v2/YOUR_API_KEY')
})

// 测试网客户端
export const sepoliaClient = createPublicClient({
  chain: sepolia,
  transport: http('https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY')
})

// Polygon 客户端
export const polygonClient = createPublicClient({
  chain: polygon,
  transport: http('https://polygon-rpc.com')
})

// 默认客户端（使用公共 RPC）
export const defaultClient = createPublicClient({
  chain: mainnet,
  transport: http()
})

// 多链客户端配置
export const clients = {
  ethereum: mainnetClient,
  sepolia: sepoliaClient,
  polygon: polygonClient,
  default: defaultClient,
} 