import { expect } from "chai";
import { ethers } from "hardhat";
import { RealEstateToken } from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

describe("RealEstateToken", function () {
  let realEstateToken: RealEstateToken;
  let owner: HardhatEthersSigner;

  const TOKEN_NAME = "Luxury Villa";
  const TOKEN_SYMBOL = "VILLA";
  const DECIMALS = 18;
  const INITIAL_SUPPLY = ethers.parseEther("1000");
  const PROPERTY_ADDRESS = "123 Ocean Drive, Miami, FL";
  const PROPERTY_TYPE = "Residential";
  const APPRAISAL_VALUE = 200000000; // $2M in cents

  beforeEach(async function () {
    [owner] = await ethers.getSigners();
    const RealEstateTokenFactory = await ethers.getContractFactory("RealEstateToken");
    
    realEstateToken = await RealEstateTokenFactory.deploy();
    await realEstateToken.waitForDeployment();
    await realEstateToken.initialize(
      TOKEN_NAME,
      TOKEN_SYMBOL,
      DECIMALS,
      INITIAL_SUPPLY,
      owner.address,
      PROPERTY_ADDRESS,
      PROPERTY_TYPE,
      APPRAISAL_VALUE
    );
  });

  describe("Initialization", function () {
    it("Should set correct real estate metadata", async function () {
      const info = await realEstateToken.getPropertyInfo();
      expect(info.propertyAddress_).to.equal(PROPERTY_ADDRESS);
      expect(info.propertyType_).to.equal(PROPERTY_TYPE);
      expect(info.appraisalValue_).to.equal(APPRAISAL_VALUE);
    });

    it("Should set correct base RWA metadata", async function () {
      expect(await realEstateToken.assetType()).to.equal("real_estate");
    });
  });

  describe("Value Calculation", function () {
    it("Should calculate value per token correctly", async function () {
      // Value per token = Total Value / Total Supply = 200,000,000 / 1000 = 200,000
      const valuePerToken = await realEstateToken.valuePerToken();
      const expectedValue = BigInt(APPRAISAL_VALUE) / 1000n;
      expect(valuePerToken).to.equal(expectedValue);
    });

    it("Should update value per token when appraisal changes", async function () {
      const newAppraisal = 300000000; // $3M
      await realEstateToken.updateAppraisal(newAppraisal);
      
      const info = await realEstateToken.getPropertyInfo();
      expect(info.appraisalValue_).to.equal(newAppraisal);
      
      const expectedValue = BigInt(newAppraisal) / 1000n;
      expect(await realEstateToken.valuePerToken()).to.equal(expectedValue);
    });
  });

  describe("Property Updates", function () {
    it("Should allow owner to update property details", async function () {
      const newAddress = "456 Mountain View, Denver, CO";
      const newType = "Commercial";
      
      await realEstateToken.updatePropertyDetails(newAddress, newType);
      
      const info = await realEstateToken.getPropertyInfo();
      expect(info.propertyAddress_).to.equal(newAddress);
      expect(info.propertyType_).to.equal(newType);
    });
  });
});
