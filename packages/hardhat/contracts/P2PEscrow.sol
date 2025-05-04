// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract P2PEscrow is ReentrancyGuard, Ownable {
    // Structs
    struct Trade {
        address seller;
        address buyer;
        address token;
        uint256 amount;
        uint256 price;
        string paymentMethod;
        string paymentDetails;
        uint256 createdAt;
        TradeStatus status;
        bool isMinPay;
    }

    enum TradeStatus {
        ACTIVE,
        LOCKED,
        COMPLETED,
        CANCELLED,
        DISPUTED
    }

    // State variables
    mapping(uint256 => Trade) public trades;
    mapping(address => bool) public supportedTokens;
    mapping(string => bool) public supportedPaymentMethods;
    uint256 public tradeCount;
    uint256 public escrowFee = 1; // 0.1% fee (in basis points)
    uint256 public constant MAX_FEE = 100; // Max 10% fee
    uint256 public constant DISPUTE_PERIOD = 24 hours;
    
    // Events
    event TradeCreated(uint256 indexed tradeId, address indexed seller, uint256 amount, string paymentMethod);
    event TradeLocked(uint256 indexed tradeId, address indexed buyer);
    event TradeCompleted(uint256 indexed tradeId);
    event TradeCancelled(uint256 indexed tradeId);
    event TradeDisputed(uint256 indexed tradeId, address disputeInitiator);
    event TokenAdded(address indexed token);
    event TokenRemoved(address indexed token);
    event PaymentMethodAdded(string paymentMethod);
    event PaymentMethodRemoved(string paymentMethod);
    event FeeUpdated(uint256 newFee);

    constructor() {
        // Add default supported payment methods
        supportedPaymentMethods["MinPay"] = true;
        supportedPaymentMethods["Bank Transfer"] = true;
        supportedPaymentMethods["Mobile Money"] = true;
    }

    // Modifiers
    modifier validTrade(uint256 _tradeId) {
        require(_tradeId < tradeCount, "Invalid trade ID");
        _;
    }

    modifier onlyTradeParticipant(uint256 _tradeId) {
        require(
            msg.sender == trades[_tradeId].seller || 
            msg.sender == trades[_tradeId].buyer,
            "Not trade participant"
        );
        _;
    }

    // Core functions
    function createTrade(
        address _token,
        uint256 _amount,
        uint256 _price,
        string memory _paymentMethod,
        string memory _paymentDetails,
        bool _isMinPay
    ) external nonReentrant returns (uint256) {
        require(supportedTokens[_token], "Token not supported");
        require(supportedPaymentMethods[_paymentMethod], "Payment method not supported");
        require(_amount > 0, "Amount must be greater than 0");
        
        IERC20 token = IERC20(_token);
        require(
            token.transferFrom(msg.sender, address(this), _amount),
            "Token transfer failed"
        );

        uint256 tradeId = tradeCount++;
        trades[tradeId] = Trade({
            seller: msg.sender,
            buyer: address(0),
            token: _token,
            amount: _amount,
            price: _price,
            paymentMethod: _paymentMethod,
            paymentDetails: _paymentDetails,
            createdAt: block.timestamp,
            status: TradeStatus.ACTIVE,
            isMinPay: _isMinPay
        });

        emit TradeCreated(tradeId, msg.sender, _amount, _paymentMethod);
        return tradeId;
    }

    function lockTrade(uint256 _tradeId) external validTrade(_tradeId) nonReentrant {
        Trade storage trade = trades[_tradeId];
        require(trade.status == TradeStatus.ACTIVE, "Trade not active");
        require(trade.seller != msg.sender, "Seller cannot be buyer");
        
        trade.buyer = msg.sender;
        trade.status = TradeStatus.LOCKED;
        
        emit TradeLocked(_tradeId, msg.sender);
    }

    function completeTrade(uint256 _tradeId) external validTrade(_tradeId) nonReentrant {
        Trade storage trade = trades[_tradeId];
        require(trade.status == TradeStatus.LOCKED, "Trade not locked");
        require(trade.seller == msg.sender, "Only seller can complete trade");
        
        uint256 feeAmount = (trade.amount * escrowFee) / 1000;
        uint256 transferAmount = trade.amount - feeAmount;
        
        IERC20 token = IERC20(trade.token);
        require(token.transfer(trade.buyer, transferAmount), "Transfer to buyer failed");
        if (feeAmount > 0) {
            require(token.transfer(owner(), feeAmount), "Fee transfer failed");
        }
        
        trade.status = TradeStatus.COMPLETED;
        emit TradeCompleted(_tradeId);
    }

    function cancelTrade(uint256 _tradeId) external validTrade(_tradeId) nonReentrant {
        Trade storage trade = trades[_tradeId];
        require(
            trade.status == TradeStatus.ACTIVE || 
            (trade.status == TradeStatus.LOCKED && block.timestamp >= trade.createdAt + DISPUTE_PERIOD),
            "Cannot cancel trade"
        );
        require(trade.seller == msg.sender, "Only seller can cancel");
        
        IERC20 token = IERC20(trade.token);
        require(token.transfer(trade.seller, trade.amount), "Token return failed");
        
        trade.status = TradeStatus.CANCELLED;
        emit TradeCancelled(_tradeId);
    }

    function disputeTrade(uint256 _tradeId) external validTrade(_tradeId) onlyTradeParticipant(_tradeId) {
        Trade storage trade = trades[_tradeId];
        require(trade.status == TradeStatus.LOCKED, "Can only dispute locked trades");
        
        trade.status = TradeStatus.DISPUTED;
        emit TradeDisputed(_tradeId, msg.sender);
    }

    // Admin functions
    function addSupportedToken(address _token) external onlyOwner {
        require(_token != address(0), "Invalid token address");
        supportedTokens[_token] = true;
        emit TokenAdded(_token);
    }

    function removeSupportedToken(address _token) external onlyOwner {
        supportedTokens[_token] = false;
        emit TokenRemoved(_token);
    }

    function addPaymentMethod(string memory _method) external onlyOwner {
        supportedPaymentMethods[_method] = true;
        emit PaymentMethodAdded(_method);
    }

    function removePaymentMethod(string memory _method) external onlyOwner {
        supportedPaymentMethods[_method] = false;
        emit PaymentMethodRemoved(_method);
    }

    function updateEscrowFee(uint256 _newFee) external onlyOwner {
        require(_newFee <= MAX_FEE, "Fee too high");
        escrowFee = _newFee;
        emit FeeUpdated(_newFee);
    }

    // View functions
    function getTrade(uint256 _tradeId) external view returns (Trade memory) {
        require(_tradeId < tradeCount, "Invalid trade ID");
        return trades[_tradeId];
    }

    function isTokenSupported(address _token) external view returns (bool) {
        return supportedTokens[_token];
    }

    function isPaymentMethodSupported(string memory _method) external view returns (bool) {
        return supportedPaymentMethods[_method];
    }
} 