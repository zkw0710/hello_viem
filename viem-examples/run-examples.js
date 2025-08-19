#!/usr/bin/env node

const { execSync } = require('child_process')
const path = require('path')

console.log('🚀 Viem.js 示例运行器')
console.log('========================')

const examples = [
  {
    name: '余额查询示例',
    file: 'basic-examples/balance-query.ts',
    description: '查询以太坊账户余额'
  },
  {
    name: '合约读取示例',
    file: 'basic-examples/contract-read.ts',
    description: '读取 ERC20 代币合约信息'
  }
]

async function runExample(example) {
  console.log(`\n📋 运行: ${example.name}`)
  console.log(`📝 描述: ${example.description}`)
  console.log(`📁 文件: ${example.file}`)
  console.log('─'.repeat(50))
  
  try {
    const filePath = path.join(__dirname, example.file)
    execSync(`npx tsx ${filePath}`, { 
      stdio: 'inherit',
      cwd: __dirname 
    })
    console.log('✅ 示例运行成功!')
  } catch (error) {
    console.log('❌ 示例运行失败:', error.message)
  }
}

async function main() {
  console.log('可用的示例:')
  examples.forEach((example, index) => {
    console.log(`${index + 1}. ${example.name} - ${example.description}`)
  })
  
  console.log('\n开始运行所有示例...')
  
  for (const example of examples) {
    await runExample(example)
  }
  
  console.log('\n🎉 所有示例运行完成!')
  console.log('\n💡 提示:')
  console.log('- 要运行单个示例，使用: npx tsx basic-examples/balance-query.ts')
  console.log('- 要查看 React 示例，请查看 react-examples/ 目录')
  console.log('- 要查看进阶示例，请查看 advanced-examples/ 目录')
}

// 如果直接运行此文件
if (require.main === module) {
  main().catch(console.error)
}

module.exports = { runExample, examples } 