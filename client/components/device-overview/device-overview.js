//#region IMPORTS
import "../puck-info/puck-info.js";
//#endregion IMPORTS

//#region TEMPLATE
let template = document.createElement("template");
template.innerHTML = /*html*/ `
      <style>
          @import './components/device-overview/style.css';
      </style>
      <puck-info-ɠ></puck-info-ɠ>


  `;
//#endregion TEMPLATE

//#region CLASS
window.customElements.define(
  "device-overview-ɠ",
  class extends HTMLElement {
    constructor() {
      super();
      this._shadowRoot = this.attachShadow({ mode: "open" });
      this._shadowRoot.appendChild(template.content.cloneNode(true));
      this.$deviceOverview = this._shadowRoot.querySelector(".device-overview");
      this.$puckInfo = this._shadowRoot.querySelector("puck-info-ɠ");
      this.connectedDevices = [];
    }

    // component attributes
    static get observedAttributes() {
      return [];
    }

    attributeChangedCallback(name, oldValue, newValue) {}

    connectedCallback() {
      const disconnectButtons =
        this._shadowRoot.querySelectorAll(".disconnect");
      console.log(disconnectButtons);
    }

    connectedPucks(connectedPuck) {
      this.connectedDevices.push(connectedPuck);
      console.log(this.$puckInfo);
      this.$puckInfo.divMaker(connectedPuck.name, connectedPuck.id);
      // this.$puckInfo.divMaker(connectedPuck.name, connectedPuck.id);
    }
  }
);
//#endregion CLASS
