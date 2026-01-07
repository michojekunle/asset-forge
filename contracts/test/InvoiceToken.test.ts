import { expect } from "chai";
import { ethers } from "hardhat";
import { InvoiceToken } from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

describe("InvoiceToken", function () {
  let invoiceToken: InvoiceToken;
  let owner: HardhatEthersSigner;

  const TOKEN_NAME = "Invoice #8821";
  const TOKEN_SYMBOL = "INV8821";
  const DECIMALS = 18;
  const INITIAL_SUPPLY = ethers.parseEther("1000");
  const INVOICE_NUMBER = "INV-2024-001";
  const DEBTOR = "Acme Corp";
  const INVOICE_AMOUNT = 5000000; // $50,000 in cents
  const DISCOUNT_RATE = 200; // 2%
  
  // Due date: +30 days
  const DUE_DATE = Math.floor(Date.now() / 1000) + 2592000; 

  beforeEach(async function () {
    [owner] = await ethers.getSigners();
    const InvoiceTokenFactory = await ethers.getContractFactory("InvoiceToken");
    
    invoiceToken = await InvoiceTokenFactory.deploy();
    await invoiceToken.waitForDeployment();
    await invoiceToken.initialize(
      TOKEN_NAME,
      TOKEN_SYMBOL,
      DECIMALS,
      INITIAL_SUPPLY,
      owner.address,
      INVOICE_NUMBER,
      DEBTOR,
      INVOICE_AMOUNT,
      DUE_DATE,
      DISCOUNT_RATE
    );
  });

  describe("Initialization", function () {
    it("Should set correct invoice details", async function () {
      const info = await invoiceToken.getInvoiceInfo();
      expect(info.invoiceNumber_).to.equal(INVOICE_NUMBER);
      expect(info.debtor_).to.equal(DEBTOR);
      expect(info.invoiceAmount_).to.equal(INVOICE_AMOUNT);
      expect(info.dueDate_).to.equal(DUE_DATE);
    });

    it("Should start as Active", async function () {
      const info = await invoiceToken.getInvoiceInfo();
      expect(info.status_).to.equal(0); // 0 = Active
    });
  });

  describe("Discounted Value", function () {
    it("Should calculate discounted value based on time", async function () {
      // Just check that it's less than full amount but greater than 0
      const discountedVal = await invoiceToken.discountedValue();
      expect(discountedVal).to.be.lt(INVOICE_AMOUNT);
      expect(discountedVal).to.be.gt(0);
    });
  });

  describe("Status Updates", function () {
    it("Should allow owner to mark as paid", async function () {
      await invoiceToken.markAsPaid(INVOICE_AMOUNT);
      const info = await invoiceToken.getInvoiceInfo();
      expect(info.status_).to.equal(1); // 1 = Paid
    });
  });
});
