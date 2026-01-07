import { expect } from "chai";
import { ethers } from "hardhat";
import { BondToken } from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

describe("BondToken", function () {
  let bondToken: BondToken;
  let owner: HardhatEthersSigner;

  const TOKEN_NAME = "Corp Bond 2030";
  const TOKEN_SYMBOL = "CB30";
  const DECIMALS = 18;
  const INITIAL_SUPPLY = ethers.parseEther("1000");
  const FACE_VALUE = 100000; // $1,000 in cents
  const INTEREST_RATE = 500; // 5%
  const COUPON_FREQUENCY = 2; // Semi-annual
  
  // Future date: +1 year
  const MATURITY_DATE = Math.floor(Date.now() / 1000) + 31536000; 

  beforeEach(async function () {
    [owner] = await ethers.getSigners();
    const BondTokenFactory = await ethers.getContractFactory("BondToken");
    
    bondToken = await BondTokenFactory.deploy();
    await bondToken.waitForDeployment();
    await bondToken.initialize(
      TOKEN_NAME,
      TOKEN_SYMBOL,
      DECIMALS,
      INITIAL_SUPPLY,
      owner.address,
      FACE_VALUE,
      INTEREST_RATE,
      MATURITY_DATE,
      COUPON_FREQUENCY
    );
  });

  describe("Initialization", function () {
    it("Should set correct bond parameters", async function () {
      const info = await bondToken.getBondInfo();
      expect(info.faceValue_).to.equal(FACE_VALUE);
      expect(info.interestRateBps_).to.equal(INTEREST_RATE);
      expect(info.maturityDate_).to.equal(MATURITY_DATE);
      expect(info.couponFrequency_).to.equal(COUPON_FREQUENCY);
    });

    it("Should calculate coupon amount correctly", async function () {
      // Annual Coupon = Face Value * Rate = 100,000 * 5% = 5,000
      // Per Payment = Annual / Freq = 5,000 / 2 = 2,500
      const couponAmount = await bondToken.couponAmountPerToken();
      expect(couponAmount).to.equal(2500); 
    });
  });

  describe("Maturity", function () {
    it("Should correctly identify active status", async function () {
      const info = await bondToken.getBondInfo();
      expect(info.isMatured_).to.equal(false);
    });

    // Note: We'd need time travel to test maturity transition properly in integration tests
    // or mock the timestamp, but using Hardhat network helper is best practice here
  });
});
