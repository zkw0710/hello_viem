'use client';

import { useState, useEffect } from 'react';
import { createPublicClient, createWalletClient, http, formatEther, getContract, custom } from 'viem';
import { foundry } from 'viem/chains';
import TokenBank_ABI from './contracts/TokenBank.json';

//TokenBank
const TOKENBANK_ADDRESS = "0x5aAdFB43eF8dAF45DD80F4676345b7676f1D70e3";

export default function Home() {
  const [balance, setBalance] = useState<string>('0');
  const [counterNumber, setCounterNumber] = useState<string>('0');
  const [address, setAddress] = useState<`0x${string}` | undefined>();
  const [isConnected, setIsConnected] = useState(false);
  const [chainId, setChainId] = useState<number | undefined>();

  const publicClient = createPublicClient({
    chain: foundry,
    transport: http(),
  });

  // 连接钱包
  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      alert('请安装 MetaMask');
      return;
    }

    try {
      const [address] = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      
      setAddress(address as `0x${string}`);
      setChainId(Number(chainId));
      setIsConnected(true);

      // 监听账户变化
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length === 0) {
          setIsConnected(false);
          setAddress(undefined);
        } else {
          setAddress(accounts[0] as `0x${string}`);
        }
      });

      // 监听网络变化
      window.ethereum.on('chainChanged', (chainId: string) => {
        setChainId(Number(chainId));
      });
    } catch (error) {
      console.error('连接钱包失败:', error);
    }
  };

  // 断开连接
  const disconnectWallet = () => {
    setIsConnected(false);
    setAddress(undefined);
    setChainId(undefined);
  };

  // 获取 Counter 合约的数值
  const getBalance = async () => {
    if (!address) return;
    
    publicClient.readContract({
      address: TOKENBANK_ADDRESS,
      abi: TokenBank_ABI,
      functionName: "getUserBalance",
      args: [address.toString()],
    })

    // const balance = await counterContract.read.getUserBalance([address.toString()]) as string;
    // setBalance(balance);
    // console.log('balance of:', balance);
  };

  // 调用 deposit 函数存款
  const handleDeposit = async () => {
    if (!address) return;
    
    const walletClient = createWalletClient({
      chain: foundry,
      transport: custom(window.ethereum),
    });

    try {
      const hash = await walletClient.writeContract({
        address: TOKENBANK_ADDRESS,
        abi: TokenBank_ABI,
        functionName: 'deposit',
        account: address,
        value: 10,
      });
      console.log('Transaction hash:', hash);

      getBalance();
    } catch (error) {
      console.error('调用 increment 失败:', error);
    }
  };

  //取款
  const handlewithdraw  = async() => {
    if(!address) return;
    const walletClient = createWalletClient({
      chain: foundry,
      transport: custom(window.ethereum),
    });

    try {
      const hash = await walletClient.writeContract({
        address: TOKENBANK_ADDRESS,
        abi: TokenBank_ABI,
        functionName: 'withdraw',
        args:[10],
        account: address
      });
      getBalance();
    } catch (error) {
      
    }
  }

  useEffect(() => {
    const fetchBalance = async () => {
      if (!address) return;

      console.log("begin get balance....");

      const counterContract = getContract({
        address: TOKENBANK_ADDRESS,
        abi: TokenBank_ABI,
        client: publicClient,
      });

      const balance = await counterContract.read.getUserBalance([address]);
      console.log('get address balance is ', balance);
      //setBalance(formatEther(balance));
    };

    if (address) {
      fetchBalance();
    }
  }, [address]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-3xl font-bold mb-8">Simple Viem Demo</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
        <div className="mb-4">
          <a
            href="/siwe"
            className="block w-full bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600 transition-colors text-center"
          >
            前往 SIWE 登录演示
          </a>
        </div>
        
        {!isConnected ? (
          <button
            onClick={connectWallet}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
          >
            连接 MetaMask
          </button>
        ) : (
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-gray-600">钱包地址:</p>
              <p className="font-mono break-all">{address}</p>
            </div>
            <div className="text-center">
              <p className="text-gray-600">当前网络:</p>
              <p className="font-mono">
                {foundry.name} (Chain ID: {chainId})
              </p>
            </div>
            <div className="text-center">
              <button
                onClick={handleDeposit}
                className="mt-2 w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition-colors"
              >
                存款
              </button>
            </div>
            <div className="text-center">
              <button
                onClick={handlewithdraw}
                className="mt-2 w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition-colors"
              >
                取款
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}