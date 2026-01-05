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

    // Rental yield tracking
    uint256 public totalYieldDistributed;
    uint256 public lastYieldDistributionDate;

    // Events
    event PropertyUpdated(
        string propertyAddress,
        string propertyType,
        uint256 appraisalValue
    );
    event AppraisalUpdated(uint256 newValue, uint256 timestamp);
    event RentalYieldDistributed(uint256 amount, uint256 perTokenAmount);

    /**
     * @dev Constructor for RealEstateToken
     * @param name_ Token name
     * @param symbol_ Token symbol
     * @param decimals_ Token decimals
     * @param initialSupply_ Initial token supply
     * @param owner_ Contract owner address
     * @param propertyAddress_ Physical address of the property
     * @param propertyType_ Type of property
     * @param appraisalValue_ Appraised value in USD cents
     */
    constructor(
        string memory name_,
        string memory symbol_,
        uint8 decimals_,
        uint256 initialSupply_,
        address owner_,
        string memory propertyAddress_,
        string memory propertyType_,
        uint256 appraisalValue_
    )
        RWAToken(
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
        )
    {
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
}
