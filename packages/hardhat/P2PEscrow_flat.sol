// Sources flattened with hardhat v2.23.0 https://hardhat.org

// SPDX-License-Identifier: MIT

// File @openzeppelin/contracts/utils/Context.sol@v4.9.0

// Original license: SPDX_License_Identifier: MIT
// OpenZeppelin Contracts v4.4.1 (utils/Context.sol)

pragma solidity ^0.8.0;

/**
 * @dev Provides information about the current execution context, including the
 * sender of the transaction and its data. While these are generally available
 * via msg.sender and msg.data, they should not be accessed in such a direct
 * manner, since when dealing with meta-transactions the account sending and
 * paying for execution may not be the actual sender (as far as an application
 * is concerned).
 *
 * This contract is only required for intermediate, library-like contracts.
 */
abstract contract Context {
    function _msgSender() internal view virtual returns (address) {
        return msg.sender;
    }

    function _msgData() internal view virtual returns (bytes calldata) {
        return msg.data;
    }
}


// File @openzeppelin/contracts/access/Ownable.sol@v4.9.0

// Original license: SPDX_License_Identifier: MIT
// OpenZeppelin Contracts (last updated v4.9.0) (access/Ownable.sol)

pragma solidity ^0.8.0;

/**
 * @dev Contract module which provides a basic access control mechanism, where
 * there is an account (an owner) that can be granted exclusive access to
 * specific functions.
 *
 * By default, the owner account will be the one that deploys the contract. This
 * can later be changed with {transferOwnership}.
 *
 * This module is used through inheritance. It will make available the modifier
 * `onlyOwner`, which can be applied to your functions to restrict their use to
 * the owner.
 */
