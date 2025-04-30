//#region IMPORTS
import "../../components/settings/settingsBtn.js";
import "../../components/settings-modal/settings-modal.js";

//#region TEMPLATE
let template = document.createElement("template");
template.innerHTML = /*html*/ `
    <style>
     @import './pages/home/home.css';
    </style>

    <div id="homepage">
      <h1>PUCK.JS INTERFACE</h1>
      <p>Please connect to a puck.js first, before going to the settings or dashboard.</p>
      <settingsmodal-ɠ></settingsmodal-ɠ>
    </div>
`;
//#endregion TEMPLATE

//#region CLASS
window.customElements.define(
  "test2-ɦ",
  class extends HTMLElement {
    constructor() {
      super();
      this._shadowRoot = this.attachShadow({ mode: "open" });
      this._shadowRoot.appendChild(template.content.cloneNode(true));
      this.$example = this._shadowRoot.querySelector(".example");
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
