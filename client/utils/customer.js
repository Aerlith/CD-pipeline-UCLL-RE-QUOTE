import { Address } from "./address.js";
export class Customer {
  constructor(id, name, email, address) {
    this.name = name;
    this.email = email;
    this.address = address;
    this._id = null;
  }

  static createCustomer(name, email, street, streetNumber, zipCode, city) {
    const address = new Address(street, streetNumber, zipCode, city);
    return new Customer(name, email, address);
  }

  validateName() {
    return this.name && this.name.trim().length > 0;
  }

  // Validate email (using regex)
  validateEmail() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(this.email);
  }

  // Central method to validate customer data
  validate() {
    const errors = [];

    // Validate name and email
    if (!this.validateName()) errors.push("Name is required.");
    if (!this.validateEmail()) errors.push("Email is invalid.");

    // Validate address (using Address class)
    const addressErrors = this.address.validate();
    if (addressErrors.length > 0) {
      errors.push(...addressErrors); // Append address errors to customer errors
    }

    return errors;
  }
}
