# Asset Forge - RWA Creator Studio 🏗️

[![Built for Mantle](https://img.shields.io/badge/Built%20for-Mantle-blue)](https://www.mantle.xyz)
[![Hackathon](https://img.shields.io/badge/Hackathon-Mantle%20Global%202025-purple)](https://www.hackquest.io/hackathons/Mantle-Global-Hackathon-2025)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

> The no-code platform for creating, deploying, and sharing tokenized real-world assets on Mantle.

## 🎯 Problem

Creating tokenized real-world assets (RWAs) requires deep blockchain expertise, expensive legal work, and complex smart contract development. This limits RWA adoption to technical teams with significant resources.

## 💡 Solution

**Asset Forge** is a low-code/no-code dashboard that enables anyone to tokenize real-world assets on Mantle in minutes:

- 🧙 **Asset Creation Wizard** - Intuitive 5-step form to configure your token
- 📋 **Pre-built Templates** - Audited contracts for Real Estate, Bonds, and Invoices
- 🚀 **One-Click Deployment** - Deploy to Mantle with a single transaction
- 🌐 **Community Showcase** - Discover and share assets with the community
- 📊 **Dashboard** - Manage all your deployed assets in one place

## ✨ Features

| Feature | Description |
|---------|-------------|
| **No-Code Creation** | Create RWA tokens without writing a single line of code |
| **Smart Contract Templates** | Pre-audited templates for common asset types |
| **Mantle Integration** | Optimized for Mantle's low fees and high throughput |
| **Compliance Settings** | Built-in KYC, accreditation, and jurisdiction controls |
| **Social Sharing** | Share your assets on Twitter, Discord, and more |

## 🛠️ Tech Stack

**Frontend:**
- Next.js 16 + TypeScript
- Tailwind CSS (custom design system)
- wagmi v3 + viem (Web3 integration)
- Framer Motion (animations)

**Smart Contracts:**
- Solidity 0.8.20
- OpenZeppelin Contracts v5
- Hardhat

**Network:**
- Mantle Sepolia (Testnet)

## 📁 Project Structure

```
asset-forge/
├── frontend/                # Next.js application
│   ├── src/
│   │   ├── app/             # App router pages
│   │   ├── components/      # React components
│   │   ├── config/          # wagmi and network config
│   │   ├── contracts/       # Contract ABIs
│   │   ├── hooks/           # Custom React hooks
│   │   ├── lib/             # Utility functions
│   │   └── types/           # TypeScript types
│   └── package.json
├── contracts/               # Hardhat project
│   ├── src/                 # Solidity contracts
│   │   ├── RWAToken.sol     # Base RWA template
│   │   ├── RealEstateToken.sol
│   │   ├── BondToken.sol
│   │   ├── InvoiceToken.sol
│   │   └── AssetFactory.sol # Factory for deployment
│   ├── test/                # Contract tests
│   ├── scripts/             # Deployment scripts
│   └── package.json
├── docs/                    # Documentation
├── package.json             # Root workspace config
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Node.js v18+
- MetaMask or compatible wallet
- Mantle Sepolia testnet MNT ([Get from faucet](https://faucet.testnet.mantle.xyz))

### Installation

```bash
# Clone the repository
git clone https://github.com/michojekunle/asset-forge.git
cd asset-forge

# Install all dependencies
npm run install:all

# Or install separately
cd contracts && npm install
cd ../frontend && npm install
```

### Run Frontend

```bash
cd frontend
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Smart Contract Development

```bash
cd contracts

# Compile contracts
npm run compile

# Run tests
npm run test

# Deploy to Mantle Sepolia
npm run deploy:sepolia
```

## 📋 Smart Contract Templates

### RWAToken (Base)
Standard ERC20 with:
- Mint/burn functionality
- Pause capability
- Compliance metadata
- Yield distribution hooks

### RealEstateToken
Extends RWAToken with:
- Property address and type
- Appraisal value tracking
- Per-token value calculation

### BondToken
Fixed-income instrument with:
- Maturity date
- Interest rate (basis points)
- Coupon payment tracking
- Yield-to-maturity calculation

### InvoiceToken
Receivables financing with:
- Invoice details
- Due date
- Discount rate for early payment
- Status tracking (Active/Paid/Defaulted)

## 🔧 Environment Variables

### Frontend (.env.local in `/frontend`)

```env
# WalletConnect Project ID
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
```

### Contracts (.env in `/contracts`)

```env
PRIVATE_KEY=your_private_key
MANTLESCAN_API_KEY=your_api_key
```

## 📖 Documentation

- [Setup Guide](docs/SETUP.md) - Detailed installation instructions
- [User Guide](docs/USER_GUIDE.md) - How to use the platform
- [Research](docs/RESEARCH.md) - RWA standards and design decisions

## 🧪 Testing

```bash
cd contracts
npm run test
```

All contracts have comprehensive test coverage including:
- Deployment tests
- Functionality tests
- Edge case handling
- Event emission verification

## 🌐 Deployed Contracts (Mantle Sepolia)

| Contract | Address |
|----------|---------|
| AssetFactory | `TBD - Run npm run deploy:sepolia` |

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

**Built with ❤️ for the Mantle Global Hackathon 2025**
