
import { getContract, createPublicClient, createWalletClient, decodeEventLog, http, parseEventLogs, publicActions } from "viem"
import { privateKeyToAccount } from "viem/accounts";
import { foundry } from "viem/chains";
import NFTMarket_ABI from './abis/NFTMarket.json' assert { type: 'json' };;
import ERC721_ABI from './abis/MyERC721.json' assert { type: 'json' };
import dotenv from 'dotenv';
import { simulateContract, waitForTransactionReceipt } from 'viem/actions';
dotenv.config();

const main = async () => {

    const MARKEET_ADDRESS = "0x5c4a3C2CD1ffE6aAfDF62b64bb3E620C696c832E";
    const ERC20_ADDRESS = "0x5aAdFB43eF8dAF45DD80F4676345b7676f1D70e3";
    const ERC721_ADDRESS = "0xf13D09eD3cbdD1C930d4de74808de1f33B6b3D4f";

    //创建公共客户端
     const publicClient = createPublicClient({
        chain: foundry,
        transport: http(process.env.RPC_URL!)
     }).extend(publicActions);  

     //钱包客户端
     const account = privateKeyToAccount(
        process.env.PRIVATE_KEY! as `0x{string}`
     );
     const walletClient = createWalletClient({
        account,
        chain: foundry,
        transport: http(process.env.RPC_URL!)
     });

     const erc721Contract = getContract({
        address: ERC721_ADDRESS,
        abi: ERC721_ABI,
        client: {
            public: publicClient,
            wallet: walletClient
        }
     })

    const unwatch = publicClient.watchEvent({
     onLogs: logs => {
       console.log('监听到事件:', logs)
     }
   })
   
   //   publicClient.watchEvent({
   //       address: ERC721_ADDRESS,
   //       event: {
   //          type: 'event',
   //          name: 'Transfer',
   //          inputs: [
   //             { type: 'address', name: 'from', indexed: true },
   //             { type: 'address', name: 'to', indexed: true },
   //             { type: 'uint256', name: 'value' }
   //          ]
   //       },
   //       onLogs: (logs) => {
   //          console.log (logs)
   //       }
   //    });
     
     const hash = await erc721Contract.write.mint([]);
     console.log(`调用合约方法mint ,hash is ${hash} `);

     const receipt = await publicClient.waitForTransactionReceipt({hash: hash});
     console.log(`交易状态： ${receipt.status}`);
     console.log("交易日志：",receipt);
     


    //  const mintEvent = decodeEventLog({
    //     abi: ERC721_ABI,
    //     data: logs[0].data,
    //     topices: logs[0].topics
    //  });

     //上架
    //  await walletClient.writeContract({
    //     address:MARKEET_ADDRESS,
    //     abi:NFTMarket_ABI,
    //     functionName: 'list',
    //     args:[ERC20_ADDRESS,]
    //  });

    //  //购买
    //  await walletClient.writeContract({
    //     address: MARKEET_ADDRESS,
    //     abi:NFTMarket_ABI,
    //     functionName: 'buyNFT',
    //     args: []
    //  });

    //  //查询上架信息
    //  const tx = await publicClient.readContract({
    //     address: MARKEET_ADDRESS,
    //     abi: NFTMarket_ABI,
    //     functionName: '',
    //     args:[queryList]
    //  });

    //  const receipt = await publicClient.waitForTransactionReceipt({hash: tx});
    //  const transferLogs = await parseEventLogs({
    //     abi: NFTMarket_ABI,
    //     eventName: 'NFTListed',
    //     logs: receipt.logs,
    //  });

    //  for(const log of transferLogs){
    //     const eventLog = log as unknown as {eventName: string; args: {from: string, to: string; value: bigint}};
    //     if(eventLog.eventName === ''){
    //         console.log();
    //     }
    //  }
}  
main();