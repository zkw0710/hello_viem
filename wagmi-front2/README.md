# Wagmi Front2 - 区块链钱包连接项目

这是一个使用最新版本的 Wagmi、Viem、React 和 TypeScript 构建的区块链钱包连接前端项目。

## 🚀 功能特性

- **钱包连接**: 支持 MetaMask、WalletConnect 等多种钱包
- **多链支持**: 支持以太坊主网、测试网、Polygon、Optimism 等网络
- **现代化 UI**: 使用 Tailwind CSS 构建的响应式界面
- **TypeScript**: 完整的类型支持
- **自动启动**: 项目启动后自动打开界面

## 🛠️ 技术栈

- **React 18.2.0** - 最新的 React 版本
- **Next.js 14.0.4** - 现代化的 React 框架
- **Wagmi 2.5.7** - React Hooks 用于以太坊
- **Viem 2.7.9** - 轻量级的以太坊客户端
- **RainbowKit 2.0.1** - 钱包连接 UI 组件
- **TypeScript 5.3.3** - 类型安全的 JavaScript
- **Tailwind CSS** - 实用优先的 CSS 框架

## 📦 安装依赖

```bash
npm install
# 或者
yarn install
# 或者
pnpm install
```

## 🚀 启动项目

```bash
npm run dev
# 或者
yarn dev
# 或者
pnpm dev
```

项目将在 [http://localhost:3000](http://localhost:3000) 启动。

## 🔧 项目结构

```
wagmi-front2/
├── app/                    # Next.js 13+ App Router
│   ├── config/            # Wagmi 配置
│   ├── globals.css        # 全局样式
│   ├── layout.tsx         # 根布局
│   ├── page.tsx           # 主页面
│   └── providers.tsx      # Wagmi 提供者
├── package.json           # 项目依赖
├── tsconfig.json          # TypeScript 配置
├── tailwind.config.js     # Tailwind CSS 配置
└── README.md              # 项目说明
```

## 🎯 主要功能

### 1. 钱包连接
- 点击连接按钮可以连接 MetaMask 等钱包
- 支持多种钱包连接方式
- 显示连接状态和钱包地址

### 2. 钱包断开
- 点击断开连接按钮可以断开钱包
- 清除连接状态和相关信息

### 3. 区块浏览器
- 连接钱包后可以查看区块浏览器信息
- 支持多链网络的区块浏览器

## 🔗 网络支持

- Ethereum Mainnet
- Sepolia Testnet
- Polygon
- Optimism
- Arbitrum
- Base
- Zora

## 📱 响应式设计

项目使用 Tailwind CSS 构建，支持各种设备尺寸：
- 桌面端
- 平板端
- 移动端

## 🚨 注意事项

1. 确保浏览器已安装 MetaMask 等钱包插件
2. 首次连接需要用户授权
3. 建议在测试网络上进行测试

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License
