//#region IMPORTS
import { Address } from "/utils/address.js";
import { Customer } from "/utils/customer.js";
//#endregion IMPORTS

//#region TEMPLATE
let template = document.createElement("template");
template.innerHTML = /*html*/ `
    <style>
    @import './templates/component/newCustomer.css'
    </style>

    <h1>Nieuwe Klant</h1>
 <form id="newCustomer">
        <label for="name">Klant naam:</label><br>
        <input type="text" id="name" name="name" required><br>
        <label for="email">E-mailadress:</label><br>
        <input type="email" id="email" name="email" required><br>
        <label for="street">Straatnaam:</label><br>
        <input type="text" id="street" name="street" required><br>
        <label for="streetNumber">Straatnummer:</label><br>
        <input type="text" id="streetNumber" name="streetNumber" required><br>
        <label for="zipCode">Postcode:</label><br>
        <input type="text" id="zipCode" name="zipCode" required><br>
        <label for="city">Stad:</label><br>
        <input type="text" id="city" name="city" required><br>
        <button type="submit">Submit</button>
    </form>



    `;
//#endregion TEMPLATE

//#region CLASS
window.customElements.define(
  "new-customer-ɦ",
  class extends HTMLElement {
    constructor() {
      super();
      this._shadowRoot = this.attachShadow({ mode: "open" });
      this._shadowRoot.appendChild(template.content.cloneNode(true));
    }

    // component attributes
    static get observedAttributes() {
      return [];
    }

    attributeChangedCallback(name, oldValue, newValue) {}

    connectedCallback() {
      const form = this._shadowRoot.querySelector("#newCustomer");

      form.addEventListener("submit", (e) => {
        e.preventDefault(); // Prevent form submission

        // Collect values from the form
        const name = this._shadowRoot.querySelector("#name").value;
        const email = this._shadowRoot.querySelector("#email").value;
        const street = this._shadowRoot.querySelector("#street").value;
        const streetNumber =
          this._shadowRoot.querySelector("#streetNumber").value;
        const zipCode = this._shadowRoot.querySelector("#zipCode").value;
        const city = this._shadowRoot.querySelector("#city").value;

        // Create Address object
        const address = new Address(street, streetNumber, zipCode, city);

        // Create Customer object
        const customer = new Customer(null, name, email, address); // Ensure correct order of parameters

        // Validate customer data
        const validationErrors = customer.validate();
        if (validationErrors.length > 0) {
          alert("Errors: " + validationErrors.join(", "));
          return;
        }

        // Continue with data submission
        fetch("/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: customer.name,
            email: customer.email,
            address: {
              street: customer.address.street,
              streetNumber: customer.address.streetNumber,
              zipCode: customer.address.zipCode,
              city: customer.address.city,
            },
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            alert("Customer data submitted successfully!");
            console.log(data);
          })
          .catch((error) => {
            console.error("Error with customer data submission:", error);
            alert(
              "There was an error submitting the customer data. Please try again.",
            );
          });
      });
    }
  },
);
//#endregion CLASS
