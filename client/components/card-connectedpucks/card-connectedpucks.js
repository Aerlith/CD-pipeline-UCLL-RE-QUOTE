//#region IMPORTS
//#endregion IMPORTS

//#region TEMPLATE
let template = document.createElement("template");
template.innerHTML = /*html*/ `
  <style>
    @import './components/card-light/card.css';
  </style>

  <div class="card">
  list of connected pucks
  </div>
`;
//#endregion TEMPLATE

//#region CLASS
window.customElements.define(
  "connectedpucks-ɠ",
  class extends HTMLElement {
    constructor() {
      super();
      this._shadowRoot = this.attachShadow({ mode: "open" });
      this._shadowRoot.appendChild(template.content.cloneNode(true));
      this.$example = this._shadowRoot.querySelector(".card");
    }

    static get observedAttributes() {
      return [];
    }

    attributeChangedCallback(name, oldValue, newValue) {}

    connectedCallback() {}
  },
);
//#endregion CLASS
