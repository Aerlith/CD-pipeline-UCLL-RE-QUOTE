//#region IMPORTS
import "../../components/connect-button/connect-button.js";
import "../../components/device-overview/device-overview.js";
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
        <connect-button-ɠ></connect-button-ɠ>
        <device-overview-ɠ></device-overview-ɠ>  
      </div>


  `;
//#endregion TEMPLATE

//#region CLASS
window.customElements.define(
  "home-ɦ",
  class extends HTMLElement {
    constructor() {
      super();
      this._shadowRoot = this.attachShadow({ mode: "open" });
      this._shadowRoot.appendChild(template.content.cloneNode(true));
      this.$example = this._shadowRoot.querySelector(".example");
      this.$connectButton = this._shadowRoot.querySelector("connect-button-ɠ");
      this.$deviceOverview =
        this._shadowRoot.querySelector("device-overview-ɠ");
    }

    // component attributes
    static get observedAttributes() {
      return [];
    }

    attributeChangedCallback(name, oldValue, newValue) {}

    connectedCallback() {
      this._shadowRoot.querySelector("device-overview-ɠ");

      this.$connectButton.addEventListener(
        "connected-puck",
        (connectedPucks) => {
          console.log(connectedPucks.detail.currentPuck.device);
          this.$deviceOverview.connectedPucks(
            connectedPucks.detail.currentPuck.device
          );

          this.$deviceOverview.addEventListener("open-settings", (e) => {
            const existingModal = this._shadowRoot.querySelector("#settings");
            if (existingModal) {
              return;
            }
            const $settingsModal = document.createElement("settingsmodal-ɠ");
            $settingsModal.id = "settings";
            this._shadowRoot.appendChild($settingsModal);

            const deviceName = e.detail.deviceName;
            $settingsModal.setDeviceName(deviceName);

            $settingsModal.addEventListener("closemodal", (event) => {
              this._shadowRoot.removeChild($settingsModal);
            });
          });
        }
      );
    }
  }
);
//#endregion CLASS
