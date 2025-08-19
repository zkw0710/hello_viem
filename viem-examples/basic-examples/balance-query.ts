import { getBalance, formatEther } from 'viem'
import { defaultClient } from './client-setup'

async function getAccountBalance(address: string) {
  try {
    console.log(`正在查询地址 ${address} 的余额...`)
    
    const balance = await defaultClient.getBalance({ address })
    const formattedBalance = formatEther(balance)
    
    console.log(`✅ 查询成功!`)
    console.log(`地址: ${address}`)
    console.log(`余额: ${formattedBalance} ETH`)
    console.log(`原始值: ${balance.toString()} wei`)
    
    return {
      address,
      balance,
      formattedBalance,
      wei: balance.toString()
    }
  } catch (error) {
    console.error('❌ 查询余额失败:', error)
    throw error
  }
}

// 使用示例
async function main() {
  // 示例地址（Vitalik Buterin 的地址）
  const exampleAddress = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'
  
  try {
    const result = await getAccountBalance(exampleAddress)
    console.log('\n📊 查询结果汇总:')
    console.log(JSON.stringify(result, null, 2))
  } catch (error) {
    console.error('程序执行失败:', error)
  }
}

// 如果直接运行此文件
if (require.main === module) {
  main()
}

export { getAccountBalance } 