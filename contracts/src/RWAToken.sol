// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20BurnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

/**
 * @title RWAToken
 * @dev Base ERC20 token template for Real-World Assets on Mantle
 * @notice This contract provides a foundation for tokenizing real-world assets
 * with compliance features, yield distribution, and admin controls.
 */
contract RWAToken is
    Initializable,
    ERC20Upgradeable,
    ERC20BurnableUpgradeable,
    ERC20PausableUpgradeable,
    OwnableUpgradeable
{
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

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    /**
     * @dev Initializer for RWAToken
     * @param name_ Token name
     * @param symbol_ Token symbol
     * @param decimals_ Token decimals (usually 18)
     * @param initialSupply_ Initial token supply (in smallest units)
     * @param owner_ Address that will own the contract
     * @param assetType_ Type of real-world asset (e.g., "real_estate", "bond", "invoice")
     * @param description_ Brief description of the asset
     */
    function initialize(
        string memory name_,
        string memory symbol_,
        uint8 decimals_,
        uint256 initialSupply_,
        address owner_,
        string memory assetType_,
        string memory description_
    ) public initializer {
        __RWAToken_init(
            name_,
            symbol_,
            decimals_,
            initialSupply_,
            owner_,
            assetType_,
            description_
        );
    }

    function __RWAToken_init(
        string memory name_,
        string memory symbol_,
        uint8 decimals_,
        uint256 initialSupply_,
        address owner_,
        string memory assetType_,
        string memory description_
    ) internal onlyInitializing {
        __ERC20_init(name_, symbol_);
        __ERC20Burnable_init();
        __ERC20Pausable_init();
        __Ownable_init(owner_);

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

    // Whitelist for KYC
    mapping(address => bool) public isWhitelisted;

    event WhitelistUpdated(address indexed account, bool status);

    /**
     * @dev Update whitelist status for an address (only owner)
     * @param account Address to update
     * @param status True if whitelisted, false otherwise
     */
    function updateWhitelist(address account, bool status) public onlyOwner {
        isWhitelisted[account] = status;
        emit WhitelistUpdated(account, status);
    }

    /**
     * @dev Bulk update whitelist (only owner)
     */
    function bulkUpdateWhitelist(
        address[] memory accounts,
        bool status
    ) public onlyOwner {
        for (uint256 i = 0; i < accounts.length; i++) {
            isWhitelisted[accounts[i]] = status;
            emit WhitelistUpdated(accounts[i], status);
        }
    }

    // Required overrides for ERC20Pausable with Compliance Logic
    function _update(
        address from,
        address to,
        uint256 value
    ) internal virtual override(ERC20Upgradeable, ERC20PausableUpgradeable) {
        // Enforce KYC Compliance
        if (kycRequired) {
            // Allow minting (from 0x0) and burning (to 0x0) regardless, or check whitelist for holder
            if (from != address(0) && to != address(0)) {
                require(
                    isWhitelisted[from],
                    "RWAToken: sender not whitelisted"
                );
                require(
                    isWhitelisted[to],
                    "RWAToken: recipient not whitelisted"
                );
            } else if (to != address(0)) {
                // Minting: Recipient must be whitelisted
                require(
                    isWhitelisted[to],
                    "RWAToken: recipient not whitelisted"
                );
            }
            // Burning usually allowed even if not whitelisted (exit right), but strict KYC might block it.
            // We'll allow burning for now.
        }

        super._update(from, to, value);
    }

    // Receive ETH for yield distribution
    receive() external payable {}
}
