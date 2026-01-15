import { expect } from "chai";
import { ethers } from "hardhat";
import { AssetFactory } from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

describe("AssetFactory", function () {
  let factory: AssetFactory;
  let owner: HardhatEthersSigner;
  let addr1: HardhatEthersSigner;

  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();

    // Deploy implementations
    const RWATokenFactory = await ethers.getContractFactory("RWAToken");
    const rwaImpl = await RWATokenFactory.deploy();
    await rwaImpl.waitForDeployment();

    const RealEstateTokenFactory = await ethers.getContractFactory(
      "RealEstateToken"
    );
    const reImpl = await RealEstateTokenFactory.deploy();
    await reImpl.waitForDeployment();

    const BondTokenFactory = await ethers.getContractFactory("BondToken");
    const bondImpl = await BondTokenFactory.deploy();
    await bondImpl.waitForDeployment();

    const InvoiceTokenFactory = await ethers.getContractFactory("InvoiceToken");
    const invoiceImpl = await InvoiceTokenFactory.deploy();
    await invoiceImpl.waitForDeployment();

    // Deploy Factory
    const AssetFactoryFactory = await ethers.getContractFactory("AssetFactory");
    factory = await AssetFactoryFactory.deploy(
      await rwaImpl.getAddress(),
      await reImpl.getAddress(),
      await bondImpl.getAddress(),
      await invoiceImpl.getAddress()
    );
    await factory.waitForDeployment();
  });

  describe("Asset Deployment", function () {
    it("Should deploy and register a generic RWA Token", async function () {
      const tx = await factory.deployRWAToken(
        "Generic Asset",
        "GEN",
        18,
        ethers.parseEther("1000"),
        "art",
        "A piece of art"
      );

      const receipt = await tx.wait();
      expect(await factory.getAssetCount()).to.equal(1);

      const allAssets = await factory.getAllAssets();
      expect(allAssets.length).to.equal(1);

      const userAssets = await factory.getAssetsByCreator(owner.address);
      expect(userAssets.length).to.equal(1);
      expect(userAssets[0]).to.equal(allAssets[0]);
    });

    it("Should deploy Real Estate Token", async function () {
      await factory.deployRealEstateToken(
        "Villa",
        "VIL",
        18,
        ethers.parseEther("1000"),
        "Miami",
        "Res",
        1000000
      );

      expect(await factory.getAssetCount()).to.equal(1);
      const assets = await factory.getAllAssets();
      expect(await factory.getAssetType(assets[0])).to.equal("real_estate");
    });

    it("Should deploy Bond Token", async function () {
      const maturity = Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60;
      await factory.deployBondToken(
        "Bond",
        "BND",
        18,
        ethers.parseEther("1000"),
        1000,
        500,
        maturity,
        2
      );

      expect(await factory.getAssetCount()).to.equal(1);
      const assets = await factory.getAllAssets();
      expect(await factory.getAssetType(assets[0])).to.equal("bond");
    });

    it("Should deploy Invoice Token", async function () {
      const due = Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60;
      await factory.deployInvoiceToken(
        "Invoice",
        "INV",
        18,
        ethers.parseEther("1000"),
        "INV-001",
        "Debtor Inc",
        10000,
        due,
        200
      );

      expect(await factory.getAssetCount()).to.equal(1);
      const assets = await factory.getAllAssets();
      expect(await factory.getAssetType(assets[0])).to.equal("invoice");
    });
  });
});
