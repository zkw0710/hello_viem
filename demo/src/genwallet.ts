import * as bip39 from 'bip39'
import ethereumjsWallet from 'ethereumjs-wallet'

//const mnemonic = bip39.generateMnemonic();


const main =  async () => {
    const mnemoric = "token dry sense marble empty income burden basket ecology later total olympic";
    const seed = bip39.mnemonicToSeedSync(mnemoric);
    const masterHDKey = ethereumjsWallet.hdkey.fromMasterSeed(seed);
    console.log('2. 主密钥（Master Key）已生成\n');
    console.log(`   种子: ${seed.toString('hex')}\n`);

    var key1 = masterHDKey.derivePath("m/44'/60'/0'/0/1");
    const wallet1 = key1.getWallet();
    console.log(`   地址 0: ${wallet1.getAddressString()}`);

    // 构造交易参数示例（需根据实际环境补充/修改）
    const txParams = {
        from: wallet1.getAddressString(),
        to: '', // 这里填写接收方地址
        value: BigInt(1e14), // 0.0001 ETH，单位为wei
        chainId: 11155111, // Sepolia 测试网 chainId
        // EIP-1559 相关参数
        maxFeePerGas: BigInt(40 * 1e9), // 40 Gwei
        maxPriorityFeePerGas: BigInt(2 * 1e9), // 2 Gwei
        gasLimit: 21000n,
        nonce: 1,
    };

    const signedTx = await wallet1.signTransaction(txParams);
    const txHash = await wallet1.sendTransaction(signedTx);
    console.log(`   交易哈希: ${txHash}`);
}
main();