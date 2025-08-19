import dotenv from 'dotenv';
import Counter_ABI from './abis/Counter.json' with { type: 'json' };
import { createPublicClient, createWalletClient, getContract, http, parseAbiItem, parseEventLogs, publicActions } from 'viem';
import { foundry } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';
dotenv.config();

const main = async() => {

    const COUNTER_ADDRESS = "0x5aAdFB43eF8dAF45DD80F4676345b7676f1D70e3";

    const publicClient = createPublicClient({
        chain: foundry,
        transport: http(process.env.RPC_URL!),
    }).extend(publicActions);

    const account = privateKeyToAccount(
        process.env.PRIVATE_KEY! as `0x${string}`
    );

    const walletClient = createWalletClient({
        account,
        chain: foundry,
        transport: http(process.env.RPC_URL!)
     });

    const counterContract = getContract({
        address: COUNTER_ADDRESS,
        abi: Counter_ABI,
        client: {
            public: publicClient,
            wallet: walletClient
        }
    });

   const tx = await counterContract.write.increment([]);  
   console.log("hs :", tx);

   const receipt = await publicClient.waitForTransactionReceipt({ hash: tx });
   console.log(`交易状态: ${receipt.status === 'success' ? '成功' : '失败'}`);

   console.log("receipt => \n",receipt);

   const transferLogs = await parseEventLogs({
        abi: Counter_ABI,
        eventName: 'NumberSet', 
        logs: receipt.logs,
    });
    
    console.log(transferLogs);
}

main();