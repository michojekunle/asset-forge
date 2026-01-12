# Setup Guide

This guide will walk you through setting up Asset Forge for development.

## Prerequisites

- **Node.js** v18.0 or higher
- **npm** v9.0 or higher
- **Git**
- **MetaMask** browser extension (or compatible wallet)

## Step 1: Clone the Repository

```bash
git clone https://github.com/michojekunle/asset-forge.git
cd asset-forge
```

## Step 2: Install Frontend Dependencies

```bash
npm install
```

## Step 3: Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
# WalletConnect Project ID (get one at https://cloud.walletconnect.com)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id

# Optional: Contract addresses (update after deployment)
NEXT_PUBLIC_ASSET_FACTORY_ADDRESS=0x...
```

## Step 4: Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Step 5: Configure MetaMask for Mantle

Add Mantle Sepolia network to MetaMask:

| Setting | Value |
|---------|-------|
| Network Name | Mantle Sepolia |
| RPC URL | https://rpc.sepolia.mantle.xyz |
| Chain ID | 5003 |
| Currency Symbol | MNT |
| Block Explorer | https://sepolia.mantlescan.xyz |

## Step 6: Get Testnet Funds

1. Go to [Mantle Faucet](https://www.mantle.xyz/faucet)
2. Connect your wallet
3. Request testnet MNT

## Smart Contract Setup

### Install Dependencies

```bash
cd contracts
npm install
```

### Compile Contracts

```bash
npm run compile
```

### Run Tests

```bash
npm run test
```

### Deploy to Mantle Sepolia

1. Create `.env` file in `/contracts`:

```env
PRIVATE_KEY=your_private_key_without_0x_prefix
MANTLESCAN_API_KEY=your_api_key
```

2. Deploy:

```bash
npm run deploy:sepolia
```

3. Update the contract address in your frontend config.

## Project Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## Troubleshooting

### MetaMask Not Connecting

- Ensure you're on Mantle Sepolia network
- Try refreshing the page
- Check if MetaMask has pending requests

### Transaction Failing

- Check if you have enough MNT for gas
- Ensure contract parameters are valid

### Build Errors

- Delete `node_modules` and `.next` folders
- Run `npm install` again

## Support

For issues, please open a GitHub issue or reach out on Discord.
