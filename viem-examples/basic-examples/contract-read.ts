import { readContract } from 'viem'
import { defaultClient } from './client-setup'

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
  {
    name: 'name',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'string' }],
  },
] as const

async function getTokenInfo(tokenAddress: string) {
  try {
    console.log(`正在获取代币信息: ${tokenAddress}`)
    
    const [name, symbol, decimals] = await Promise.all([
      defaultClient.readContract({
        address: tokenAddress,
        abi: erc20Abi,
        functionName: 'name',
      }),
      defaultClient.readContract({
        address: tokenAddress,
        abi: erc20Abi,
        functionName: 'symbol',
      }),
      defaultClient.readContract({
        address: tokenAddress,
        abi: erc20Abi,
        functionName: 'decimals',
      }),
    ])

    console.log(`✅ 代币信息获取成功!`)
    console.log(`名称: ${name}`)
    console.log(`符号: ${symbol}`)
    console.log(`小数位: ${decimals}`)
    
    return { name, symbol, decimals }
  } catch (error) {
    console.error('❌ 获取代币信息失败:', error)
    throw error
  }
}

async function getTokenBalance(
  tokenAddress: string,
  userAddress: string
) {
  try {
    console.log(`正在查询代币余额...`)
    console.log(`代币地址: ${tokenAddress}`)
    console.log(`用户地址: ${userAddress}`)
    
    const [balance, decimals, symbol] = await Promise.all([
      defaultClient.readContract({
        address: tokenAddress,
        abi: erc20Abi,
        functionName: 'balanceOf',
        args: [userAddress],
      }),
      defaultClient.readContract({
        address: tokenAddress,
        abi: erc20Abi,
        functionName: 'decimals',
      }),
      defaultClient.readContract({
        address: tokenAddress,
        abi: erc20Abi,
        functionName: 'symbol',
      }),
    ])

    const formattedBalance = Number(balance) / Math.pow(10, decimals)
    
    console.log(`✅ 代币余额查询成功!`)
    console.log(`代币符号: ${symbol}`)
    console.log(`余额: ${formattedBalance.toFixed(6)} ${symbol}`)
    console.log(`原始余额: ${balance.toString()}`)
    
    return { 
      balance, 
      decimals, 
      symbol, 
      formattedBalance,
      userAddress,
      tokenAddress
    }
  } catch (error) {
    console.error('❌ 查询代币余额失败:', error)
    throw error
  }
}

// 使用示例
async function main() {
  // USDC 代币合约地址（以太坊主网）
  const usdcAddress = '0xA0b86a33E6441b8c4C8C8C8C8C8C8C8C8C8C8C8'
  // 示例用户地址
  const userAddress = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'
  
  try {
    console.log('🔍 获取代币信息...')
    const tokenInfo = await getTokenInfo(usdcAddress)
    
    console.log('\n💰 查询代币余额...')
    const balanceInfo = await getTokenBalance(usdcAddress, userAddress)
    
    console.log('\n📊 完整结果:')
    console.log(JSON.stringify({
      tokenInfo,
      balanceInfo
    }, null, 2))
    
  } catch (error) {
    console.error('程序执行失败:', error)
  }
}

// 如果直接运行此文件
if (require.main === module) {
  main()
}

export { getTokenInfo, getTokenBalance } 