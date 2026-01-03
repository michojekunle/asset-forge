import { ethers } from "hardhat";

async function main() {
  console.log("Deploying AssetFactory to Mantle...");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "MNT");

  // Deploy AssetFactory
  const AssetFactory = await ethers.getContractFactory("AssetFactory");
  const factory = await AssetFactory.deploy();
  await factory.waitForDeployment();

  const factoryAddress = await factory.getAddress();
  console.log("AssetFactory deployed to:", factoryAddress);

  // Save deployment info
  console.log("\n--- Deployment Summary ---");
  console.log("Network:", (await ethers.provider.getNetwork()).name);
  console.log("Chain ID:", (await ethers.provider.getNetwork()).chainId);
  console.log("AssetFactory:", factoryAddress);
  console.log("Deployer:", deployer.address);
  console.log("\nUpdate your frontend config with the AssetFactory address!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
