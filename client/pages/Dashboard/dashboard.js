//#region IMPORTS
import "../../components/card-light/card-light.js";
import "../../components/toggle/toggle.js";
import "../../components/color-picker/color-picker.js";
import "../../components/card-nfc/card-nfc.js";
import "../../components/nfc/nfc.js";
import "../../components/submit/submit.js";
import "../../components/card-temperature/card-temperature.js";
import "../../components/card-connectedpucks/card-connectedpucks.js";
//#region TEMPLATE
let template = document.createElement("template");
template.innerHTML = /*html*/ `
    <style>
    @import './pages/dashboard/dashboard.css';
    </style>

    <div id="dashboard"> 
     <connectedpucks-ɠ></connectedpucks-ɠ> 
 <card-light-ɠ></card-light-ɠ>
 <card-nfc-ɠ></card-nfc-ɠ>
 <card-temperature-ɠ class="thermometer"></card-temperature-ɠ>
 

    </div>
`;
//#endregion TEMPLATE

//#region CLASS
window.customElements.define(
  "dashboard-ɦ",
  class extends HTMLElement {
    constructor() {
      super();
      this._shadowRoot = this.attachShadow({ mode: "open" });
      this._shadowRoot.appendChild(template.content.cloneNode(true));
      this.$dashboard = this._shadowRoot.querySelector("#dashboard");
      this.$temperature = this._shadowRoot.querySelector(".thermometer");
    }

    // component attributes
    static get observedAttributes() {
      return [];
    }

    attributeChangedCallback(name, oldValue, newValue) {}

    connectedCallback() {}
  }
);
//#endregion CLASS
