// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title RWAToken
 * @dev Base ERC20 token template for Real-World Assets on Mantle
 * @notice This contract provides a foundation for tokenizing real-world assets
 * with compliance features, yield distribution, and admin controls.
 */
contract RWAToken is ERC20, ERC20Burnable, ERC20Pausable, Ownable {
    // Asset metadata
    string public assetType;
    string public assetDescription;
    string public legalDocumentUri;

    // Compliance settings
    bool public kycRequired;
    bool public accreditedOnly;
    bool public transferRestrictions;

    // Decimals override
    uint8 private _decimals;

    // Events
    event AssetMetadataUpdated(string assetType, string description);
    event ComplianceUpdated(
        bool kycRequired,
        bool accreditedOnly,
        bool transferRestrictions
    );
    event YieldDistributed(uint256 amount, uint256 timestamp);

    /**
     * @dev Constructor for RWAToken
     * @param name_ Token name
     * @param symbol_ Token symbol
     * @param decimals_ Token decimals (usually 18)
     * @param initialSupply_ Initial token supply (in smallest units)
     * @param owner_ Address that will own the contract
     * @param assetType_ Type of real-world asset (e.g., "real_estate", "bond", "invoice")
     * @param description_ Brief description of the asset
     */
    constructor(
        string memory name_,
        string memory symbol_,
        uint8 decimals_,
        uint256 initialSupply_,
        address owner_,
        string memory assetType_,
        string memory description_
    ) ERC20(name_, symbol_) Ownable(owner_) {
        _decimals = decimals_;
        assetType = assetType_;
        assetDescription = description_;

        // Mint initial supply to owner
        if (initialSupply_ > 0) {
            _mint(owner_, initialSupply_);
        }
    }

    /**
     * @dev Override decimals to use custom value
     */
    function decimals() public view virtual override returns (uint8) {
        return _decimals;
    }

    /**
     * @dev Mint new tokens (only owner)
     * @param to Address to mint tokens to
     * @param amount Amount to mint
     */
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    /**
     * @dev Pause all token transfers (only owner)
     */
    function pause() public onlyOwner {
        _pause();
    }

    /**
     * @dev Unpause token transfers (only owner)
     */
    function unpause() public onlyOwner {
        _unpause();
    }

    /**
     * @dev Update asset metadata (only owner)
     * @param assetType_ New asset type
     * @param description_ New description
     */
    function updateAssetMetadata(
        string memory assetType_,
        string memory description_
    ) public onlyOwner {
        assetType = assetType_;
        assetDescription = description_;
        emit AssetMetadataUpdated(assetType_, description_);
    }

    /**
     * @dev Update legal document URI (only owner)
     * @param uri_ URI to legal documents
     */
    function setLegalDocumentUri(string memory uri_) public onlyOwner {
        legalDocumentUri = uri_;
    }

    /**
     * @dev Update compliance settings (only owner)
     * @param kycRequired_ Whether KYC is required
     * @param accreditedOnly_ Whether only accredited investors can hold
     * @param transferRestrictions_ Whether transfer restrictions apply
     */
    function updateCompliance(
        bool kycRequired_,
        bool accreditedOnly_,
        bool transferRestrictions_
    ) public onlyOwner {
        kycRequired = kycRequired_;
        accreditedOnly = accreditedOnly_;
        transferRestrictions = transferRestrictions_;
        emit ComplianceUpdated(
            kycRequired_,
            accreditedOnly_,
            transferRestrictions_
        );
    }

    /**
     * @dev Distribute yield to all token holders proportionally
     * @notice This is a simplified implementation. In production, consider using
     * a snapshot mechanism or off-chain distribution.
     */
    function distributeYield() public payable onlyOwner {
        require(msg.value > 0, "RWAToken: no yield to distribute");
        emit YieldDistributed(msg.value, block.timestamp);
        // Note: Actual distribution logic would be more complex
        // This serves as an event marker for off-chain processing
    }

    /**
     * @dev Withdraw accumulated ETH (only owner)
     */
    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "RWAToken: no balance to withdraw");
        payable(owner()).transfer(balance);
    }

    /**
     * @dev Get comprehensive token info
     * @return name_ Token name
     * @return symbol_ Token symbol
     * @return decimals_ Token decimals
     * @return totalSupply_ Total supply
     * @return assetType_ Asset type
     * @return kycRequired_ KYC required flag
     * @return accreditedOnly_ Accredited only flag
     */
    function getTokenInfo()
        public
        view
        returns (
            string memory name_,
            string memory symbol_,
            uint8 decimals_,
            uint256 totalSupply_,
            string memory assetType_,
            bool kycRequired_,
            bool accreditedOnly_
        )
    {
        return (
            name(),
            symbol(),
            decimals(),
            totalSupply(),
            assetType,
            kycRequired,
            accreditedOnly
        );
    }

    // Required overrides for ERC20Pausable
    function _update(
        address from,
        address to,
        uint256 value
    ) internal virtual override(ERC20, ERC20Pausable) {
        super._update(from, to, value);
    }

    // Receive ETH for yield distribution
    receive() external payable {}
}
