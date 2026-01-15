import { ethers } from "hardhat";

async function main() {
  const factoryAddress = "0x159C8d08C2aF10eB79a355Fd74b8170caABFDa30";
  console.log(
    `Verifying AssetFactory at ${factoryAddress} on Mantle Sepolia...`
  );

  // 1. Check if it has code
  const code = await ethers.provider.getCode(factoryAddress);
  if (code === "0x") {
    console.error(
      "❌ No code found at this address! The contract is not deployed here."
    );
    return;
  }
  console.log("✅ Contract code found.");

  // 2. Attach and query implementations
  const AssetFactory = await ethers.getContractFactory("AssetFactory");
  const factory = AssetFactory.attach(factoryAddress);

  try {
    const rwaImpl = await factory.rwaTokenImplementation();
    console.log(`RWAToken Implementation: ${rwaImpl}`);
    if (rwaImpl === "0x0000000000000000000000000000000000000000")
      console.error("❌ Invalid RWAToken implementation (0x0)");
    else console.log("✅ RWAToken implementation set");

    const reImpl = await factory.realEstateTokenImplementation();
    console.log(`RealEstateToken Implementation: ${reImpl}`);
    if (reImpl === "0x0000000000000000000000000000000000000000")
      console.error("❌ Invalid RealEstateToken implementation (0x0)");
    else console.log("✅ RealEstateToken implementation set");

    const bondImpl = await factory.bondTokenImplementation();
    console.log(`BondToken Implementation: ${bondImpl}`);
    if (bondImpl === "0x0000000000000000000000000000000000000000")
      console.error("❌ Invalid BondToken implementation (0x0)");
    else console.log("✅ BondToken implementation set");

    const invoiceImpl = await factory.invoiceTokenImplementation();
    console.log(`InvoiceToken Implementation: ${invoiceImpl}`);
    if (invoiceImpl === "0x0000000000000000000000000000000000000000")
      console.error("❌ Invalid InvoiceToken implementation (0x0)");
    else console.log("✅ InvoiceToken implementation set");
  } catch (error) {
    console.error(
      "❌ Failed to read from contract. Is it really the AssetFactory?"
    );
    console.error(error);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
