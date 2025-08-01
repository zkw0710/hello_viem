import {createPublicClient, createWalletClient, http, parseEther, publicActions, getContract, formatEther, parseEventLogs} from 'viem'
import {foundry} from 'viem/chains'
import dotenv from 'dotenv';
import { privateKeyToAccount } from 'viem/accounts';
//import ERC20_ABI from './abis/MyERC20.json' with { type: 'json' };
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

dotenv.config();

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const ERC20_ABI = JSON.parse(
  await readFile(__dirname + '/abis/MyERC20.json', 'utf-8')
)
const Counter_ABI = JSON.parse(
    await readFile(__dirname + '/abis/Counter.json','utf-8')
);

const ERC20_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const COUNTER_ADDRESS = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";

const main = async() => {

    const client = createPublicClient({
        chain: foundry,
        transport: http(process.env.RPC_URL!),
    }).extend(publicActions);

    const blockNumber = await client.getBlockNumber();
    console.log(`The block number is ${blockNumber}`);


    const account = privateKeyToAccount(
        process.env.PRIVATE_KEY! as `0x${string}`
    );

    const walletClient = createWalletClient({
        account,
        chain: foundry,
        transport: http(process.env.RPC_URL!)
    }).extend(publicActions);

    const address = await walletClient.getAddresses();
    console.log(`The wallet address is  ${address}`);

    const hash1 = await walletClient.sendTransaction({
        account,
        to: "0x01BF49D75f2b73A2FDEFa7664AEF22C86c5Be3df",
        value: parseEther("0.01"),
    });

    console.log(`默认 gas 和 nonce 的 transaction hash is ${hash1}`);

    // 读取合约 方法 1
    const erc20Contract = getContract({
        address: ERC20_ADDRESS,
        abi: ERC20_ABI,
        client: {
            public: client,
            wallet: walletClient,
        }
    });

    const balance1 = formatEther(BigInt(await erc20Contract.read.balanceOf([
        address.toString(),
    ]) as string));
    console.log(`方法1 获取的余额是 ${address.toString()} is ${balance1}`)

    // 读取合约 方法 2
    const balance = formatEther(
        BigInt((await client.readContract({
            address: ERC20_ADDRESS,
            abi: ERC20_ABI,
            functionName: "balanceOf",
            args:[address.toString()],
        })) as string
     )
    );
    console.log(`方法2获取的余额是 ${address.toString()} is ${balance}`);

    const counterContract = getContract({
        address: COUNTER_ADDRESS,
        abi: Counter_ABI,
        client: {
            public: client,
            wallet: walletClient,
        }
    });

    const hash = await counterContract.write.increment([]);
    console.log(`调用 increment 方法的 transaction hash is ${hash}`);

    await walletClient.writeContract({
        address: COUNTER_ADDRESS,
        abi: Counter_ABI,
        functionName: 'increment',
        args:[],
    });

    const number2 = await counterContract.read.number([]);
    console.log(` 调用 number 方法的 number is ${number2}`);

    const tx = await erc20Contract.write.transfer([
        "0x01BF49D75f2b73A2FDEFa7664AEF22C86c5Be3df",
        parseEther("1"),
      ]);
      console.log(` 调用 transfer 方法的 transaction hash is ${tx}`);

      // 等待交易被确认
    const receipt = await client.waitForTransactionReceipt({ hash: tx });
    console.log(`交易状态: ${receipt.status === 'success' ? '成功' : '失败'}`);

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
}


main();