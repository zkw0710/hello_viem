import { createWalletClient, http, parseEther, parseGwei } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { mainnet } from 'viem/chains'

console.log('=== 以太坊交易中的 Nonce 详解 ===\n');

// 模拟账户状态
const accountState = {
    address: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
    balance: '1000000000000000000', // 1 ETH
    nonce: 5
};

console.log('1. 账户当前状态:');
console.log(`   地址: ${accountState.address}`);
console.log(`   余额: ${accountState.balance} wei (1 ETH)`);
console.log(`   当前 Nonce: ${accountState.nonce}\n`);

// 模拟交易序列
const transactions = [
    { to: '0x1234567890123456789012345678901234567890', value: '100000000000000000', description: '转账 0.1 ETH' },
    { to: '0x2345678901234567890123456789012345678901', value: '200000000000000000', description: '转账 0.2 ETH' },
    { to: '0x3456789012345678901234567890123456789012', value: '300000000000000000', description: '转账 0.3 ETH' }
];

console.log('2. 准备发送的交易序列:\n');

transactions.forEach((tx, index) => {
    const nonce = accountState.nonce + index;
    console.log(`   交易 ${index + 1}:`);
    console.log(`   目标地址: ${tx.to}`);
    console.log(`   转账金额: ${tx.value} wei (${parseFloat(tx.value) / 1e18} ETH)`);
    console.log(`   描述: ${tx.description}`);
    console.log(`   使用的 Nonce: ${nonce}`);
    console.log('');
});

console.log('3. Nonce 的作用机制:\n');

console.log('🔒 防止重放攻击:');
console.log('   - 每个 nonce 只能使用一次');
console.log('   - 一旦交易被确认，该 nonce 就不能重复使用');
console.log('   - 即使交易内容相同，nonce 不同也会产生不同的交易哈希\n');

console.log('📊 维护交易顺序:');
console.log('   - 节点必须按照 nonce 顺序处理交易');
console.log('   - nonce 为 5 的交易必须在 nonce 为 6 的交易之前处理');
console.log('   - 如果 nonce 为 5 的交易失败，nonce 为 6 的交易也会失败\n');

console.log('🔄 交易替换机制:');
console.log('   - 可以使用相同的 nonce 发送新交易来替换待处理的交易');
console.log('   - 新交易必须有更高的 gas 价格才能被接受');
console.log('   - 这允许用户取消或修改待处理的交易\n');

console.log('4. Nonce 规则:\n');

console.log('✅ 必须按顺序使用:');
console.log('   - 当前 nonce 为 5，下一个交易必须使用 nonce = 5');
console.log('   - 不能跳过 nonce 值（如直接使用 nonce = 7）\n');

console.log('✅ 不能重复使用:');
console.log('   - 每个 nonce 值只能使用一次');
console.log('   - 已确认交易的 nonce 不能再次使用\n');

console.log('✅ 交易失败不影响 nonce:');
console.log('   - 即使交易因 gas 不足等原因失败，nonce 仍然会被消耗');
console.log('   - 下一个交易必须使用下一个 nonce 值\n');

console.log('5. 实际应用场景:\n');

console.log('🎯 钱包管理:');
console.log('   - MetaMask 等钱包自动管理 nonce');
console.log('   - 用户无需手动设置 nonce 值\n');

console.log('🎯 交易加速:');
console.log('   - 使用相同 nonce 发送更高 gas 价格的交易');
console.log('   - 新交易会替换旧交易\n');

console.log('🎯 交易取消:');
console.log('   - 向自己地址发送 0 ETH 交易，使用待处理交易的 nonce');
console.log('   - 设置较低的 gas 价格，让交易长时间待处理\n');

console.log('6. 常见问题:\n');

console.log('❓ 问题: 为什么我的交易一直待处理？');
console.log('   答案: 可能是 gas 价格太低，或者前面有 nonce 更小的交易待处理\n');

console.log('❓ 问题: 如何取消待处理的交易？');
console.log('   答案: 使用相同 nonce 发送新交易，设置更高的 gas 价格\n');

console.log('❓ 问题: 交易失败后 nonce 会重置吗？');
console.log('   答案: 不会，nonce 仍然会被消耗，下一个交易必须使用下一个 nonce\n');

console.log('=== 总结 ===');
console.log('Nonce 是以太坊交易的核心机制，确保:');
console.log('✅ 交易顺序性 - 按顺序处理交易');
console.log('✅ 交易唯一性 - 防止重放攻击');
console.log('✅ 交易可替换性 - 允许取消或修改待处理交易');
console.log('✅ 系统安全性 - 维护区块链的完整性和一致性');
