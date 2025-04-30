//#region IMPORTS
//#endregion IMPORTS

//#region TEMPLATE
let template = document.createElement("template");
template.innerHTML = /*html*/ `
    <style>
        @import './components/card-light/card.css';
    </style>
    <div class="card">
    <img src="../../assets/svg-images/stash--light-bulb.svg" alt="powericon">
     <toggle-ɠ></toggle-ɠ>
       <color-picker-ɠ></color-picker-ɠ>
    </div>

`;
//#endregion TEMPLATE

//#region CLASS
window.customElements.define(
  "card-light-ɠ",
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
      /*light card*/
      this.addEventListener("colorChange", (event) => {
        this.selectedColors = event.detail.colors;
        this.updateLights();
      });

      this.addEventListener("toggleChange", (event) => {
        this.toggleState = event.detail.checked;
        this.updateLights();
      });
      //light card
    }

    // lightcard
    updateLights() {
      if (!this.toggleState) {
        // Als toggle OFF is, alles uitzetten
        Puck.write("LED1.write(0);LED2.write(0);LED3.write(0);\n");
        console.log("Toggle is OFF, alles uit.");
        return;
      }

      let puckCommand = "";

      if (this.selectedColors.includes("red")) {
        puckCommand += "LED1.write(1);";
      } else {
        puckCommand += "LED1.write(0);";
      }

      if (this.selectedColors.includes("green")) {
        puckCommand += "LED2.write(1);";
      } else {
        puckCommand += "LED2.write(0);";
      }

      if (this.selectedColors.includes("blue")) {
        puckCommand += "LED3.write(1);";
      } else {
        puckCommand += "LED3.write(0);";
      }

      Puck.write(puckCommand + "\n");
      console.log("LEDs ingesteld:", puckCommand);
    }
    //light card
  }
);
//#endregion CLASS
