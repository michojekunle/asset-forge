// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./RWAToken.sol";

/**
 * @title BondToken
 * @dev Token representing fixed-income debt instruments
 * @notice Extends RWAToken with bond-specific features like maturity and coupon payments
 */
contract BondToken is RWAToken {
    // Bond parameters
    uint256 public faceValue; // Face value per token in USD cents
    uint256 public interestRateBps; // Annual interest rate in basis points (e.g., 500 = 5%)
    uint256 public maturityDate; // Unix timestamp of maturity
    uint256 public issueDate; // Unix timestamp of issuance

    // Coupon tracking
    uint256 public couponFrequency; // Number of coupon payments per year (e.g., 2 = semi-annual)
    uint256 public lastCouponDate;
    uint256 public totalCouponsPaid;

    // Bond state
    bool public isMatured;
    bool public isPrincipalRepaid;

    // Events
    event CouponPaid(uint256 amount, uint256 paymentDate, uint256 couponNumber);
    event BondMatured(uint256 maturityDate);
    event PrincipalRepaid(uint256 amount, uint256 repaymentDate);

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    /**
     * @dev Initializer for BondToken
     * @param name_ Token name
     * @param symbol_ Token symbol
     * @param decimals_ Token decimals
     * @param initialSupply_ Number of bond tokens to issue
     * @param owner_ Contract owner address
     * @param faceValue_ Face value per token in USD cents
     * @param interestRateBps_ Annual interest rate in basis points
     * @param maturityDate_ Unix timestamp when bond matures
     * @param couponFrequency_ Number of coupon payments per year
     */
    function initialize(
        string memory name_,
        string memory symbol_,
        uint8 decimals_,
        uint256 initialSupply_,
        address owner_,
        uint256 faceValue_,
        uint256 interestRateBps_,
        uint256 maturityDate_,
        uint256 couponFrequency_
    ) public initializer {
        // Initialize parent contract
        RWAToken.initialize(
            name_,
            symbol_,
            decimals_,
            initialSupply_,
            owner_,
            "bond",
            "Fixed-income bond token with scheduled coupon payments"
        );

        require(
            maturityDate_ > block.timestamp,
            "BondToken: maturity must be in future"
        );
        require(
            couponFrequency_ > 0 && couponFrequency_ <= 12,
            "BondToken: invalid coupon frequency"
        );

        faceValue = faceValue_;
        interestRateBps = interestRateBps_;
        maturityDate = maturityDate_;
        issueDate = block.timestamp;
        couponFrequency = couponFrequency_;
        lastCouponDate = block.timestamp;
    }

    /**
     * @dev Check if bond has matured and update state
     */
    function checkMaturity() public {
        if (!isMatured && block.timestamp >= maturityDate) {
            isMatured = true;
            emit BondMatured(maturityDate);
        }
    }

    /**
     * @dev Calculate coupon payment amount per token
     * @return Coupon amount in the same units as faceValue
     */
    function couponAmountPerToken() public view returns (uint256) {
        // Annual coupon = faceValue * interestRate / 10000
        // Per payment = annual / frequency
        return (faceValue * interestRateBps) / (10000 * couponFrequency);
    }

    /**
     * @dev Calculate total coupon payment for all outstanding tokens
     * @return Total coupon payment amount
     */
    function totalCouponPayment() public view returns (uint256) {
        return (couponAmountPerToken() * totalSupply()) / (10 ** decimals());
    }

    /**
     * @dev Calculate time until next coupon payment
     * @return Seconds until next coupon, 0 if due
     */
    function timeUntilNextCoupon() public view returns (uint256) {
        uint256 couponInterval = 365 days / couponFrequency;
        uint256 nextCouponDate = lastCouponDate + couponInterval;

        if (block.timestamp >= nextCouponDate) return 0;
        return nextCouponDate - block.timestamp;
    }

    /**
     * @dev Calculate yield to maturity (simplified)
     * @return Approximate yield in basis points
     */
    function yieldToMaturity() public view returns (uint256) {
        if (isMatured) return 0;

        uint256 remainingTime = maturityDate - block.timestamp;
        uint256 remainingYears = remainingTime / 365 days;
        if (remainingYears == 0) remainingYears = 1;

        // Simplified YTM calculation
        return interestRateBps;
    }

    /**
     * @dev Get bond information
     * @return faceValue_ Face value per token
     * @return interestRateBps_ Interest rate in basis points
     * @return maturityDate_ Maturity date timestamp
     * @return issueDate_ Issue date timestamp
     * @return couponFrequency_ Coupon payments per year
     * @return isMatured_ Whether bond has matured
     * @return couponAmountPerToken_ Coupon amount per token
     */
    function getBondInfo()
        public
        view
        returns (
            uint256 faceValue_,
            uint256 interestRateBps_,
            uint256 maturityDate_,
            uint256 issueDate_,
            uint256 couponFrequency_,
            bool isMatured_,
            uint256 couponAmountPerToken_
        )
    {
        return (
            faceValue,
            interestRateBps,
            maturityDate,
            issueDate,
            couponFrequency,
            isMatured,
            couponAmountPerToken()
        );
    }
}
