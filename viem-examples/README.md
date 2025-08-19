# Viem.js 实际示例项目

这个目录包含了 viem.js 的实际使用示例，帮助您快速上手 Web3 开发。

## 项目结构

```
viem-examples/
├── README.md
├── basic-examples/
│   ├── client-setup.ts
│   ├── balance-query.ts
│   ├── contract-read.ts
│   └── transaction-send.ts
├── react-examples/
│   ├── hooks/
│   │   ├── useBalance.ts
│   │   ├── useContractRead.ts
│   │   └── useTransaction.ts
│   └── components/
│       ├── BalanceDisplay.tsx
│       ├── TokenBalance.tsx
│       └── TransactionForm.tsx
└── advanced-examples/
    ├── multi-chain.ts
    ├── event-listener.ts
    └── gas-estimation.ts
```

## 快速开始

### 1. 安装依赖

```bash
npm install viem @tanstack/react-query
```

### 2. 基础客户端设置

```typescript
// client-setup.ts
import { createPublicClient, http } from 'viem'
import { mainnet, sepolia } from 'viem/chains'

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
```

### 3. 查询余额示例

```typescript
// balance-query.ts
import { getBalance, formatEther } from 'viem'
import { mainnetClient } from './client-setup'

async function getAccountBalance(address: string) {
  try {
    const balance = await mainnetClient.getBalance({ address })
    console.log(`账户 ${address} 的余额: ${formatEther(balance)} ETH`)
    return balance
  } catch (error) {
    console.error('查询余额失败:', error)
    throw error
  }
}

// 使用示例
getAccountBalance('0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6')
```

### 4. 合约读取示例

```typescript
// contract-read.ts
import { readContract } from 'viem'
import { mainnetClient } from './client-setup'

// ERC20 代币 ABI
const erc20Abi = [
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'decimals',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint8' }],
  },
  {
    name: 'symbol',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'string' }],
  },
] as const

async function getTokenBalance(
  tokenAddress: string,
  userAddress: string
) {
  try {
    const [balance, decimals, symbol] = await Promise.all([
      mainnetClient.readContract({
        address: tokenAddress,
        abi: erc20Abi,
        functionName: 'balanceOf',
        args: [userAddress],
      }),
      mainnetClient.readContract({
        address: tokenAddress,
        abi: erc20Abi,
        functionName: 'decimals',
      }),
      mainnetClient.readContract({
        address: tokenAddress,
        abi: erc20Abi,
        functionName: 'symbol',
      }),
    ])

    const formattedBalance = Number(balance) / Math.pow(10, decimals)
    console.log(`${symbol} 余额: ${formattedBalance}`)
    
    return { balance, decimals, symbol, formattedBalance }
  } catch (error) {
    console.error('查询代币余额失败:', error)
    throw error
  }
}

// 使用示例 (USDC 代币)
getTokenBalance(
  '0xA0b86a33E6441b8c4C8C8C8C8C8C8C8C8C8C8C8', // USDC 合约地址
  '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6'  // 用户地址
)
```

## React 集成示例

### 自定义 Hooks

```typescript
// hooks/useBalance.ts
import { useQuery } from '@tanstack/react-query'
import { getBalance, formatEther } from 'viem'
import { mainnetClient } from '../client-setup'

export function useBalance(address: string) {
  return useQuery({
    queryKey: ['balance', address],
    queryFn: () => mainnetClient.getBalance({ address }),
    enabled: !!address,
    select: (balance) => formatEther(balance),
  })
}
```

```typescript
// hooks/useContractRead.ts
import { useQuery } from '@tanstack/react-query'
import { readContract } from 'viem'
import { mainnetClient } from '../client-setup'

export function useContractRead({
  address,
  abi,
  functionName,
  args,
}: {
  address: string
  abi: any
  functionName: string
  args?: any[]
}) {
  return useQuery({
    queryKey: ['contract-read', address, functionName, args],
    queryFn: () =>
      mainnetClient.readContract({
        address,
        abi,
        functionName,
        args,
      }),
    enabled: !!address,
  })
}
```

### React 组件示例

```typescript
// components/BalanceDisplay.tsx
import React from 'react'
import { useBalance } from '../hooks/useBalance'

interface BalanceDisplayProps {
  address: string
}

export function BalanceDisplay({ address }: BalanceDisplayProps) {
  const { data: balance, isLoading, error } = useBalance(address)

  if (isLoading) {
    return <div className="text-gray-500">加载余额中...</div>
  }

  if (error) {
    return <div className="text-red-500">错误: {error.message}</div>
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-2">账户余额</h3>
      <p className="text-2xl font-bold text-green-600">
        {balance} ETH
      </p>
      <p className="text-sm text-gray-500 mt-1">
        地址: {address.slice(0, 6)}...{address.slice(-4)}
      </p>
    </div>
  )
}
```

