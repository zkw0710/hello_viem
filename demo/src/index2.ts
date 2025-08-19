import { createPublicClient, createWalletClient, http, parseEther, publicActions, getContract, formatEther, parseEventLogs } from 'viem'
import { foundry } from 'viem/chains'
import dotenv from 'dotenv';
import { privateKeyToAccount } from 'viem/accounts';
import ERC20_ABI from './abis/MyERC20.json' with { type: 'json' };

dotenv.config();

const ERC20_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";


const main = async () => {

    const publicClient = createPublicClient({
        chain: foundry,
        transport: http(process.env.RPC_URL!),
    }).extend(publicActions);

    // 创建一个钱包客户端
    const account = privateKeyToAccount(
        process.env.PRIVATE_KEY! as `0x${string}`
    );

    const walletClient = createWalletClient({
        account,
        chain: foundry,
        transport: http(process.env.RPC_URL!),
    }).extend(publicActions);

    const erc20Contract = getContract({
        address: ERC20_ADDRESS,
        abi: ERC20_ABI,
        client: {
            public: publicClient,
            wallet: walletClient,
        },
    });


    const tx = await erc20Contract.write.transfer([
        "0x01BF49D75f2b73A2FDEFa7664AEF22C86c5Be3df",
        parseEther("1"),
    ]);
    console.log(` 调用 transfer 方法的 transaction hash is ${tx}`);

    // 等待交易被确认
    const receipt = await publicClient.waitForTransactionReceipt({ hash: tx });
    console.log(`交易状态: ${receipt.status === 'success' ? '成功' : '失败'}`);
    // console.log(receipt);
    // 从 receipt 中解析事件
    const transferLogs = await parseEventLogs({
        abi: ERC20_ABI,
        eventName: 'Transfer',
        logs: receipt.logs,
    });

    // 打印转账事件详情
    for (const log of transferLogs) {
        const eventLog = log as unknown as { eventName: string; args: { from: string; to: string; value: bigint } };
        if (eventLog.eventName === 'Transfer') {
            console.log('转账事件详情:');
            console.log(`从: ${eventLog.args.from}`);
            console.log(`到: ${eventLog.args.to}`);
            console.log(`金额: ${formatEther(eventLog.args.value)}`);
        }
    }

    const tx2 = await erc20Contract.write.getEvent([111]);
    const receipt2 = await publicClient.waitForTransactionReceipt({ hash: tx2 });
    console.log(receipt2)
};

main();