//#region IMPORTS
import { Address } from "/utils/address.js";
import { Customer } from "/utils/customer.js";
//#endregion IMPORTS

//#region TEMPLATE
let template = document.createElement("template");
template.innerHTML = /*html*/ `
<style>@import './templates/component/overviewCustomer.css'</style>

    <h1>Customer List</h1>
    <div id="customer-list"></div>
`;
//#endregion TEMPLATE

//#region CLASS
window.customElements.define(
  "overview-customer-ɦ",
  class extends HTMLElement {
    constructor() {
      super();
      this._shadowRoot = this.attachShadow({ mode: "open" });
      this._shadowRoot.appendChild(template.content.cloneNode(true));
    }

    connectedCallback() {
      fetch("/api/customers")
        .then((response) => response.json())
        .then((customers) => {
          const customerList = this._shadowRoot.getElementById("customer-list");

          if (Array.isArray(customers)) {
            customers.forEach((customer) => {
              const customerItem = document.createElement("div");
              customerItem.classList.add("customer-card");
              customerItem.innerHTML = `
                            <h2>${customer.name}</h2>
                            <p>Email: ${customer.email}</p>
                            <p>Address: ${customer.address.street} ${customer.address.streetNumber}, ${customer.address.zipCode} ${customer.address.city}</p>
                            <button class="edit-btn" data-id="${customer._id}">Edit</button>
                            <button class="delete-btn" data-id="${customer._id}">Delete</button>
                        `;
              customerList.appendChild(customerItem);

              customerItem
                .querySelector(".edit-btn")
                .addEventListener("click", (e) => {
                  const customerId = e.target.dataset.id;
                  window.location = `/edit-customer/${customerId}`;
                  console.log(customerId);
                });

              customerItem
                .querySelector(".delete-btn")
                .addEventListener("click", (e) => {
                  const customerId = e.target.dataset.id;
                  if (
                    confirm("Are you sure you want to delete this customer?")
                  ) {
                    fetch(`/api/customers/${customerId}`, { method: "DELETE" })
                      .then((res) => {
                        if (res.ok) {
                          customerItem.remove();
                        } else {
                          alert("Failed to delete customer");
                        }
                      })
                      .catch((err) => {
                        console.error("Error deleting customer:", err);
                        alert("An error occurred while deleting the customer.");
                      });
                  }
                });
            });
          } else {
            console.error("Invalid customer data:", customers);
          }
        })
        .catch((error) => {
          console.error("Error fetching customer data:", error);
        });
    }
  },
);
//#endregion CLASS
