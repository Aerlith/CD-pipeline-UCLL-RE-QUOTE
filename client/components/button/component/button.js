//#region IMPORTS
//#endregion IMPORTS

//#region TEMPLATE
let template = document.createElement("template");
template.innerHTML = /*html*/ `
    <style>
        @import './components/template/style.css';
    </style>
  <div class="my-wrapper">
  <slot name="action-button"></slot>
  </div>
`;
template.innerHTML = /*html*/ `
    <style>
        @import './components/template/style.css';
    </style>
  <div class="bluetooth-button-container">
  
  <slot name="action-button"></slot>
  </div>
`;
//#endregion TEMPLATE
// # Example to fill in component
/*
<my-component>
    <button class="disconnect {{ connectedPuck.name }}">
      <img src="../../assets/svg-images/bluetooth-disconnect-icon.svg" alt="powericon">
    </button>
</my-component>
*/

//#region CLASS
window.customElements.define(
  "button-ɠ",
  class extends HTMLElement {
    constructor() {
      super();
      this._shadowRoot = this.attachShadow({ mode: "open" });
      this._shadowRoot.appendChild(template.content.cloneNode(true));
      this.$button = this._shadowRoot.querySelector(
        ".bluetooth-button-container",
      );
    }

    // component attributes
    static get observedAttributes() {
      return [];
    }

    attributeChangedCallback(name, oldValue, newValue) {}

    connectedCallback() {
      //
    }
  },
);
//#endregion CLASS
