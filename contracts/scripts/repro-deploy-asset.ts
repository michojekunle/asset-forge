import { ethers } from "hardhat";

async function main() {
  const factoryAddress = "0x159C8d08C2aF10eB79a355Fd74b8170caABFDa30";
  console.log(`Connecting to AssetFactory at ${factoryAddress}...`);

  const AssetFactory = await ethers.getContractFactory("AssetFactory");
  const factory = AssetFactory.attach(factoryAddress);

  // Demo Data for Real Estate
  const name = "Manhattan Skyline Penthouse";
  const symbol = "MSP-24";
  const decimals = 18;
  const initialSupply = ethers.parseEther("12500");
  const propertyAddress = "101 Murray Street, Penthouse B, New York, NY 10007";
  const propertyType = "Residential Luxury";
  const appraisalValue = 1250000000; // $12.5M in cents

  console.log("Attempting to deploy RealEstateToken...");

  try {
    const tx = await factory.deployRealEstateToken(
      name,
      symbol,
      decimals,
      initialSupply,
      propertyAddress,
      propertyType,
      appraisalValue
    );
    console.log("Transaction sent:", tx.hash);

    console.log("Waiting for confirmation...");
    const receipt = await tx.wait();
    console.log("Transaction confirmed!");
    console.log("Status:", receipt?.status);

    if (receipt?.status === 1) {
      console.log("✅ Success! The contract logic works.");
    } else {
      console.error("❌ Transaction failed/reverted on chain.");
    }
  } catch (error) {
    console.error("❌ Error sending transaction:");
    console.error(error);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
