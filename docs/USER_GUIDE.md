# User Guide

Learn how to use Asset Forge to create and deploy tokenized real-world assets.

## Getting Started

### Step 1: Connect Your Wallet

1. Click "Connect Wallet" in the top right corner
2. Select MetaMask (or your preferred wallet)
3. Approve the connection request
4. Ensure you're on Mantle Sepolia network

> **Note:** You'll need testnet MNT for gas fees. Get some from the [Mantle Faucet](https://www.mantle.xyz/faucet).

### Step 2: Navigate to Create Asset

Click "Create Asset" in the navigation or the "Start Creating" button on the homepage.

## Creating Your First Asset

The Asset Creation Wizard guides you through 5 simple steps:

### Step 1: Choose Asset Type

Select the type of real-world asset you're tokenizing:

| Type | Best For |
|------|----------|
| **Real Estate** | Property ownership, REITs |
| **Bond** | Fixed-income debt instruments |
| **Invoice** | Receivables financing, factoring |
| **Custom** | Any other asset type |

### Step 2: Fill Asset Details

**Required Fields:**
- **Token Name:** Full name (e.g., "Manhattan Tower Token")
- **Token Symbol:** 3-5 character ticker (e.g., "MTT")
- **Description:** Explain your asset to potential investors

**Asset-Specific Fields:**
- Real Estate: Property address, type, appraisal value
- Bond: Face value, interest rate, maturity date
- Invoice: Invoice number, amount, due date, debtor

### Step 3: Configure Tokenomics

Set your token's economic parameters:

- **Total Supply:** Maximum tokens that will exist
- **Decimals:** Precision (18 is standard)
- **Mintable:** Allow creating new tokens later
- **Burnable:** Allow destroying tokens
- **Pausable:** Emergency pause transfers

### Step 4: Set Compliance

Configure regulatory requirements:

- **KYC Required:** Token holders must verify identity
- **Accredited Only:** Restrict to accredited investors
- **Transfer Restrictions:** Limit who can receive tokens
- **Jurisdictions:** Select allowed regions

### Step 5: Review & Deploy

1. Review all your settings
2. Ensure your wallet is connected
3. Click "Deploy to Testnet"
4. Confirm the transaction in your wallet
5. Wait for confirmation

**Success!** Your asset is now live on Mantle.

## Managing Your Assets

### Dashboard

Navigate to "Dashboard" to see all your deployed assets.

**Available Actions:**
- View asset details
- Share on social media
- View on block explorer

### Asset Details

Click any asset card to see:

- Contract address
- Token metadata
- Compliance settings
- Transaction history

## Community Showcase

### Discover Assets

Browse the "Showcase" to explore assets created by others:

- Filter by asset type
- Sort by newest, popular, or featured
- Search by name or symbol

### Share Your Assets

Share your assets to build reputation:

1. Click the share icon on any asset card
2. Choose Twitter, Discord, or copy link
3. Add the #MantleHackathon hashtag

## FAQ

**Q: Do I need real money to create assets?**
A: No, on testnet you use free testnet MNT. Mainnet requires real MNT.

**Q: Can I edit my asset after deployment?**
A: Most settings are immutable, but you can update metadata and compliance settings.

**Q: Who owns the deployed tokens?**
A: You (the deployer) receive all initial tokens and own the contract.

**Q: Is my asset a real security?**
A: This is a demo platform. Real securities require legal compliance.

## Troubleshooting

**Transaction stuck pending:**
- Try increasing gas price
- Check network status on Mantle

**Asset not appearing in dashboard:**
- Wait a few blocks for indexing
- Refresh the page
- Check transaction succeeded on explorer

**Wallet not connecting:**
- Ensure MetaMask is unlocked
- Check you're on Mantle Sepolia
- Try disconnecting and reconnecting
