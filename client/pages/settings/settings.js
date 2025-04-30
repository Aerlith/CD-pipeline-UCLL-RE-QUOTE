//#region IMPORTS
import "../../components/settings-modal/settings-modal.js";
//#region TEMPLATE
let template = document.createElement("template");
template.innerHTML = /*html*/ `
    <style>
      @import './pages/settings/settings.css'
    </style>

    <settingsmodal-ɠ></settingsmodal-ɠ>
`;
//#endregion TEMPLATE

//#region CLASS
window.customElements.define(
  "settings-ɦ",
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
  },
);
//#endregion CLASS
