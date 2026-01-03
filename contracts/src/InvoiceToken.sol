// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./RWAToken.sol";

/**
 * @title InvoiceToken
 * @dev Token representing tradeable invoice receivables
 * @notice Enables invoice factoring and receivables financing on-chain
 */
contract InvoiceToken is RWAToken {
    // Invoice details
    string public invoiceNumber;
    string public debtor; // Name or identifier of the debtor
    uint256 public invoiceAmount; // Original invoice amount in USD cents
    uint256 public dueDate; // Unix timestamp when invoice is due

    // Financing parameters
    uint256 public discountRateBps; // Discount rate for early payment in basis points
    uint256 public financedAmount; // Amount received from financing

    // Invoice state
    enum InvoiceStatus {
        Active,
        Paid,
        Defaulted,
        Cancelled
    }
    InvoiceStatus public status;

    // Payment tracking
    uint256 public amountPaid;
    uint256 public paymentDate;

    // Events
    event InvoiceFinanced(
        uint256 amount,
        uint256 discountApplied,
        uint256 timestamp
    );
    event InvoicePaid(uint256 amount, uint256 timestamp);
    event InvoiceDefaulted(uint256 dueDate, uint256 timestamp);
    event StatusUpdated(InvoiceStatus oldStatus, InvoiceStatus newStatus);

    /**
     * @dev Constructor for InvoiceToken
     * @param name_ Token name
     * @param symbol_ Token symbol
     * @param decimals_ Token decimals
     * @param initialSupply_ Number of tokens representing the invoice
     * @param owner_ Contract owner address
     * @param invoiceNumber_ Unique invoice identifier
     * @param debtor_ Name or ID of the debtor
     * @param invoiceAmount_ Total invoice amount in USD cents
     * @param dueDate_ Unix timestamp when payment is due
     * @param discountRateBps_ Discount rate for early payment
     */
    constructor(
        string memory name_,
        string memory symbol_,
        uint8 decimals_,
        uint256 initialSupply_,
        address owner_,
        string memory invoiceNumber_,
        string memory debtor_,
        uint256 invoiceAmount_,
        uint256 dueDate_,
        uint256 discountRateBps_
    )
        RWAToken(
            name_,
            symbol_,
            decimals_,
            initialSupply_,
            owner_,
            "invoice",
            string(abi.encodePacked("Invoice token for ", invoiceNumber_))
        )
    {
        require(
            dueDate_ > block.timestamp,
            "InvoiceToken: due date must be in future"
        );

        invoiceNumber = invoiceNumber_;
        debtor = debtor_;
        invoiceAmount = invoiceAmount_;
        dueDate = dueDate_;
        discountRateBps = discountRateBps_;
        status = InvoiceStatus.Active;
    }

    /**
     * @dev Calculate discounted value for early payment
     * @return Discounted amount in USD cents
     */
    function discountedValue() public view returns (uint256) {
        if (block.timestamp >= dueDate) return invoiceAmount;

        uint256 daysRemaining = (dueDate - block.timestamp) / 1 days;
        uint256 discount = (invoiceAmount * discountRateBps * daysRemaining) /
            (10000 * 365);

        return invoiceAmount - discount;
    }

    /**
     * @dev Calculate value per token
     * @return Value per token based on discounted invoice value
     */
    function valuePerToken() public view returns (uint256) {
        if (totalSupply() == 0) return 0;
        return (discountedValue() * (10 ** decimals())) / totalSupply();
    }

    /**
     * @dev Check if invoice is overdue
     * @return True if past due date and not paid
     */
    function isOverdue() public view returns (bool) {
        return block.timestamp > dueDate && status == InvoiceStatus.Active;
    }

    /**
     * @dev Mark invoice as paid (only owner)
     * @param amount_ Amount paid
     */
    function markAsPaid(uint256 amount_) public onlyOwner {
        require(
            status == InvoiceStatus.Active,
            "InvoiceToken: invoice not active"
        );

        InvoiceStatus oldStatus = status;
        status = InvoiceStatus.Paid;
        amountPaid = amount_;
        paymentDate = block.timestamp;

        emit StatusUpdated(oldStatus, status);
        emit InvoicePaid(amount_, block.timestamp);
    }

    /**
     * @dev Mark invoice as defaulted (only owner)
     */
    function markAsDefaulted() public onlyOwner {
        require(
            status == InvoiceStatus.Active,
            "InvoiceToken: invoice not active"
        );
        require(block.timestamp > dueDate, "InvoiceToken: not yet overdue");

        InvoiceStatus oldStatus = status;
        status = InvoiceStatus.Defaulted;

        emit StatusUpdated(oldStatus, status);
        emit InvoiceDefaulted(dueDate, block.timestamp);
    }

    /**
     * @dev Get invoice information
     * @return Full invoice details
     */
    function getInvoiceInfo()
        public
        view
        returns (
            string memory invoiceNumber_,
            string memory debtor_,
            uint256 invoiceAmount_,
            uint256 dueDate_,
            uint256 discountedValue_,
            InvoiceStatus status_,
            bool isOverdue_
        )
    {
        return (
            invoiceNumber,
            debtor,
            invoiceAmount,
            dueDate,
            discountedValue(),
            status,
            isOverdue()
        );
    }
}
