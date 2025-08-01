import {
    createPublicClient,
    formatEther,
    http,
    publicActions
} from 'viem';
import { foundry } from 'viem/chains';

const ERC20_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

const main = async() => {

    const publicClient = createPublicClient({
        chain: foundry,
        transport: http(process.env.PRV_RUL!)
    }).extend(publicActions);

    console.log('开始监听ERC20转账事件');

    const unwatch = publicClient.watchEvent({
        address: ERC20_ADDRESS,
        event: {
            type: 'event',
            name: 'Transfer',
            inputs:[
                {type: 'address', name: 'from', indexed: true},
                {type: 'address', name: 'to', indexed: true},
                {type: 'uint256', name: 'value'}
            ]
        },
        onLogs: (logs) => {
            logs.forEach((log) => {
                if(log.args.value !== undefined){
                    console.log('\n检测到新的转账事件');
                    console.log(`从: ${log.args.from}`);
                        console.log(`到: ${log.args.to}`);
                        console.log(`金额: ${formatEther(log.args.value)}`);
                        console.log(`交易哈希: ${log.transactionHash}`);
                        console.log(`区块号: ${log.blockNumber}`);
                }
            })
        }
    });

    process.on('SIGINT', () => {
        console.log('\n停止监听。。。');
        unwatch();
        process.exit();
    });
}



main().catch((error) => {
    console.log('发生错误:',error);
    process.exit(1);
});;