```typescript
// components/TokenBalance.tsx
import React from 'react'
import { useContractRead } from '../hooks/useContractRead'

interface TokenBalanceProps {
  tokenAddress: string
  userAddress: string
}

const erc20Abi = [
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'decimals',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint8' }],
  },
  {
    name: 'symbol',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'string' }],
  },
] as const

export function TokenBalance({ tokenAddress, userAddress }: TokenBalanceProps) {
  const { data: balance, isLoading: balanceLoading } = useContractRead({
    address: tokenAddress,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: [userAddress],
  })

  const { data: decimals } = useContractRead({
    address: tokenAddress,
    abi: erc20Abi,
    functionName: 'decimals',
  })

  const { data: symbol } = useContractRead({
    address: tokenAddress,
    abi: erc20Abi,
    functionName: 'symbol',
  })

  if (balanceLoading) {
    return <div className="text-gray-500">加载代币余额中...</div>
  }

  if (!balance || !decimals || !symbol) {
    return <div className="text-red-500">无法获取代币信息</div>
  }

  const formattedBalance = Number(balance) / Math.pow(10, decimals)

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-2">代币余额</h3>
      <p className="text-2xl font-bold text-blue-600">
        {formattedBalance.toFixed(6)} {symbol}
      </p>
    </div>
  )
}
```

## 进阶示例

### 多链支持

```typescript
// advanced-examples/multi-chain.ts
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

async function getMultiChainBalance(address: string) {
  const results = await Promise.allSettled([
    clients.ethereum.getBalance({ address }),
    clients.polygon.getBalance({ address }),
    clients.arbitrum.getBalance({ address }),
  ])

  return {
    ethereum: results[0].status === 'fulfilled' ? results[0].value : null,
    polygon: results[1].status === 'fulfilled' ? results[1].value : null,
    arbitrum: results[2].status === 'fulfilled' ? results[2].value : null,
  }
}
```

### 事件监听

```typescript
// advanced-examples/event-listener.ts
import { watchContractEvent } from 'viem'
import { mainnetClient } from '../client-setup'

const transferEventAbi = [
  {
    name: 'Transfer',
    type: 'event',
    inputs: [
      { name: 'from', type: 'address', indexed: true },
      { name: 'to', type: 'address', indexed: true },
      { name: 'value', type: 'uint256' },
    ],
  },
] as const

export function startTransferListener(contractAddress: string) {
  const unwatch = watchContractEvent(mainnetClient, {
    address: contractAddress,
    abi: transferEventAbi,
    eventName: 'Transfer',
    onLogs: (logs) => {
      logs.forEach((log) => {
        console.log('检测到转账事件:', {
          from: log.args.from,
          to: log.args.to,
          value: log.args.value,
          transactionHash: log.transactionHash,
        })
      })
    },
  })

  return unwatch
}

// 使用示例
const unwatch = startTransferListener('0xA0b86a33E6441b8c4C8C8C8C8C8C8C8C8C8C8C8')

// 停止监听
// unwatch()
```

### Gas 估算

```typescript
// advanced-examples/gas-estimation.ts
import { estimateGas, parseEther } from 'viem'
import { mainnetClient } from '../client-setup'

async function estimateTransactionGas({
  from,
  to,
  value,
  data,
}: {
  from: string
  to: string
  value: string
  data?: string
}) {
  try {
    const gasEstimate = await mainnetClient.estimateGas({
      account: from,
      to,
      value: parseEther(value),
      data: data as `0x${string}`,
    })

    console.log(`预估 Gas 费用: ${gasEstimate.toString()}`)
    return gasEstimate
  } catch (error) {
    console.error('Gas 估算失败:', error)
    throw error
  }
}

// 使用示例
estimateTransactionGas({
  from: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
  to: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
  value: '0.1',
})
```

## 运行示例

1. 安装依赖：
```bash
npm install viem @tanstack/react-query
```

2. 配置 RPC 端点：
   - 在 `client-setup.ts` 中替换 `YOUR_API_KEY` 为您的 Alchemy API 密钥
   - 或者使用其他 RPC 提供商

3. 运行示例：
```bash
# 运行基础示例
npx tsx basic-examples/balance-query.ts

# 运行 React 示例
npm run dev
```

## 注意事项

1. **API 密钥**: 在生产环境中，请将 API 密钥存储在环境变量中
2. **错误处理**: 始终添加适当的错误处理
3. **类型安全**: 使用 TypeScript 以获得更好的开发体验
4. **性能优化**: 使用 React Query 进行缓存和状态管理
5. **网络选择**: 根据您的需求选择合适的网络（主网/测试网）

## 更多资源

- [Viem 官方文档](https://viem.sh/)
- [Wagmi Hooks](https://wagmi.sh/)
- [React Query 文档](https://tanstack.com/query/latest) 