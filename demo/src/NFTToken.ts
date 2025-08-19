import { createPublicClient, createWalletClient, getContract, Hex, http, parseEther, publicActions } from 'viem';
import NFTMarket  from './abis/NFTMarket.json' with { type: 'json' };
import { foundry } from 'viem/chains';
import { privateKeyToAccount } from "viem/accounts";
import { signTypedData } from 'viem/actions';

// 环境变量中读取私钥（项目方）

async function getSignnature(lintingId: BigInt, sender: string, deadline: BigInt) {

  let writeList: string[] = [];
  writeList.push();
  if(writeList.indexOf(sender) == -1){
    console.error("sender not in writeList");
    return;
  }

  const NFTMakertAddress = "0x";
  const account = privateKeyToAccount(
    process.env.PRIVATE_KEY! as `0x${string}`
  );

  const publicClient = createPublicClient({
    chain: foundry,
    transport: http(process.env.RPC_URL!),
  }).extend(publicActions);

  const walletClient = createWalletClient({
    account,
    chain: foundry,
    transport: http(process.env.RPC_URL!),
  }).extend(publicActions);


  const NFTMarketContract =  getContract({
    address: NFTMakertAddress,
    abi: NFTMarket,
    client: publicClient
  });

  const listing = await NFTMarketContract.read.queryList([lintingId]) as 
          {
             listingId: BigInt,
             seller: `0x${string}`,
             nftContract: `0x${string}`,
             tokenId: BigInt ,
             price: BigInt
          }
  const nonce = await NFTMarketContract.read.nonces([account.address]) as BigInt;

  const domain = {
    name: 'AndyToken', // 需要替换为实际的Token名称
    version: '1',
    chainId: foundry.id,
    verifyingContract: listing.nftContract,
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
    spender: sender,
    value: BigInt(0), // 使用固定值或从参数获取
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

  const r = signature.slice(0, 66) as Hex;
  const s = ('0x' + signature.slice(66, 130)) as Hex;
  const v = parseInt('0x' + signature.slice(130, 132), 16);

  // 返回给前端 wlV/wlR/wlS 或一个签名字符串（前端拆分）
  return { r, s, v };
}


const main = async () => {

  const NFTMakertAddress = "0x";

  const account = privateKeyToAccount(
    process.env.PRIVATE_KEY! as `0x${string}`
  );

  const publicClient = createPublicClient({
    chain: foundry,
    transport: http(process.env.RPC_URL!),
  }).extend(publicActions);

  const walletClient = createWalletClient({
    account,
    chain: foundry,
    transport: http(process.env.RPC_URL!),
  }).extend(publicActions);

  const NFTMarketContract =  getContract({
    address: NFTMakertAddress,
    abi: NFTMarket,
    client: publicClient
  });

  //测试数据
  const lintingId = 1n;
  const sender = '0x';
  const deadline = BigInt(Math.floor(Date.now() / 1000) + 3600);

  const result = await getSignnature(lintingId,sender,deadline);
  if(!result){
    return;
  }
  const {r, s, v} = result;

  const listing = await NFTMarketContract.read.queryList([lintingId]) as 
  {
     listingId: BigInt,
     seller: `0x${string}`,
     nftContract: `0x${string}`,
     tokenId: BigInt ,
     price: BigInt
  }
  const nonce = await NFTMarketContract.read.nonces([account.address]) as BigInt;

  const hash = await walletClient.writeContract({
    address: NFTMakertAddress,
    abi: NFTMarket,
    functionName: 'permitBuy',
    args: [parseEther("0.1", "gwei"), deadline, v, r, s],
    account: account.address
  });
  const receipt = await walletClient.waitForTransactionReceipt({ hash: hash });
}

