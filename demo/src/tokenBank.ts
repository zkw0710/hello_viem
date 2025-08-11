import { createPublicClient, createWalletClient, custom, formatEther, getContract, Hex, http, parseEther, publicActions } from "viem";
import TokenBank_ABI from './abis/TokenBakPermit.json' with { type: 'json' };
import { foundry } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";
import { signTypedData } from 'viem/actions';
import dotenv from 'dotenv';

dotenv.config();

const main = async () => {

    const TOKENBANK_ADDRESS = "0x4ed7c70F96B99c776995fB64377f0d4aB3B0e1C1";

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
        transport: http(process.env.RPC_URL!),
    }).extend(publicActions);
    
    const tokenBankContract = getContract({
        address: TOKENBANK_ADDRESS,
        abi: TokenBank_ABI,
        client: publicClient
    });

    const tokenAddress = await tokenBankContract.read.token() as `0x${string}`;
    console.log("获取token地址:", tokenAddress);

    //链接token合约
    const tokenContract = getContract({
        address: tokenAddress,
        abi: [{
            "type": "function",
            "name": "allowance",
            "inputs": [{"name": "_owner","type": "address"},{"name": "_spender","type": "address"}],
            "outputs": [{"name": "remaining","type": "uint256"}],
            "stateMutability": "view"
        }],
        client: publicClient
    });

    const depositBal = await tokenBankContract.read.balanceOf([tokenAddress]);
    console.log("查询tokenbank中token余额:", depositBal);

    const publictokenContract = getContract({
        address: tokenAddress,
        abi: [{
            "type": "function",
            "name": "balanceOf",
            "inputs": [{ "name": "owner", "type": "address" }],
            "outputs": [{ "name": "", "type": "uint256" }],
            "stateMutability": "view"
        }],
        client: publicClient
    });

    const tokenBal = await publictokenContract.read.balanceOf([tokenAddress]);
    console.log("查询token余额:", tokenBal);

    //签名存款
    const walletTokenContract = getContract({
        address: tokenAddress,
        abi: [
            {
                "type": "function",
                "name": "nonces",
                "inputs": [{ "name": "owner", "type": "address" }],
                "outputs": [{ "name": "", "type": "uint256" }],
                "stateMutability": "view"
            },
            {
                "type": "function",
                "name": "DOMAIN_SEPARATOR",
                "inputs": [],
                "outputs": [{ "name": "", "type": "bytes32" }],
                "stateMutability": "view"
            }
        ],
        client: publicClient,
    });

    const nonce = await walletTokenContract.read.nonces([account.address]) as BigInt;

     console.log("nonce is :", nonce)

    // 设置deadline为当前时间+1小时
    const deadline = BigInt(Math.floor(Date.now() / 1000) + 3600);

    const domain = {
        name: 'AndyToken', // 需要替换为实际的Token名称
        version: '1',
        chainId: foundry.id,
        verifyingContract: tokenAddress,
    };

    const types = {
        Permit: [
            { name: 'owner', type: 'address' },
            { name: 'spender', type: 'address' },
            { name: 'value', type: 'uint256' },
            { name: 'nonce', type: 'uint256' },
            { name: 'deadline', type: 'uint256' },
        ],
    };

    const value = {
        owner: account.address,
        spender: TOKENBANK_ADDRESS,
        value: parseEther("0.1","gwei"),
        nonce,
        deadline,
    };

    const signature = await signTypedData(walletClient, {
        account: account.address,
        domain,
        types,
        primaryType: 'Permit',
        message: value,
    });

    console.log("singer is:", signature);

    const depositBal2 = await tokenContract.read.allowance([account.address,TOKENBANK_ADDRESS]);
    console.log("查询tokenbank中token余额:", formatEther(depositBal2));

    const r = signature.slice(0, 66) as Hex;
    const s = ('0x' + signature.slice(66, 130)) as Hex;
    const v = parseInt('0x' + signature.slice(130, 132), 16);

    const hash = await walletClient.writeContract({
        address: TOKENBANK_ADDRESS,
        abi: TokenBank_ABI,
        functionName: 'permitDeposit',
        args: [parseEther("0.1","gwei"), deadline, v, r, s],
        account: account.address
    });

    console.log('Permit Deposit hash:', hash);

    // const account_banalece = await publictokenContract.read.balanceOf([account.add]);
    // console.log("查询token余额:", account_banalece);
}

main();