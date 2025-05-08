export class Quote {
  constructor(customerName, customerAdress, quoteDate, expirationDate, status = 'Pending') {
    this.customerName = customerName;
    this.customerAdress = customerAdress;
    this.quoteDate = quoteDate;
    this.expirationDate = expirationDate;
    this.items = [];
    this.discount = 0; //default
    this.taxRate = 0.21; //default (21%)
    this.status = status; //default is pending
  }

  addItem(description, unitPrice, quantity) {
    const item = {
      description,
      unitPrice,
      quantity,
      total: unitPrice * quantity
    };
    this.items.push(item);
  }

  setDiscount(percentage) {
    this.discount = percentage;
  }

  setStatus(status) {
    this.status = status;
  }

  getStatus() {
    return this.status;
  }

  getSubtotal() {
    return this.items.reduce((total, item) => total + item.total, 0);
  }

  getDiscountAmount() {
    return (this.getSubtotal() * this.discount) / 100;
  }

  getSubtotalAfterDiscount() {
    return this.getSubtotal() - this.getDiscountAmount();
  }

  getTax() {
    return this.getSubtotalAfterDiscount() * this.taxRate;
  }

  getTotal() {
    return this.getSubtotalAfterDiscount() + this.getTax();
  }

  displayDetailedQuote() {
    let quoteDetails = `Quote for: ${this.customerName}\n`;
    quoteDetails += `Address: ${this.customerAddress}\n`;
    quoteDetails += `Quote Date: ${this.quoteDate}\n`;
    quoteDetails += `Expiration Date: ${this.expirationDate}\n`;
    quoteDetails += `Status: ${this.status}\n\n`;

    quoteDetails += `Items:\n`;

    this.items.forEach((item, index) => {
      quoteDetails += `${index + 1}. ${item.description} - ${item.quantity} x $${item.unitPrice.toFixed(2)} = $${item.total.toFixed(2)}\n`;
    });

    if (this.discount > 0) {
      quoteDetails += `\nDiscount: ${this.discount}% - $${this.getDiscountAmount().toFixed(2)}`;
    }

    quoteDetails += `\nSubtotal: $${this.getSubtotal().toFixed(2)}`;
    quoteDetails += `\nSubtotal after discount: $${this.getSubtotalAfterDiscount().toFixed(2)}`;
    quoteDetails += `\nTax (21%): $${this.getTax().toFixed(2)}`;
    quoteDetails += `\nTotal: $${this.getTotal().toFixed(2)}`;

    return quoteDetails;
  }
  displayDate() {
    let quoteDate;
    quoteDate += `Quote Date: ${this.quoteDate}\n`;
    quoteDate += `Expiration Date: ${this.expirationDate}\n`;
  }

  displaySummaryQuote() {
    let summary = `Quote for: ${this.customerName}\n`;
    summary += `Status: ${this.status}\n`;
    summary += `Total: $${this.getTotal().toFixed(2)}`;

    return summary;
  }
}