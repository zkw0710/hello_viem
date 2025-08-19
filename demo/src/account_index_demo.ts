import * as bip39 from 'bip39'
import ethereumjsWallet from 'ethereumjs-wallet'

const mnemonic = bip39.generateMnemonic();
console.log('生成的助记词:', mnemonic);
console.log('=====================================\n');

// 从助记词生成 HD 钱包
const hdWallet = ethereumjsWallet.hdkey.fromMasterSeed(bip39.mnemonicToSeedSync(mnemonic));

// 演示不同账户索引
const accountIndices = [0, 1, 2, 3];

accountIndices.forEach(accountIndex => {
    console.log(`=== 账户 ${accountIndex} ===`);
    
    // 派生路径：m/44'/60'/{accountIndex}'/0/0
    const path = `m/44'/60'/${accountIndex}'/0/0`;
    console.log(`派生路径: ${path}`);
    
    const wallet = hdWallet.derivePath(path).getWallet();
    
    console.log(`钱包地址: ${wallet.getAddressString()}`);
    console.log(`私钥: ${wallet.getPrivateKeyString()}`);
    console.log('');
});

console.log('=====================================');
console.log('说明：');
console.log('- 每个账户索引都生成完全不同的钱包');
console.log('- 账户 0: 第一个以太坊账户');
console.log('- 账户 1: 第二个以太坊账户');
console.log('- 账户 2: 第三个以太坊账户');
console.log('- 每个账户都是独立的，私钥完全不同');
console.log('- 这允许用户在一个助记词下管理多个账户');