abstract contract Ownable is Context {
    address private _owner;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    /**
     * @dev Initializes the contract setting the deployer as the initial owner.
     */
    constructor() {
        _transferOwnership(_msgSender());
    }

    /**
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlyOwner() {
        _checkOwner();
        _;
    }

    /**
     * @dev Returns the address of the current owner.
     */
    function owner() public view virtual returns (address) {
        return _owner;
    }

    /**
     * @dev Throws if the sender is not the owner.
     */
    function _checkOwner() internal view virtual {
        require(owner() == _msgSender(), "Ownable: caller is not the owner");
    }

    /**
     * @dev Leaves the contract without owner. It will not be possible to call
     * `onlyOwner` functions. Can only be called by the current owner.
     *
     * NOTE: Renouncing ownership will leave the contract without an owner,
     * thereby disabling any functionality that is only available to the owner.
     */
    function renounceOwnership() public virtual onlyOwner {
        _transferOwnership(address(0));
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     * Can only be called by the current owner.
     */
    function transferOwnership(address newOwner) public virtual onlyOwner {
        require(newOwner != address(0), "Ownable: new owner is the zero address");
        _transferOwnership(newOwner);
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     * Internal function without access restriction.
     */
    function _transferOwnership(address newOwner) internal virtual {
        address oldOwner = _owner;
        _owner = newOwner;
        emit OwnershipTransferred(oldOwner, newOwner);
    }
}


// File @openzeppelin/contracts/security/ReentrancyGuard.sol@v4.9.0

// Original license: SPDX_License_Identifier: MIT
// OpenZeppelin Contracts (last updated v4.9.0) (security/ReentrancyGuard.sol)

pragma solidity ^0.8.0;

/**
 * @dev Contract module that helps prevent reentrant calls to a function.
 *
 * Inheriting from `ReentrancyGuard` will make the {nonReentrant} modifier
 * available, which can be applied to functions to make sure there are no nested
 * (reentrant) calls to them.
 *
 * Note that because there is a single `nonReentrant` guard, functions marked as
 * `nonReentrant` may not call one another. This can be worked around by making
 * those functions `private`, and then adding `external` `nonReentrant` entry
 * points to them.
 *
 * TIP: If you would like to learn more about reentrancy and alternative ways
 * to protect against it, check out our blog post
 * https://blog.openzeppelin.com/reentrancy-after-istanbul/[Reentrancy After Istanbul].
 */
abstract contract ReentrancyGuard {
    // Booleans are more expensive than uint256 or any type that takes up a full
    // word because each write operation emits an extra SLOAD to first read the
    // slot's contents, replace the bits taken up by the boolean, and then write
    // back. This is the compiler's defense against contract upgrades and
    // pointer aliasing, and it cannot be disabled.

    // The values being non-zero value makes deployment a bit more expensive,
    // but in exchange the refund on every call to nonReentrant will be lower in
    // amount. Since refunds are capped to a percentage of the total
    // transaction's gas, it is best to keep them low in cases like this one, to
    // increase the likelihood of the full refund coming into effect.
    uint256 private constant _NOT_ENTERED = 1;
    uint256 private constant _ENTERED = 2;

    uint256 private _status;

    constructor() {
        _status = _NOT_ENTERED;
    }

    /**
     * @dev Prevents a contract from calling itself, directly or indirectly.
     * Calling a `nonReentrant` function from another `nonReentrant`
     * function is not supported. It is possible to prevent this from happening
     * by making the `nonReentrant` function external, and making it call a
     * `private` function that does the actual work.
     */
    modifier nonReentrant() {
        _nonReentrantBefore();
        _;
        _nonReentrantAfter();
    }

    function _nonReentrantBefore() private {
        // On the first call to nonReentrant, _status will be _NOT_ENTERED
        require(_status != _ENTERED, "ReentrancyGuard: reentrant call");

        // Any calls to nonReentrant after this point will fail
        _status = _ENTERED;
    }

    function _nonReentrantAfter() private {
        // By storing the original value once again, a refund is triggered (see
        // https://eips.ethereum.org/EIPS/eip-2200)
        _status = _NOT_ENTERED;
    }

    /**
     * @dev Returns true if the reentrancy guard is currently set to "entered", which indicates there is a
     * `nonReentrant` function in the call stack.
     */
    function _reentrancyGuardEntered() internal view returns (bool) {
        return _status == _ENTERED;
    }
}


// File @openzeppelin/contracts/token/ERC20/IERC20.sol@v4.9.0

// Original license: SPDX_License_Identifier: MIT
// OpenZeppelin Contracts (last updated v4.9.0) (token/ERC20/IERC20.sol)

pragma solidity ^0.8.0;

/**
 * @dev Interface of the ERC20 standard as defined in the EIP.
 */
interface IERC20 {
    /**
     * @dev Emitted when `value` tokens are moved from one account (`from`) to
     * another (`to`).
     *
     * Note that `value` may be zero.
     */
    event Transfer(address indexed from, address indexed to, uint256 value);

    /**
     * @dev Emitted when the allowance of a `spender` for an `owner` is set by
     * a call to {approve}. `value` is the new allowance.
     */
    event Approval(address indexed owner, address indexed spender, uint256 value);

    /**
     * @dev Returns the amount of tokens in existence.
     */
    function totalSupply() external view returns (uint256);

    /**
     * @dev Returns the amount of tokens owned by `account`.
     */
    function balanceOf(address account) external view returns (uint256);

    /**
     * @dev Moves `amount` tokens from the caller's account to `to`.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transfer(address to, uint256 amount) external returns (bool);

    /**
     * @dev Returns the remaining number of tokens that `spender` will be
     * allowed to spend on behalf of `owner` through {transferFrom}. This is
     * zero by default.
     *
     * This value changes when {approve} or {transferFrom} are called.
     */
    function allowance(address owner, address spender) external view returns (uint256);

    /**
     * @dev Sets `amount` as the allowance of `spender` over the caller's tokens.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * IMPORTANT: Beware that changing an allowance with this method brings the risk
     * that someone may use both the old and the new allowance by unfortunate
     * transaction ordering. One possible solution to mitigate this race
     * condition is to first reduce the spender's allowance to 0 and set the
     * desired value afterwards:
     * https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
     *
     * Emits an {Approval} event.
     */
    function approve(address spender, uint256 amount) external returns (bool);

    /**
     * @dev Moves `amount` tokens from `from` to `to` using the
     * allowance mechanism. `amount` is then deducted from the caller's
     * allowance.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
}


// File contracts/P2PEscrow.sol

// Original license: SPDX_License_Identifier: MIT
pragma solidity ^0.8.17;
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
