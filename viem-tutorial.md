# Viem.js 框架完整教程

## 什么是 Viem.js？

Viem.js 是一个现代化的以太坊客户端库，专为 TypeScript 和 JavaScript 开发者设计。它提供了类型安全、高性能的以太坊交互接口，是 Web3 开发的首选工具之一。

### 主要特性

- **类型安全**: 完整的 TypeScript 支持
- **高性能**: 优化的网络请求和缓存机制
- **模块化**: 按需导入，减少打包体积
- **现代化**: 支持最新的以太坊功能和标准
- **易用性**: 简洁的 API 设计

## 安装和基础设置

### 1. 安装 Viem

```bash
npm install viem
# 或者使用 yarn
yarn add viem
```

### 2. 基础配置

```typescript
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'

// 创建公共客户端
const client = createPublicClient({
  chain: mainnet,
  transport: http()
})
```

## 核心概念

### 1. 客户端类型

Viem 提供了多种客户端类型：

- **PublicClient**: 只读操作（查询余额、区块信息等）
- **WalletClient**: 钱包操作（签名、发送交易等）
- **TestClient**: 测试环境操作

### 2. 链配置

```typescript
import { mainnet, sepolia, polygon } from 'viem/chains'

// 使用预定义链
const client = createPublicClient({
  chain: mainnet,
  transport: http()
})

// 自定义链配置
const customChain = {
  id: 1,
  name: 'Ethereum',
  network: 'ethereum',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: { http: ['https://eth-mainnet.g.alchemy.com/v2/YOUR_API_KEY'] },
    public: { http: ['https://eth-mainnet.g.alchemy.com/v2/YOUR_API_KEY'] },
  },
}
```

## 常用操作示例

### 1. 查询账户余额

```typescript
import { getBalance } from 'viem'

// 获取账户余额
const balance = await client.getBalance({
  address: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6'
})

console.log(`余额: ${balance} wei`)
```

### 2. 读取智能合约

```typescript
import { readContract } from 'viem'

// ERC20 代币余额查询
const balance = await client.readContract({
  address: '0xA0b86a33E6441b8c4C8C8C8C8C8C8C8C8C8C8C8',
  abi: [
    {
      name: 'balanceOf',
      type: 'function',
      stateMutability: 'view',
      inputs: [{ name: 'account', type: 'address' }],
      outputs: [{ name: '', type: 'uint256' }],
    },
  ],
  functionName: 'balanceOf',
  args: ['0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6'],
})
```

### 3. 发送交易

```typescript
import { createWalletClient, custom } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'

// 创建钱包客户端
const walletClient = createWalletClient({
  chain: mainnet,
  transport: custom(window.ethereum)
})

// 发送交易
const hash = await walletClient.sendTransaction({
  account: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
  to: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
  value: parseEther('0.1'),
})
```

### 4. 监听事件

```typescript
import { watchContractEvent } from 'viem'

// 监听合约事件
const unwatch = watchContractEvent(client, {
  address: '0xA0b86a33E6441b8c4C8C8C8C8C8C8C8C8C8C8C8',
  abi: [
    {
      name: 'Transfer',
      type: 'event',
      inputs: [
        { name: 'from', type: 'address', indexed: true },
        { name: 'to', type: 'address', indexed: true },
        { name: 'value', type: 'uint256' },
      ],
    },
  ],
  eventName: 'Transfer',
  onLogs: (logs) => console.log('Transfer event:', logs),
})
```

## React 集成

### 使用 React Query 和 Viem

```typescript
import { useQuery } from '@tanstack/react-query'
import { getBalance } from 'viem'

function useAccountBalance(address: string) {
  return useQuery({
    queryKey: ['balance', address],
    queryFn: () => client.getBalance({ address }),
    enabled: !!address,
  })
}

// 在组件中使用
function BalanceDisplay({ address }: { address: string }) {
  const { data: balance, isLoading, error } = useAccountBalance(address)

  if (isLoading) return <div>加载中...</div>
  if (error) return <div>错误: {error.message}</div>

  return <div>余额: {formatEther(balance)} ETH</div>
}
```

## 最佳实践

### 1. 错误处理

```typescript
import { getBalance } from 'viem'

try {
  const balance = await client.getBalance({
    address: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6'
  })
} catch (error) {
  if (error instanceof Error) {
    console.error('查询余额失败:', error.message)
  }
}
```

### 2. 类型安全

```typescript
import { type Address, type Hex } from 'viem'

// 使用类型安全的地址
const address: Address = '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6'

// 使用类型安全的哈希
const hash: Hex = '0x1234567890abcdef...'
```

### 3. 性能优化

```typescript
// 使用批量请求
const [balance1, balance2] = await Promise.all([
  client.getBalance({ address: address1 }),
  client.getBalance({ address: address2 }),
])

// 使用缓存
const client = createPublicClient({
  chain: mainnet,
  transport: http(),
  pollingInterval: 4000, // 4秒轮询间隔
})
```

## 常见问题解决

### 1. 网络连接问题

```typescript
// 检查网络连接
const blockNumber = await client.getBlockNumber()
console.log('当前区块号:', blockNumber)
```

### 2. 交易确认

```typescript
import { waitForTransactionReceipt } from 'viem'

// 等待交易确认
const receipt = await waitForTransactionReceipt(client, {
  hash: '0x1234567890abcdef...',
})

console.log('交易状态:', receipt.status)
```

### 3. Gas 估算

```typescript
import { estimateGas } from 'viem'

// 估算 Gas 费用
const gasEstimate = await client.estimateGas({
  account: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
  to: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
  value: parseEther('0.1'),
})
```

## 进阶功能

### 1. 多链支持

```typescript
import { createPublicClient, http } from 'viem'
import { mainnet, polygon, arbitrum } from 'viem/chains'

const clients = {
  ethereum: createPublicClient({
    chain: mainnet,
    transport: http('https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY'),
  }),
  polygon: createPublicClient({
    chain: polygon,
    transport: http('https://polygon-rpc.com'),
  }),
  arbitrum: createPublicClient({
    chain: arbitrum,
    transport: http('https://arb1.arbitrum.io/rpc'),
  }),
}
```

### 2. 自定义 Transport

```typescript
import { createTransport } from 'viem'

const customTransport = createTransport({
  async request({ method, params }) {
    // 自定义请求逻辑
    const response = await fetch('https://your-rpc-endpoint', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }),
    })
    return response.json()
  },
})
```

## 学习资源

### 官方文档
- [Viem 官方文档](https://viem.sh/)
- [API 参考](https://viem.sh/docs/api)
- [示例代码](https://viem.sh/docs/examples)

### 社区资源
- [GitHub 仓库](https://github.com/wagmi-dev/viem)
- [Discord 社区](https://discord.gg/wagmi)
- [Twitter](https://twitter.com/wagmi_sh)

### 相关工具
- **Wagmi**: React Hooks for Ethereum
- **RainbowKit**: 钱包连接组件
- **Abitype**: 类型安全的 ABI 工具

## 总结

Viem.js 是一个强大而现代的以太坊客户端库，提供了类型安全、高性能的 Web3 开发体验。通过本教程，您应该能够：

1. 理解 Viem 的核心概念和架构
2. 掌握基础操作（查询、交易、事件监听）
3. 学会与 React 集成
4. 了解最佳实践和性能优化
5. 解决常见问题

建议您从基础操作开始，逐步深入到更复杂的功能，并在实际项目中应用这些知识。 