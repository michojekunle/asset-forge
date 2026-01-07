// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./RWAToken.sol";

/**
 * @title RealEstateToken
 * @dev Specialized token for real estate asset tokenization
 * @notice Extends RWAToken with property-specific features
 */
contract RealEstateToken is RWAToken {
    // Property-specific metadata
    string public propertyAddress;
    string public propertyType; // residential, commercial, industrial, etc.
    uint256 public appraisalValue; // in USD cents (e.g., 100000000 = $1,000,000.00)
    uint256 public lastAppraisalDate;

    // Dividend Tracking (Scalable Pull-based)
    uint256 public accRewardPerShare;
    mapping(address => uint256) public rewardDebt; // Reward debt (amount already accounted for)
    mapping(address => uint256) public pendingRewards; // Unclaimed rewards

    uint256 private constant MAGNITUDE = 1e18; // Precision factor

    // Events
    event PropertyUpdated(
        string propertyAddress,
        string propertyType,
        uint256 appraisalValue
    );
    event AppraisalUpdated(uint256 newValue, uint256 timestamp);
    event RentalReceived(uint256 amount);
    event GlobalYieldDistributed(uint256 amount, uint256 newAccRewardPerShare);
    event RewardClaimed(address indexed user, uint256 amount);

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    /**
     * @dev Initializer for RealEstateToken
     * @param name_ Token name
     * @param symbol_ Token symbol
     * @param decimals_ Token decimals
     * @param initialSupply_ Initial token supply
     * @param owner_ Contract owner address
     * @param propertyAddress_ Physical address of the property
     * @param propertyType_ Type of property
     * @param appraisalValue_ Appraised value in USD cents
     */
    function initialize(
        string memory name_,
        string memory symbol_,
        uint8 decimals_,
        uint256 initialSupply_,
        address owner_,
        string memory propertyAddress_,
        string memory propertyType_,
        uint256 appraisalValue_
    ) public initializer {
        // Initialize parent contract
        RWAToken.initialize(
            name_,
            symbol_,
            decimals_,
            initialSupply_,
            owner_,
            "real_estate",
            string(
                abi.encodePacked(
                    "Real estate token for property at ",
                    propertyAddress_
                )
            )
        );

        propertyAddress = propertyAddress_;
        propertyType = propertyType_;
        appraisalValue = appraisalValue_;
        lastAppraisalDate = block.timestamp;
    }

    /**
     * @dev Update property details (only owner)
     * @param propertyAddress_ New property address
     * @param propertyType_ New property type
     */
    function updatePropertyDetails(
        string memory propertyAddress_,
        string memory propertyType_
    ) public onlyOwner {
        propertyAddress = propertyAddress_;
        propertyType = propertyType_;
        emit PropertyUpdated(propertyAddress_, propertyType_, appraisalValue);
    }

    /**
     * @dev Update appraisal value (only owner)
     * @param newValue_ New appraised value in USD cents
     */
    function updateAppraisal(uint256 newValue_) public onlyOwner {
        appraisalValue = newValue_;
        lastAppraisalDate = block.timestamp;
        emit AppraisalUpdated(newValue_, block.timestamp);
    }

    /**
     * @dev Calculate per-token value based on appraisal
     * @return Value per token in USD cents
     */
    function valuePerToken() public view returns (uint256) {
        if (totalSupply() == 0) return 0;
        return (appraisalValue * (10 ** decimals())) / totalSupply();
    }

    /**
     * @dev Get property information
     * @return propertyAddress_ Property address
     * @return propertyType_ Property type
     * @return appraisalValue_ Appraisal value
     * @return lastAppraisalDate_ Last appraisal date
     * @return valuePerToken_ Value per token
     */
    function getPropertyInfo()
        public
        view
        returns (
            string memory propertyAddress_,
            string memory propertyType_,
            uint256 appraisalValue_,
            uint256 lastAppraisalDate_,
            uint256 valuePerToken_
        )
    {
        return (
            propertyAddress,
            propertyType,
            appraisalValue,
            lastAppraisalDate,
            valuePerToken()
        );
    }

    /**
     * @dev Deposit rental income (ETH/MNT) to be distributed to holders
     */
    function depositRent() external payable onlyOwner {
        require(
            totalSupply() > 0,
            "RealEstateToken: No tokens to distribute to"
        );
        require(msg.value > 0, "RealEstateToken: No rent deposited");

        // Calculate reward per share increase
        uint256 rewardAdded = (msg.value * MAGNITUDE) / totalSupply();
        accRewardPerShare += rewardAdded;

        emit RentalReceived(msg.value);
        emit GlobalYieldDistributed(msg.value, accRewardPerShare);
    }

    /**
     * @dev Claim accumulated rental yields
     */
    function claimReward() external {
        _distributePending(msg.sender);
        // Reset debt based on current balance
        rewardDebt[msg.sender] =
            (balanceOf(msg.sender) * accRewardPerShare) /
            MAGNITUDE;

        uint256 reward = pendingRewards[msg.sender];
        require(reward > 0, "RealEstateToken: no reward to claim");

        pendingRewards[msg.sender] = 0;
        payable(msg.sender).transfer(reward);

        emit RewardClaimed(msg.sender, reward);
    }

    /**
     * @dev View function to see pending rewards
     */
    function viewPendingReward(address user) external view returns (uint256) {
        uint256 pending = pendingRewards[user];
        uint256 balance = balanceOf(user);

        if (balance == 0) return pending;

        uint256 tentativePending = (balance * accRewardPerShare) /
            MAGNITUDE -
            rewardDebt[user];
        return pending + tentativePending;
    }

    /**
     * @dev Override _update to sync rewards before balance changes
     */
    function _update(
        address from,
        address to,
        uint256 value
    ) internal virtual override {
        // 1. Snapshot rewards before balance change
        if (from != address(0)) {
            _distributePending(from);
        }
        if (to != address(0)) {
            _distributePending(to);
        }

        // 2. Perform transfer
        super._update(from, to, value);

        // 3. Reset debt based on NEW balance
        if (from != address(0)) {
            rewardDebt[from] =
                (balanceOf(from) * accRewardPerShare) /
                MAGNITUDE;
        }
        if (to != address(0)) {
            rewardDebt[to] = (balanceOf(to) * accRewardPerShare) / MAGNITUDE;
        }
    }

    function _distributePending(address user) internal {
        uint256 balance = balanceOf(user);
        if (balance > 0) {
            uint256 accumulated = (balance * accRewardPerShare) / MAGNITUDE;
            uint256 pending = accumulated - rewardDebt[user];
            if (pending > 0) {
                pendingRewards[user] += pending;
            }
        }
    }
}
