import { createPublicClient, createWalletClient, http, publicActions, getContract, Hex, encodeFunctionData, parseUnits, parseEther, parseGwei, TransactionReceipt } from "viem";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";
import BANK_ABI from './abis/Bank.json' with { type: 'json' };
import dotenv from 'dotenv';
//import { createHash } from "cr;
import { prepareTransactionRequest } from "viem/actions";
import { createHash } from "crypto";
dotenv.config();

const main = async () => {


    const ERC20_ADDRESS = "0xb82CC54752a722De4F8DcD810620fe9581961036";

    // 根据固定的种子生成固定私钥（测试用）
    const seed = "my fixed seed";
    const privateKeyBytes = createHash('sha256').update(seed).digest();
    const privateKey = `0x${privateKeyBytes.toString('hex')}`;
    const account = privateKeyToAccount(privateKey as Hex);

    console.log("私钥:", privateKey);
    console.log("地址:", account.address);

    const publicClient = createPublicClient({
        chain: sepolia,
        transport: http(process.env.SEPOLIA_RPC_URL!),
    }).extend(publicActions);

    const walletClient = createWalletClient({
        account,
        chain: sepolia,
        transport: http(process.env.SEPOLIA_RPC_URL!),
    }).extend(publicActions);

    const blockNumber = await publicClient.getBlockNumber()
    console.log('当前区块号:', blockNumber)

    // 获取当前 gas 价格
    const gasPrice = await publicClient.getGasPrice()
    console.log('当前 gas 价格:', parseGwei(gasPrice.toString()))

    const ethBalance = await publicClient.getBalance({
        address: account.address
    });

    console.log("eth余额为：", ethBalance);

     const nonce = await publicClient.getTransactionCount({
      address: account.address
    })

    const transactionRequest = {
        account: account,
        to: ERC20_ADDRESS as `0x${string}`,
        value: parseEther('0.0001'),
        chainId: sepolia.id,
        type: 'eip1559' as const, // 使用 const 断言确保类型正确
        chain: sepolia, // 添加 chain 参数
        maxFeePerGas: parseGwei('40'), // 最大总费用（基础费用+小费）
        maxPriorityFeePerGas: parseGwei('2'), // 最大小费
    //    gas: 21000n, // 普通交易 - gas limit
        nonce: nonce
    };

    const preparedTx  = await prepareTransactionRequest(publicClient, transactionRequest);

    //方式 1：直接发送交易
    // const txHash1 = await walletClient.sendTransaction(preparedTx)
    // console.log('交易哈希:', txHash1)

    // 方式 2 ： 
    // 签名交易
    const signedTx = await walletClient.signTransaction(preparedTx)
    console.log('Signed Transaction:', signedTx)

    // 发送交易  eth_sendRawTransaction
    const txHash = await publicClient.sendRawTransaction({
        serializedTransaction: signedTx
    })
    console.log('Transaction Hash:', txHash)

    const receipt: TransactionReceipt = await publicClient.waitForTransactionReceipt({ hash: txHash })
    console.log('交易状态:', receipt.status === 'success' ? '成功' : '失败')
    console.log('区块号:', receipt.blockNumber)
    console.log('Gas 使用量:', receipt.gasUsed.toString())

    console.log(receipt);

}

main();