import * as bip39 from 'bip39'
import ethereumjsWallet from 'ethereumjs-wallet'

console.log('=== HD 钱包（分层确定性钱包）详解 ===\n');

// 1. 生成助记词（种子）
const mnemonic = bip39.generateMnemonic();
console.log('1. 助记词（种子）:');
console.log(`   ${mnemonic}\n`);

// 2. 从助记词生成主密钥
const seed = bip39.mnemonicToSeedSync(mnemonic);
const masterHDKey = ethereumjsWallet.hdkey.fromMasterSeed(seed);
console.log('2. 主密钥（Master Key）已生成\n');

// 3. 演示分层派生
console.log('3. 分层派生演示:\n');

// 演示不同路径的钱包
const paths = [
    "m/44'/60'/0'/0/0",  // 账户 0，外部链，地址 0
    "m/44'/60'/0'/0/1",  // 账户 0，外部链，地址 1
    "m/44'/60'/1'/0/0",  // 账户 1，外部链，地址 0
    "m/44'/60'/2'/0/0",  // 账户 2，外部链，地址 0
];

paths.forEach((path, index) => {
    try {
        const wallet = masterHDKey.derivePath(path).getWallet();
        console.log(`   路径 ${path}:`);
        console.log(`   地址: ${wallet.getAddressString()}`);
        console.log(`   私钥: ${wallet.getPrivateKeyString().slice(0, 20)}...\n`);
    } catch (error) {
        console.log(`   路径 ${path}: 派生失败\n`);
    }
});

console.log('=== HD 钱包的含义 ===');
console.log('HD = Hierarchical Deterministic（分层确定性）\n');

console.log('🔑 分层（Hierarchical）:');
console.log('   - 密钥按层级结构组织');
console.log('   - 每个层级都可以派生出子密钥');
console.log('   - 支持无限深度的派生\n');

console.log('🎯 确定性（Deterministic）:');
console.log('   - 从同一个种子总是生成相同的密钥序列');
console.log('   - 只要记住种子（助记词），就能恢复所有密钥');
console.log('   - 不需要单独备份每个私钥\n');

console.log('📁 路径结构 m/44\'/60\'/0\'/0/0:');
console.log('   m = 主密钥（Master Key）');
console.log('   44\' = BIP44 标准（硬派生）');
console.log('   60\' = 币种类型（60 = 以太坊）');
console.log('   0\' = 账户索引（Account Index）');
console.log('   0 = 链类型（0 = 外部链，1 = 内部链）');
console.log('   0 = 地址索引（Address Index）\n');

console.log('✅ HD 钱包的优势:');
console.log('   - 确定性：从种子可以恢复所有密钥');
console.log('   - 分层性：按层级组织密钥，便于管理');
console.log('   - 可扩展：可以生成无限多个地址');
console.log('   - 备份简单：只需要记住一个助记词');
console.log('   - 标准兼容：遵循 BIP32/BIP44 标准');
console.log('   - 安全性：每个地址都有不同的私钥');
