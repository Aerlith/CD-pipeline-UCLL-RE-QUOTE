//#endregion IMPORTS
import "../disconnect-button/disconnect-button.js";
//#region TEMPLATE
let template = document.createElement("template");
template.innerHTML = /*html*/ `
      <style>
          @import './components/device-overview/style.css';
      </style>

      <div class="device-overview">
      </div>
  `;
//#endregion TEMPLATE

//#region CLASS
window.customElements.define(
  "puck-info-ɠ",
  class extends HTMLElement {
    constructor() {
      super();
      this._shadowRoot = this.attachShadow({ mode: "open" });
      this._shadowRoot.appendChild(template.content.cloneNode(true));
      this.$deviceOverview = this._shadowRoot.querySelector(".device-overview");
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

    divMaker(puckName, puckID) {
      let newDevice = document.createElement("div");
      let disconnectButton = document.createElement("disconnect-button-ɠ");
      console.log(disconnectButton);
      disconnectButton.createDisconnectButton(puckID);

      newDevice.innerHTML = `
                <div class="device-container ${puckName}" label="${puckID}">
                <div class="settings-container">
                <h3 class="puck-name">${puckName}</h3>
                <button class="settings"><img src="../../assets/svg-images/settings-icon.svg" alt="settingsicon"></button>
                </div>
                <disconnect-button-ɠ></disconnect-button-ɠ>
                </div>
              `;
      this.$deviceOverview.appendChild(newDevice); //voegt nieuwe div toe aan DOM
      //voegt nieuwe div toe aan DOM

      const settingsButton = newDevice.querySelector(`.settings`);

      settingsButton.addEventListener("click", () => {
        this.dispatchEvent(
          new CustomEvent("open-settings", {
            bubbles: true,
            composed: true,
            detail: { deviceName: puckName },
          })
        );
      });
    }
  }
);
//#endregion CLASS
