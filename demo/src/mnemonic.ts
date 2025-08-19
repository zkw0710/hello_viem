import * as bip39 from 'bip39'
import ethereumjsWallet from 'ethereumjs-wallet'
import * as ethUtil from 'ethereumjs-util'

const mnemonic = bip39.generateMnemonic();
console.log('生成的助记词:', mnemonic);

// 从助记词生成 HD 钱包
const hdWallet = ethereumjsWallet.hdkey.fromMasterSeed(bip39.mnemonicToSeedSync(mnemonic,'pwd'));
const wallet = hdWallet.derivePath("m/44'/60'/0'/0/0").getWallet();

console.log('钱包地址:', wallet.getAddressString());
console.log('私钥:', wallet.getPrivateKeyString());
console.log('公钥:', wallet.getPublicKeyString());

// 使用 ethereumjs-util 进行额外的操作
const privateKey = wallet.getPrivateKey();
const address = wallet.getAddress();
console.log('私钥 Buffer:', privateKey);
console.log('地址 Buffer:', address);
console.log('地址 (hex):', ethUtil.bufferToHex(address));