// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract P2PEscrow is Ownable {
    enum TradeStatus { NONE, ACTIVE, LOCKED, COMPLETED, CANCELLED, DISPUTED }

    struct Trade {
        address seller;
        address buyer;
        address token;
        uint256 amount;
        uint256 price;
        TradeStatus status;
        uint256 createdAt;
        uint256 charityAmount;
    }

    uint256 public tradeCounter;
    mapping(uint256 => Trade) public trades;
    address public charityAddress;
    uint256 public feeBps; // fee in basis points (e.g. 50 = 0.5%)
    address public feeRecipient;

    event TradeCreated(uint256 indexed tradeId, address indexed seller, address token, uint256 amount, uint256 price);
    event TradeLocked(uint256 indexed tradeId, address indexed buyer);
    event TradeCompleted(uint256 indexed tradeId);
    event TradeCancelled(uint256 indexed tradeId);
    event TradeDisputed(uint256 indexed tradeId);
    event TradeResolved(uint256 indexed tradeId, address releasedTo);
    event FeeChanged(uint256 newFeeBps);
    event FeeRecipientChanged(address newRecipient);

    constructor(address _charityAddress) {
        charityAddress = _charityAddress;
        feeBps = 50; // default 0.5%
        feeRecipient = msg.sender;
    }

    function createTrade(address token, uint256 amount, uint256 price, uint256 charityAmount) external returns (uint256) {
        require(amount > 0, "Amount must be > 0");
        require(IERC20(token).transferFrom(msg.sender, address(this), amount), "Token transfer failed");

        tradeCounter++;
        trades[tradeCounter] = Trade({
            seller: msg.sender,
            buyer: address(0),
            token: token,
            amount: amount,
            price: price,
            status: TradeStatus.ACTIVE,
            createdAt: block.timestamp,
            charityAmount: charityAmount
        });

        emit TradeCreated(tradeCounter, msg.sender, token, amount, price);
        return tradeCounter;
    }

    function lockTrade(uint256 tradeId) external {
        Trade storage trade = trades[tradeId];
        require(trade.status == TradeStatus.ACTIVE, "Trade not active");
        trade.buyer = msg.sender;
        trade.status = TradeStatus.LOCKED;
        emit TradeLocked(tradeId, msg.sender);
    }

    function completeTrade(uint256 tradeId) external {
        Trade storage trade = trades[tradeId];
        require(trade.status == TradeStatus.LOCKED, "Trade not locked");
        require(msg.sender == trade.seller || msg.sender == owner(), "Not authorized");

        // Send charity if set
        if (trade.charityAmount > 0 && charityAddress != address(0)) {
            IERC20(trade.token).transfer(charityAddress, trade.charityAmount);
        }
        // Calculate fee
        uint256 fee = ((trade.amount - trade.charityAmount) * feeBps) / 10000;
        uint256 toBuyer = trade.amount - trade.charityAmount - fee;
        // Send fee
        if (fee > 0 && feeRecipient != address(0)) {
            IERC20(trade.token).transfer(feeRecipient, fee);
        }
        // Send remaining to buyer
        IERC20(trade.token).transfer(trade.buyer, toBuyer);
        trade.status = TradeStatus.COMPLETED;
        emit TradeCompleted(tradeId);
    }

    function cancelTrade(uint256 tradeId) external {
        Trade storage trade = trades[tradeId];
        require(trade.status == TradeStatus.ACTIVE || trade.status == TradeStatus.LOCKED, "Cannot cancel");
        require(msg.sender == trade.seller || msg.sender == owner(), "Not authorized");

        // Refund seller
        IERC20(trade.token).transfer(trade.seller, trade.amount);
        trade.status = TradeStatus.CANCELLED;
        emit TradeCancelled(tradeId);
    }

    function disputeTrade(uint256 tradeId) external {
        Trade storage trade = trades[tradeId];
        require(trade.status == TradeStatus.LOCKED, "Trade not locked");
        require(msg.sender == trade.seller || msg.sender == trade.buyer, "Not authorized");
        trade.status = TradeStatus.DISPUTED;
        emit TradeDisputed(tradeId);
    }

    // Admin can resolve a dispute: release to buyer or refund seller
    function resolveDispute(uint256 tradeId, bool releaseToBuyer) external onlyOwner {
        Trade storage trade = trades[tradeId];
        require(trade.status == TradeStatus.DISPUTED, "Not disputed");
        if (releaseToBuyer) {
            // Charity and fee logic as in completeTrade
            if (trade.charityAmount > 0 && charityAddress != address(0)) {
                IERC20(trade.token).transfer(charityAddress, trade.charityAmount);
            }
            uint256 fee = ((trade.amount - trade.charityAmount) * feeBps) / 10000;
            uint256 toBuyer = trade.amount - trade.charityAmount - fee;
            if (fee > 0 && feeRecipient != address(0)) {
                IERC20(trade.token).transfer(feeRecipient, fee);
            }
            IERC20(trade.token).transfer(trade.buyer, toBuyer);
            trade.status = TradeStatus.COMPLETED;
            emit TradeResolved(tradeId, trade.buyer);
        } else {
            // Refund seller
            IERC20(trade.token).transfer(trade.seller, trade.amount);
            trade.status = TradeStatus.CANCELLED;
            emit TradeResolved(tradeId, trade.seller);
        }
    }

    function setFee(uint256 newFeeBps) external onlyOwner {
        require(newFeeBps <= 500, "Fee too high"); // max 5%
        feeBps = newFeeBps;
        emit FeeChanged(newFeeBps);
    }

    function setFeeRecipient(address newRecipient) external onlyOwner {
        require(newRecipient != address(0), "Zero address");
        feeRecipient = newRecipient;
        emit FeeRecipientChanged(newRecipient);
    }

    // Admin can resolve disputes, update charity, etc.
    function setCharityAddress(address _charity) external onlyOwner {
        charityAddress = _charity;
    }
} 