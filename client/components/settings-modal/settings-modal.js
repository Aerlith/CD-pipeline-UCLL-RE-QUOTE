//#region IMPORTS
import "../../components/settings/settingsBtn.js";
//#endregion IMPORTS

//#region TEMPLATE
let template = document.createElement("template");
template.innerHTML = /*html*/ `
    <style>
        @import './components/settings-modal/settings-modal.css';
    </style>

    <div class="overlay"></div>
    <div class="background">
      <button class="close">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M6.4 19L5 17.6l5.6-5.6L5 6.4L6.4 5l5.6 5.6L17.6 5L19 6.4L13.4 12l5.6 5.6l-1.4 1.4l-5.6-5.6z"/></svg>
        </button>
      <h1>Puck Name</h1>
      <div class="buttons">
        <settings-btn-ɠ>
          <p slot="name">LED</p>
        </settings-btn-ɠ>
        <settings-btn-ɠ>
          <p slot="name">Accelerator</p>
        </settings-btn-ɠ>
        <settings-btn-ɠ>
          <p slot="name">Temperature</p>
        </settings-btn-ɠ>
        <settings-btn-ɠ>
          <p slot="name">Light sensor</p>
        </settings-btn-ɠ>
        <settings-btn-ɠ>
          <p slot="name">Infrared</p>
        </settings-btn-ɠ>
        <settings-btn-ɠ>
          <p slot="name">Magnetometer</p>
        </settings-btn-ɠ>
        <settings-btn-ɠ>
          <p slot="name">NFC</p>
        </settings-btn-ɠ>
        <settings-btn-ɠ>
          <p slot="name">Sleep mode</p>
        </settings-btn-ɠ>
      </div>
    </div>
`;
//#endregion TEMPLATE

//#region CLASS
window.customElements.define(
  "settingsmodal-ɠ",
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

    connectedCallback() {
      const $closeButton = this._shadowRoot.querySelector(".close");

      $closeButton.addEventListener("click", (e) => {
        this.dispatchEvent(
          new CustomEvent("closemodal", { bubbles: true, composed: true })
        );
      });
    }

    setDeviceName(deviceName) {
      const $title = this._shadowRoot.querySelector("h1");
      $title.textContent = `${deviceName} settings`;
    }

    // test
  }
);
//#endregion CLASS
