'use client'

import { useState } from 'react'
import { getAddress } from 'viem'

export default function Home() {
  const [address, setAddress] = useState<string>('')
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)

  const handleDisconnect = () => {
    // 直接清空缓存和状态，不需要 MetaMask 确认
    setAddress('')
    setIsConnected(false)
    
    // 清除本地存储的缓存
    if (typeof window !== 'undefined') {
      localStorage.removeItem('wallet_connected')
      localStorage.removeItem('wallet_address')
    }
    
    console.log('钱包已断开连接，缓存已清除')
  }

  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      alert('请安装 MetaMask 钱包插件')
      return
    }

    setIsConnecting(true)
    
    try {
      // 触发 MetaMask 钱包确认连接
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      })
      
      if (accounts && accounts.length > 0) {
        const account = getAddress(accounts[0])
        console.log('连接的钱包地址:', account)
        
        // 获取网络信息
        const chainId = await window.ethereum.request({
          method: 'eth_chainId'
        })
        
        console.log('当前网络 ID:', chainId)
        
        // 更新状态
        setAddress(account)
        setIsConnected(true)
        
        // 保存到本地存储
        if (typeof window !== 'undefined') {
          localStorage.setItem('wallet_connected', 'true')
          localStorage.setItem('wallet_address', account)
        }
        
        // 监听账户变化
        window.ethereum.on('accountsChanged', (newAccounts: string[]) => {
          if (newAccounts.length === 0) {
            // 用户断开了连接
            setAddress('')
            setIsConnected(false)
            localStorage.removeItem('wallet_connected')
            localStorage.removeItem('wallet_address')
          } else {
            // 用户切换了账户
            const newAccount = getAddress(newAccounts[0])
            setAddress(newAccount)
            localStorage.setItem('wallet_address', newAccount)
          }
        })
        
        // 监听网络变化
        window.ethereum.on('chainChanged', (newChainId: string) => {
          console.log('网络已切换:', newChainId)
          // 可以在这里处理网络切换逻辑
        })
        
      }
    } catch (error: any) {
      console.error('连接钱包失败:', error)
      if (error.code === 4001) {
        alert('用户拒绝了连接请求')
      } else {
        alert('连接钱包时发生错误')
      }
    } finally {
      setIsConnecting(false)
    }
  }

  // 页面加载时检查是否有已保存的钱包状态
  useState(() => {
    if (typeof window !== 'undefined') {
      const savedConnected = localStorage.getItem('wallet_connected')
      const savedAddress = localStorage.getItem('wallet_address')
      
      if (savedConnected === 'true' && savedAddress) {
        setAddress(savedAddress)
        setIsConnected(true)
      }
    }
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        {/* 钱包连接区域 */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex flex-col items-center space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800">
              钱包连接
            </h2>
            
            {!isConnected ? (
              <div className="text-center">
                <p className="text-gray-600 mb-4">
                  请点击下方按钮连接您的 MetaMask 钱包
                </p>
                <button
                  onClick={connectWallet}
                  disabled={isConnecting}
                  className="px-8 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg disabled:cursor-not-allowed"
                >
                  {isConnecting ? '连接中...' : '连接钱包'}
                </button>
              </div>
            ) : (
              <div className="text-center w-full">
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
                  <div className="flex items-center justify-center mb-4">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-green-800 font-medium">钱包已连接</span>
                  </div>
                  <p className="text-sm text-green-700">
                    地址: {address?.slice(0, 6)}...{address?.slice(-4)}
                  </p>
                </div>
                
                <div className="flex flex-col items-center space-y-4">
                  <button
                    onClick={handleDisconnect}
                    className="w-40 px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
                  >
                    断开连接
                  </button>
                  
                  <button
                    onClick={() => window.open(`https://etherscan.io/address/${address}`, '_blank')}
                    className="w-40 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-colors duration-200 shadow-md hover:shadow-lg"
                  >
                    查看区块浏览器
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
