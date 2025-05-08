export class Address {
  constructor(street, streetNumber, zipCode, city) {
    this.street = street;
    this.streetNumber = streetNumber;
    this.zipCode = zipCode;
    this.city = city;
  }

  getFormattedAddress() {
    return `${this.street} ${this.streetNumber}, ${this.zipCode} ${this.city}`;
  }

  //validation
  validateStreet() {
    return this.street && this.street.trim().length > 0;
  }

  validateStreetNumber() {
    return this.streetNumber && !isNaN(this.streetNumber);
  }

  validateZipCode() {
    const zipCodeRegex = /^\d{4}$/;
    return zipCodeRegex.test(this.zipCode);
  }

  validateCity() {
    return this.city && this.city.trim().length > 0;
  }

  validate() {
    const errors = [];
    if (!this.validateStreet()) errors.push("Street name is required.");
    if (!this.validateStreetNumber())
      errors.push("Street number must be a valid number.");
    if (!this.validateZipCode()) errors.push("Invalid postal code.");
    if (!this.validateCity()) errors.push("City is required.");
    return errors;
  }
}
