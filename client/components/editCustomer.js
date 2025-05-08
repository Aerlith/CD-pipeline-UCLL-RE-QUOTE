//#region IMPORTS
import { Address } from "/utils/address.js";
import { Customer } from "/utils/customer.js";
//#endregion IMPORTS

//#region TEMPLATE
let template = document.createElement("template");
template.innerHTML = /*html*/ `
<style>form {
    background-color: #FFFFFF;
    border: 1px solid #E0E0E0;
    padding: 2rem;
    max-width: 500px;
    margin: 2rem auto;
    border-radius: 8px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
    font-family: Arial, sans-serif;
    color: #333333;
}

h1 {
    color: #003A63;
    text-align: center;
    margin-bottom: 1.5rem;
}

label {
    display: block;
    margin-top: 1rem;
    margin-bottom: 0.3rem;
    font-weight: bold;
    color: #003A63;
}

input {
    width: 100%;
    padding: 0.6rem;
    border: 1px solid #E0E0E0;
    border-radius: 4px;
    font-size: 1rem;
    transition: border-color 0.3s;
}

input {
    border-color: #B50027;
    outline: none;
}

button {
    display: block;
    width: 100%;
    margin-top: 1.5rem;
    padding: 0.8rem;
    background-color: #003A63;
    color: #FFFFFF;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    font-weight: bold;
    cursor: pointer;
}

button:hover {
    background-color: #B50027;
    transition: background-color 1.5s ease;
}</style>

        <h1>Edit Customer</h1>
        <form id="edit-form">
            <label for="name">Name:</label>
            <input type="text" id="name" name="name">
            
            <label for="email">Email:</label>
            <input type="email" id="email" name="email">

            <label for="street">Street:</label>
            <input type="text" id="street" name="street">

            <label for="streetNumber">Street Number:</label>
            <input type="text" id="streetNumber" name="streetNumber">

            <label for="zipCode">Zip Code:</label>
            <input type="text" id="zipCode" name="zipCode">

            <label for="city">City:</label>
            <input type="text" id="city" name="city">

            <button type="submit">Save Changes</button>
        </form>
    `;
//#endregion TEMPLATE

//#region CLASS
window.customElements.define(
  "edit-customer-ɦ",
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
      const customerId = this.getAttribute("id");
      console.log(customerId);
      // Haal de klantgegevens op met de API
      fetch(`/api/customers/${customerId}`)
        .then((response) => response.json())
        .then((customer) => {
          // Pre-fill het formulier met de bestaande klantgegevens
          if (customer) {
            this._shadowRoot.getElementById("name").value = customer.name || "";
            this._shadowRoot.getElementById("email").value =
              customer.email || "";
            this._shadowRoot.getElementById("street").value =
              customer.address.street || "";
            this._shadowRoot.getElementById("streetNumber").value =
              customer.address.streetNumber || "";
            this._shadowRoot.getElementById("zipCode").value =
              customer.address.zipCode || "";
            this._shadowRoot.getElementById("city").value =
              customer.address.city || "";
          }
        })
        .catch((error) => {
          console.error("Error fetching customer data:", error);
        });

      // Verwerk het formulier om klantgegevens bij te werken
      const form = this._shadowRoot.getElementById("edit-form");
      form.addEventListener("submit", (event) => {
        event.preventDefault();

        // Verzamel formuliergegevens
        const name = this._shadowRoot.getElementById("name").value;
        const email = this._shadowRoot.getElementById("email").value;
        const street = this._shadowRoot.getElementById("street").value;
        const streetNumber =
          this._shadowRoot.getElementById("streetNumber").value;
        const zipCode = this._shadowRoot.getElementById("zipCode").value;
        const city = this._shadowRoot.getElementById("city").value;

        // Maak een Address-object
        const address = new Address(street, streetNumber, zipCode, city);

        // Maak een Customer-object
        const customer = new Customer(customerId, name, email, address); // Gebruik bestaande ID

        // Valideer klantgegevens
        const validationErrors = customer.validate();
        if (validationErrors.length > 0) {
          alert("Fouten: " + validationErrors.join(", "));
          return;
        }

        // Als validatie slaagt, stuur PUT-verzoek
        fetch(`/api/customers/${customerId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
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
            alert("Klant succesvol bijgewerkt!");
            window.location.href = "/"; // Redirect naar overzichtspagina
          })
          .catch((error) => {
            console.error("Fout bij bijwerken van klant:", error);
            alert(
              "Er is een fout opgetreden bij het bijwerken. Probeer het opnieuw.",
            );
          });
      });
    }
  },
);
//#endregion CLASS
