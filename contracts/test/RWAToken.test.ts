import { expect } from "chai";
import { ethers } from "hardhat";
import { RWAToken } from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

describe("RWAToken", function () {
  let rwaToken: RWAToken;
  let owner: HardhatEthersSigner;
  let addr1: HardhatEthersSigner;
  let addr2: HardhatEthersSigner;

  const TOKEN_NAME = "Test Asset";
  const TOKEN_SYMBOL = "TA";
  const DECIMALS = 18;
  const INITIAL_SUPPLY = ethers.parseEther("1000");
  const ASSET_TYPE = "custom";
  const DESCRIPTION = "Test Asset Description";

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    const RWATokenFactory = await ethers.getContractFactory("RWAToken");
    rwaToken = await RWATokenFactory.deploy();
    await rwaToken.waitForDeployment();
    await rwaToken.initialize(
      TOKEN_NAME,
      TOKEN_SYMBOL,
      DECIMALS,
      INITIAL_SUPPLY,
      owner.address,
      ASSET_TYPE,
      DESCRIPTION
    );
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await rwaToken.owner()).to.equal(owner.address);
    });

    it("Should assign the total supply of tokens to the owner", async function () {
      const ownerBalance = await rwaToken.balanceOf(owner.address);
      expect(await rwaToken.totalSupply()).to.equal(ownerBalance);
    });

    it("Should set correct metadata", async function () {
      expect(await rwaToken.name()).to.equal(TOKEN_NAME);
      expect(await rwaToken.symbol()).to.equal(TOKEN_SYMBOL);
      expect(await rwaToken.decimals()).to.equal(DECIMALS);
      expect(await rwaToken.assetType()).to.equal(ASSET_TYPE);
      expect(await rwaToken.assetDescription()).to.equal(DESCRIPTION);
    });
  });

  describe("Transactions", function () {
    it("Should transfer tokens between accounts", async function () {
      await rwaToken.transfer(addr1.address, 50);
      const addr1Balance = await rwaToken.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(50);

      await rwaToken.connect(addr1).transfer(addr2.address, 50);
      const addr2Balance = await rwaToken.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(50);
    });

    it("Should fail if sender doesn't have enough tokens", async function () {
      const initialOwnerBalance = await rwaToken.balanceOf(owner.address);

      await expect(
        rwaToken.connect(addr1).transfer(owner.address, 1)
      ).to.be.revertedWithCustomError(rwaToken, "ERC20InsufficientBalance");

      expect(await rwaToken.balanceOf(owner.address)).to.equal(
        initialOwnerBalance
      );
    });
  });

  describe("Minting and Burning", function () {
    it("Should allow owner to mint tokens", async function () {
      const mintAmount = ethers.parseEther("100");
      await rwaToken.mint(addr1.address, mintAmount);
      expect(await rwaToken.balanceOf(addr1.address)).to.equal(mintAmount);
    });

    it("Should fail if non-owner tries to mint", async function () {
      const mintAmount = ethers.parseEther("100");
      await expect(
        rwaToken.connect(addr1).mint(addr1.address, mintAmount)
      ).to.be.revertedWithCustomError(rwaToken, "OwnableUnauthorizedAccount");
    });

    it("Should allow burning tokens", async function () {
        const burnAmount = ethers.parseEther("10");
        // Owner burns their own tokens
        await rwaToken.burn(burnAmount);
        expect(await rwaToken.balanceOf(owner.address)).to.equal(INITIAL_SUPPLY - burnAmount);
    });
  });

  describe("Pausable", function () {
    it("Should allow owner to pause and unpause", async function () {
      await rwaToken.pause();
      expect(await rwaToken.paused()).to.equal(true);

      await expect(
        rwaToken.transfer(addr1.address, 100)
      ).to.be.revertedWithCustomError(rwaToken, "EnforcedPause");

      await rwaToken.unpause();
      expect(await rwaToken.paused()).to.equal(false);
      
      await rwaToken.transfer(addr1.address, 100);
      expect(await rwaToken.balanceOf(addr1.address)).to.equal(100);
    });

    it("Should fail if non-owner tries to pause", async function () {
      await expect(
        rwaToken.connect(addr1).pause()
      ).to.be.revertedWithCustomError(rwaToken, "OwnableUnauthorizedAccount");
    });
  });

  describe("Compliance Settings", function () {
      it("Should allow owner to update compliance requirements", async function () {
          await rwaToken.updateCompliance(true, true, true);
          
          const info = await rwaToken.getTokenInfo();
          expect(info.kycRequired_).to.equal(true);
          expect(info.accreditedOnly_).to.equal(true);
      });

      it("Should allow owner to set legal document URI", async function () {
          const uri = "https://example.com/legal.pdf";
          await rwaToken.setLegalDocumentUri(uri);
          expect(await rwaToken.legalDocumentUri()).to.equal(uri);
      });
  });
});
