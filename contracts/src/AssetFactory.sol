// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/proxy/Clones.sol";
import "./RWAToken.sol";
import "./RealEstateToken.sol";
import "./BondToken.sol";
import "./InvoiceToken.sol";

/**
 * @title AssetFactory
 * @dev Factory contract for deploying RWA tokens on Mantle using Minimal Proxies (Clones)
 * @notice Central registry for all deployed assets. Uses EIP-1167 to reduce gas costs.
 */
contract AssetFactory {
    // Immutable implementation addresses
    address public immutable rwaTokenImplementation;
    address public immutable realEstateTokenImplementation;
    address public immutable bondTokenImplementation;
    address public immutable invoiceTokenImplementation;

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
     * @dev Constructor accepts pre-deployed implementation addresses
     * @param _rwaTokenImpl Address of deployed RWAToken implementation
     * @param _realEstateTokenImpl Address of deployed RealEstateToken implementation
     * @param _bondTokenImpl Address of deployed BondToken implementation
     * @param _invoiceTokenImpl Address of deployed InvoiceToken implementation
     */
    constructor(
        address _rwaTokenImpl,
        address _realEstateTokenImpl,
        address _bondTokenImpl,
        address _invoiceTokenImpl
    ) {
        require(_rwaTokenImpl != address(0), "Invalid RWAToken impl");
        require(
            _realEstateTokenImpl != address(0),
            "Invalid RealEstateToken impl"
        );
        require(_bondTokenImpl != address(0), "Invalid BondToken impl");
        require(_invoiceTokenImpl != address(0), "Invalid InvoiceToken impl");

        rwaTokenImplementation = _rwaTokenImpl;
        realEstateTokenImplementation = _realEstateTokenImpl;
        bondTokenImplementation = _bondTokenImpl;
        invoiceTokenImplementation = _invoiceTokenImpl;
    }

    /**
     * @dev Deploy a basic RWA token clone
     */
    function deployRWAToken(
        string memory name,
        string memory symbol,
        uint8 decimals,
        uint256 initialSupply,
        string memory assetType,
        string memory description
    ) external returns (address) {
        address clone = Clones.clone(rwaTokenImplementation);
        RWAToken(payable(clone)).initialize(
            name,
            symbol,
            decimals,
            initialSupply,
            msg.sender,
            assetType,
            description
        );

        _registerAsset(clone, msg.sender, "custom", name, symbol);
        return clone;
    }

    /**
     * @dev Deploy a real estate token clone
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
        address clone = Clones.clone(realEstateTokenImplementation);
        RealEstateToken(payable(clone)).initialize(
            name,
            symbol,
            decimals,
            initialSupply,
            msg.sender,
            propertyAddress,
            propertyType,
            appraisalValue
        );

        _registerAsset(clone, msg.sender, "real_estate", name, symbol);
        return clone;
    }

    /**
     * @dev Deploy a bond token clone
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
        address clone = Clones.clone(bondTokenImplementation);
        BondToken(payable(clone)).initialize(
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

        _registerAsset(clone, msg.sender, "bond", name, symbol);
        return clone;
    }

    /**
     * @dev Deploy an invoice token clone
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
        address clone = Clones.clone(invoiceTokenImplementation);
        InvoiceToken(payable(clone)).initialize(
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

        _registerAsset(clone, msg.sender, "invoice", name, symbol);
        return clone;
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
     */
    function getAllAssets() external view returns (address[] memory) {
        return deployedAssets;
    }

    /**
     * @dev Get assets by creator
     */
    function getAssetsByCreator(
        address creator
    ) external view returns (address[] memory) {
        return assetsByCreator[creator];
    }

    /**
     * @dev Get asset type
     */
    function getAssetType(address asset) external view returns (string memory) {
        return assetTypes[asset];
    }

    /**
     * @dev Get total number of assets deployed
     */
    function getAssetCount() external view returns (uint256) {
        return totalAssetsDeployed;
    }
}
