//#region IMPORTS
import "../toggle/toggle.js";
//#endregion IMPORTS

//#region TEMPLATE
let template = document.createElement("template");
template.innerHTML = /*html*/ `
    <style>
        @import './components/settings/settingsBtn.css'
    </style>

    <div class="container">
      <toggle-ɠ></toggle-ɠ>
      <slot class="label-text" name="name"></slot>
    </div>
`;
//#endregion TEMPLATE

//#region CLASS
window.customElements.define(
  "settings-btn-ɠ",
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
