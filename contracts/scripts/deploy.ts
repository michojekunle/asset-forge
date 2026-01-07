import { ethers } from "hardhat";

async function main() {
  console.log("Deploying Asset Forge contracts to Mantle...\n");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "MNT\n");

  // Step 1: Deploy RWAToken implementation
  console.log("1/5 Deploying RWAToken implementation...");
  const RWAToken = await ethers.getContractFactory("RWAToken");
  const rwaToken = await RWAToken.deploy();
  await rwaToken.waitForDeployment();
  const rwaTokenAddress = await rwaToken.getAddress();
  console.log("    RWAToken deployed to:", rwaTokenAddress);

  // Step 2: Deploy RealEstateToken implementation
  console.log("2/5 Deploying RealEstateToken implementation...");
  const RealEstateToken = await ethers.getContractFactory("RealEstateToken");
  const realEstateToken = await RealEstateToken.deploy();
  await realEstateToken.waitForDeployment();
  const realEstateTokenAddress = await realEstateToken.getAddress();
  console.log("    RealEstateToken deployed to:", realEstateTokenAddress);

  // Step 3: Deploy BondToken implementation
  console.log("3/5 Deploying BondToken implementation...");
  const BondToken = await ethers.getContractFactory("BondToken");
  const bondToken = await BondToken.deploy();
  await bondToken.waitForDeployment();
  const bondTokenAddress = await bondToken.getAddress();
  console.log("    BondToken deployed to:", bondTokenAddress);

  // Step 4: Deploy InvoiceToken implementation
  console.log("4/5 Deploying InvoiceToken implementation...");
  const InvoiceToken = await ethers.getContractFactory("InvoiceToken");
  const invoiceToken = await InvoiceToken.deploy();
  await invoiceToken.waitForDeployment();
  const invoiceTokenAddress = await invoiceToken.getAddress();
  console.log("    InvoiceToken deployed to:", invoiceTokenAddress);

  // Step 5: Deploy AssetFactory with implementation addresses
  console.log("5/5 Deploying AssetFactory...");
  const AssetFactory = await ethers.getContractFactory("AssetFactory");
  const factory = await AssetFactory.deploy(
    rwaTokenAddress,
    realEstateTokenAddress,
    bondTokenAddress,
    invoiceTokenAddress
  );
  await factory.waitForDeployment();
  const factoryAddress = await factory.getAddress();
  console.log("    AssetFactory deployed to:", factoryAddress);

  // Get network info
  const network = await ethers.provider.getNetwork();

  // Save deployment info
  console.log("\n" + "=".repeat(50));
  console.log("           DEPLOYMENT SUMMARY");
  console.log("=".repeat(50));
  console.log("Network:", network.name);
  console.log("Chain ID:", network.chainId.toString());
  console.log("");
  console.log("Implementation Contracts:");
  console.log("  RWAToken:        ", rwaTokenAddress);
  console.log("  RealEstateToken: ", realEstateTokenAddress);
  console.log("  BondToken:       ", bondTokenAddress);
  console.log("  InvoiceToken:    ", invoiceTokenAddress);
  console.log("");
  console.log("Factory Contract:");
  console.log("  AssetFactory:    ", factoryAddress);
  console.log("");
  console.log("Deployer:", deployer.address);
  console.log("=".repeat(50));
  console.log("\n✅ Update your frontend config with the AssetFactory address!");
  console.log(`   NEXT_PUBLIC_ASSET_FACTORY_ADDRESS=${factoryAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
