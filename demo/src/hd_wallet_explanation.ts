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
console.log('2. 主密钥（Master Key）:');
console.log(`   种子: ${seed.toString('hex')}\n`);

// 3. 演示分层派生
console.log('3. 分层派生演示:\n');

// 第一层：币种派生
const coinHDKey = masterHDKey.derivePath("m/44'/60'");
console.log('   第一层 - 币种派生 (m/44\'/60\'):');
console.log(`   派生出以太坊专用密钥\n`);

// 第二层：账户派生
const account0HDKey = coinHDKey.derivePath("0'");
const account1HDKey = coinHDKey.derivePath("1'");
console.log('   第二层 - 账户派生:');
console.log(`   账户 0: m/44'/60'/0'`);
console.log(`   账户 1: m/44'/60'/1'\n`);

// 第三层：链类型派生
const externalChain0 = account0HDKey.derivePath("0");
const internalChain0 = account0HDKey.derivePath("1");
console.log('   第三层 - 链类型派生:');
console.log(`   外部链: m/44'/60'/0'/0 (用于接收)`);
console.log(`   内部链: m/44'/60'/0'/1 (用于找零)\n`);

// 第四层：地址索引派生
const address0 = externalChain0.derivePath("0");
const address1 = externalChain0.derivePath("1");
const address2 = externalChain0.derivePath("2");

console.log('   第四层 - 地址索引派生:');
console.log(`   地址 0: m/44'/60'/0'/0/0`);
console.log(`   地址 1: m/44'/60'/0'/0/1`);
console.log(`   地址 2: m/44'/60'/0'/0/2\n`);

// 4. 生成实际钱包
console.log('4. 生成的钱包地址:\n');

const wallet0 = address0.getWallet();
const wallet1 = address1.getWallet();
const wallet2 = address2.getWallet();

console.log(`   地址 0: ${wallet0.getAddressString()}`);
console.log(`   地址 1: ${wallet1.getAddressString()}`);
console.log(`   地址 2: ${wallet2.getAddressString()}\n`);

// 5. 演示从不同路径派生
console.log('5. 不同派生路径对比:\n');

const paths = [
    "m/44'/60'/0'/0/0",  // 账户 0，外部链，地址 0
    "m/44'/60'/0'/0/1",  // 账户 0，外部链，地址 1
    "m/44'/60'/1'/0/0",  // 账户 1，外部链，地址 0
    "m/44'/60'/0'/1/0",  // 账户 0，内部链，地址 0
];

paths.forEach(path => {
    const wallet = masterHDKey.derivePath(path).getWallet();
    console.log(`   路径 ${path}:`);
    console.log(`   地址: ${wallet.getAddressString()}`);
    console.log(`   私钥: ${wallet.getPrivateKeyString().slice(0, 20)}...\n`);
});

console.log('=== HD 钱包的优势 ===');
console.log('✅ 确定性：从种子可以恢复所有密钥');
console.log('✅ 分层性：按层级组织密钥，便于管理');
console.log('✅ 可扩展：可以生成无限多个地址');
console.log('✅ 备份简单：只需要记住一个助记词');
console.log('✅ 标准兼容：遵循 BIP32/BIP44 标准');
console.log('✅ 安全性：每个地址都有不同的私钥');
