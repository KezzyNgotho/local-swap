import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { P2PEscrow, P2PEscrow__factory, IERC20 } from "../typechain-types";

describe("P2PEscrow", function () {
  let p2pEscrow: P2PEscrow;
  let owner: SignerWithAddress;
  let seller: SignerWithAddress;
  let buyer: SignerWithAddress;
  let mockToken: IERC20;

  const MOCK_PAYMENT_METHOD = "MinPay";
  const MOCK_PAYMENT_DETAILS = "Phone: +1234567890";
  const TRADE_AMOUNT = ethers.utils.parseEther("100");
  const TRADE_PRICE = ethers.utils.parseEther("100");

  beforeEach(async function () {
    [owner, seller, buyer] = await ethers.getSigners();

    // Deploy mock token
    const MockToken = await ethers.getContractFactory("MockERC20");
    mockToken = await MockToken.deploy("Mock Token", "MTK");
    await mockToken.deployed();

    // Deploy P2PEscrow
    const P2PEscrowFactory = await ethers.getContractFactory("P2PEscrow");
    p2pEscrow = await P2PEscrowFactory.deploy();
    await p2pEscrow.deployed();

    // Add token support
    await p2pEscrow.addSupportedToken(mockToken.address);

    // Mint and approve tokens for seller
    await mockToken.mint(seller.address, TRADE_AMOUNT);
    await mockToken.connect(seller).approve(p2pEscrow.address, TRADE_AMOUNT);
  });

  describe("Trade Creation", function () {
    it("Should create a trade successfully", async function () {
      const tx = await p2pEscrow.connect(seller).createTrade(
        mockToken.address,
        TRADE_AMOUNT,
        TRADE_PRICE,
        MOCK_PAYMENT_METHOD,
        MOCK_PAYMENT_DETAILS,
        true
      );

      const receipt = await tx.wait();
      const event = receipt.events?.find(e => e.event === "TradeCreated");
      expect(event).to.not.be.undefined;

      const tradeId = event?.args?.tradeId;
      const trade = await p2pEscrow.getTrade(tradeId);

      expect(trade.seller).to.equal(seller.address);
      expect(trade.amount).to.equal(TRADE_AMOUNT);
      expect(trade.paymentMethod).to.equal(MOCK_PAYMENT_METHOD);
      expect(trade.status).to.equal(0); // ACTIVE
    });

    it("Should fail if token is not supported", async function () {
      await expect(
        p2pEscrow.connect(seller).createTrade(
          ethers.constants.AddressZero,
          TRADE_AMOUNT,
          TRADE_PRICE,
          MOCK_PAYMENT_METHOD,
          MOCK_PAYMENT_DETAILS,
          true
        )
      ).to.be.revertedWith("Token not supported");
    });
  });

  describe("Trade Lifecycle", function () {
    let tradeId: number;

    beforeEach(async function () {
      const tx = await p2pEscrow.connect(seller).createTrade(
        mockToken.address,
        TRADE_AMOUNT,
        TRADE_PRICE,
        MOCK_PAYMENT_METHOD,
        MOCK_PAYMENT_DETAILS,
        true
      );
      const receipt = await tx.wait();
      tradeId = receipt.events?.find(e => e.event === "TradeCreated")?.args?.tradeId;
    });

    it("Should lock trade successfully", async function () {
      await expect(p2pEscrow.connect(buyer).lockTrade(tradeId))
        .to.emit(p2pEscrow, "TradeLocked")
        .withArgs(tradeId, buyer.address);

      const trade = await p2pEscrow.getTrade(tradeId);
      expect(trade.status).to.equal(1); // LOCKED
      expect(trade.buyer).to.equal(buyer.address);
    });

    it("Should complete trade successfully", async function () {
      await p2pEscrow.connect(buyer).lockTrade(tradeId);
      await expect(p2pEscrow.connect(seller).completeTrade(tradeId))
        .to.emit(p2pEscrow, "TradeCompleted")
        .withArgs(tradeId);

      const trade = await p2pEscrow.getTrade(tradeId);
      expect(trade.status).to.equal(2); // COMPLETED
    });

    it("Should cancel trade successfully", async function () {
      await expect(p2pEscrow.connect(seller).cancelTrade(tradeId))
        .to.emit(p2pEscrow, "TradeCancelled")
        .withArgs(tradeId);

      const trade = await p2pEscrow.getTrade(tradeId);
      expect(trade.status).to.equal(3); // CANCELLED
    });

    it("Should dispute trade successfully", async function () {
      await p2pEscrow.connect(buyer).lockTrade(tradeId);
      await expect(p2pEscrow.connect(buyer).disputeTrade(tradeId))
        .to.emit(p2pEscrow, "TradeDisputed")
        .withArgs(tradeId, buyer.address);

      const trade = await p2pEscrow.getTrade(tradeId);
      expect(trade.status).to.equal(4); // DISPUTED
    });
  });

  describe("Admin Functions", function () {
    it("Should add and remove supported tokens", async function () {
      const newToken = ethers.constants.AddressZero;
      
      await expect(p2pEscrow.addSupportedToken(newToken))
        .to.emit(p2pEscrow, "TokenAdded")
        .withArgs(newToken);

      expect(await p2pEscrow.isTokenSupported(newToken)).to.be.true;

      await expect(p2pEscrow.removeSupportedToken(newToken))
        .to.emit(p2pEscrow, "TokenRemoved")
        .withArgs(newToken);

      expect(await p2pEscrow.isTokenSupported(newToken)).to.be.false;
    });

    it("Should update escrow fee", async function () {
      const newFee = 5; // 0.5%
      await expect(p2pEscrow.updateEscrowFee(newFee))
        .to.emit(p2pEscrow, "FeeUpdated")
        .withArgs(newFee);

      expect(await p2pEscrow.escrowFee()).to.equal(newFee);
    });
  });
}); 