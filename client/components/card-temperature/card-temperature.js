//#region IMPORTS
//#endregion IMPORTS

//#region TEMPLATE
let template = document.createElement("template");
template.innerHTML = /*html*/ `
    <style>
        @import './components/card-light/card.css';
    </style>

    <div class="card">
    <img src="../../assets/svg-images/thermometer-icon.svg" alt="powericon">

    </div>
`;
//#endregion TEMPLATE

//#region CLASS
window.customElements.define(
  "card-temperature-ɠ",
  class extends HTMLElement {
    constructor() {
      super();
      this._shadowRoot = this.attachShadow({ mode: "open" });
      this._shadowRoot.appendChild(template.content.cloneNode(true));
      this.$card = this._shadowRoot.querySelector(".card");
    }

    // component attributes
    static get observedAttributes() {
      return [];
    }

    attributeChangedCallback(name, oldValue, newValue) {}

    connectedCallback() {
      this.thermometerDisplay(); // Call the thermometer display function}
    }
    thermometerDisplay() {
      // Check if this card contains the thermometer
      const isThermometerCard = this._shadowRoot.querySelector("img");
      if (!isThermometerCard) {
        return; // Exit if this is not the thermometer card
      }

      // Dynamically create the temperature display element if not already present
      if (!this.$temperature) {
        this.$temperature = document.createElement("div");
        this.$temperature.classList.add("temperature-display");
        this.$card.appendChild(this.$temperature); // Append to the card
      }

      if (this.$temperatureInterval) {
        clearInterval(this.$temperatureInterval); // Clear any existing interval
      }

      this.$temperatureInterval = setInterval(() => {
        Puck.write("E.getTemperature()" + "\n", (dataTemperature) => {
          if (dataTemperature) {
            // Extracting the temperature value from the response
            const extractedTemperature = parseFloat(
              dataTemperature.split("=")[1]
            ).toFixed(1);
            this.$temperature.innerHTML = `
            ${extractedTemperature} °C</p>`;
          } else {
            console.error("Kon temperatuur niet ophalen.");
            this.$temperature.innerHTML = `<p>Temperatuur niet beschikbaar</p>`;
          }
        });
      }, 3000);
    }
  }
);
//#endregion CLASS
