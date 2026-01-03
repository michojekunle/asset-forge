// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./RWAToken.sol";
import "./RealEstateToken.sol";
import "./BondToken.sol";
import "./InvoiceToken.sol";

/**
 * @title AssetFactory
 * @dev Factory contract for deploying RWA tokens on Mantle
 * @notice Central registry for all deployed assets
 */
contract AssetFactory {
    // Deployed asset tracking
    address[] public deployedAssets;
    mapping(address => address[]) public assetsByCreator;
    mapping(address => string) public assetTypes;

    // Factory stats
    uint256 public totalAssetsDeployed;

    // Events
    event AssetDeployed(
        address indexed assetAddress,
        address indexed creator,
        string assetType,
        string name,
        string symbol,
        uint256 timestamp
    );

    /**
     * @dev Deploy a basic RWA token
     * @param name Token name
     * @param symbol Token symbol
     * @param decimals Token decimals
     * @param initialSupply Initial supply
     * @param assetType Type of asset
     * @param description Asset description
     * @return Address of deployed token
     */
    function deployRWAToken(
        string memory name,
        string memory symbol,
        uint8 decimals,
        uint256 initialSupply,
        string memory assetType,
        string memory description
    ) external returns (address) {
        RWAToken token = new RWAToken(
            name,
            symbol,
            decimals,
            initialSupply,
            msg.sender,
            assetType,
            description
        );

        address tokenAddress = address(token);
        _registerAsset(tokenAddress, msg.sender, "custom", name, symbol);

        return tokenAddress;
    }

    /**
     * @dev Deploy a real estate token
     * @param name Token name
     * @param symbol Token symbol
     * @param decimals Token decimals
     * @param initialSupply Initial supply
     * @param propertyAddress Physical property address
     * @param propertyType Type of property
     * @param appraisalValue Appraised value in USD cents
     * @return Address of deployed token
     */
    function deployRealEstateToken(
        string memory name,
        string memory symbol,
        uint8 decimals,
        uint256 initialSupply,
        string memory propertyAddress,
        string memory propertyType,
        uint256 appraisalValue
    ) external returns (address) {
        RealEstateToken token = new RealEstateToken(
            name,
            symbol,
            decimals,
            initialSupply,
            msg.sender,
            propertyAddress,
            propertyType,
            appraisalValue
        );

        address tokenAddress = address(token);
        _registerAsset(tokenAddress, msg.sender, "real_estate", name, symbol);

        return tokenAddress;
    }

    /**
     * @dev Deploy a bond token
     * @param name Token name
     * @param symbol Token symbol
     * @param decimals Token decimals
     * @param initialSupply Initial supply
     * @param faceValue Face value per token
     * @param interestRateBps Annual interest rate in basis points
     * @param maturityDate Unix timestamp of maturity
     * @param couponFrequency Number of coupon payments per year
     * @return Address of deployed token
     */
    function deployBondToken(
        string memory name,
        string memory symbol,
        uint8 decimals,
        uint256 initialSupply,
        uint256 faceValue,
        uint256 interestRateBps,
        uint256 maturityDate,
        uint256 couponFrequency
    ) external returns (address) {
        BondToken token = new BondToken(
            name,
            symbol,
            decimals,
            initialSupply,
            msg.sender,
            faceValue,
            interestRateBps,
            maturityDate,
            couponFrequency
        );

        address tokenAddress = address(token);
        _registerAsset(tokenAddress, msg.sender, "bond", name, symbol);

        return tokenAddress;
    }

    /**
     * @dev Deploy an invoice token
     * @param name Token name
     * @param symbol Token symbol
     * @param decimals Token decimals
     * @param initialSupply Initial supply
     * @param invoiceNumber Invoice identifier
     * @param debtor Debtor name/ID
     * @param invoiceAmount Invoice amount in USD cents
     * @param dueDate Due date timestamp
     * @param discountRateBps Discount rate in basis points
     * @return Address of deployed token
     */
    function deployInvoiceToken(
        string memory name,
        string memory symbol,
        uint8 decimals,
        uint256 initialSupply,
        string memory invoiceNumber,
        string memory debtor,
        uint256 invoiceAmount,
        uint256 dueDate,
        uint256 discountRateBps
    ) external returns (address) {
        InvoiceToken token = new InvoiceToken(
            name,
            symbol,
            decimals,
            initialSupply,
            msg.sender,
            invoiceNumber,
            debtor,
            invoiceAmount,
            dueDate,
            discountRateBps
        );

        address tokenAddress = address(token);
        _registerAsset(tokenAddress, msg.sender, "invoice", name, symbol);

        return tokenAddress;
    }

    /**
     * @dev Internal function to register deployed assets
     */
    function _registerAsset(
        address assetAddress,
        address creator,
        string memory assetType,
        string memory name,
        string memory symbol
    ) internal {
        deployedAssets.push(assetAddress);
        assetsByCreator[creator].push(assetAddress);
        assetTypes[assetAddress] = assetType;
        totalAssetsDeployed++;

        emit AssetDeployed(
            assetAddress,
            creator,
            assetType,
            name,
            symbol,
            block.timestamp
        );
    }

    /**
     * @dev Get all deployed assets
     * @return Array of asset addresses
     */
    function getAllAssets() external view returns (address[] memory) {
        return deployedAssets;
    }

    /**
     * @dev Get assets by creator
     * @param creator Creator address
     * @return Array of asset addresses
     */
    function getAssetsByCreator(
        address creator
    ) external view returns (address[] memory) {
        return assetsByCreator[creator];
    }

    /**
     * @dev Get asset type
     * @param asset Asset address
     * @return Asset type string
     */
    function getAssetType(address asset) external view returns (string memory) {
        return assetTypes[asset];
    }

    /**
     * @dev Get total number of assets deployed
     * @return Count of deployed assets
     */
    function getAssetCount() external view returns (uint256) {
        return totalAssetsDeployed;
    }
}
