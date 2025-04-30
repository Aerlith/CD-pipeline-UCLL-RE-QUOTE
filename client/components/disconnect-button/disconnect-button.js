//#region IMPORTS
//#endregion IMPORTS

//#region TEMPLATE
let template = document.createElement("template");
template.innerHTML = /*html*/ `
    <style>
        @import './components/disconnect-button/style.css';
    </style>

<button><img src="../../assets/svg-images/bluetooth-disconnect-icon.svg" alt="powericon"></button>
`;
//#endregion TEMPLATE

//#region CLASS
window.customElements.define(
  "disconnect-button-ɠ",
  class extends HTMLElement {
    constructor() {
      super();
      this._shadowRoot = this.attachShadow({ mode: "open" });
      this._shadowRoot.appendChild(template.content.cloneNode(true));
      this.$example = this._shadowRoot.querySelector(".example");
      this.$button = this._shadowRoot.querySelector("button");
    }

    // component attributes
    static get observedAttributes() {
      return [];
    }

    attributeChangedCallback(name, oldValue, newValue) {}

    connectedCallback() {
      this.$button.addEventListener("click", () => {
        console.log(this.$button.getAttribute("label"));
        this.dispatchEvent(new CustomEvent("delete-button-pressed"), {});
      });
    }

    createDisconnectButton(puckId) {
      this.$button.setAttribute("label", puckId);
    }
  }
);
//#endregion CLASS
