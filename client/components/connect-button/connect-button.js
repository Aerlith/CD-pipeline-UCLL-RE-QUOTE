//#region IMPORTS
import "../device-overview/device-overview.js";

//#endregion IMPORTS

//#region TEMPLATE
let template = document.createElement("template");
template.innerHTML = /*html*/ `
      <style>
          @import './components/connect-button/connect-button.css';
      </style>
      <div class="flexbox">
      <button class="connect"><img src="../../assets/svg-images/bluetooth-icon.svg" alt="powericon"></button>
      </div>
      <div class="connected-devices"></div>


  `;
//#endregion TEMPLATE

//#region CLASS
window.customElements.define(
  "connect-button-ɠ",
  class extends HTMLElement {
    constructor() {
      super();
      this._shadowRoot = this.attachShadow({ mode: "open" });
      this._shadowRoot.appendChild(template.content.cloneNode(true));
      this.$connect = this._shadowRoot.querySelector(".connect");
      this.$connecteddevices =
        this._shadowRoot.querySelector(".connected-devices");
    }

    // component attributes
    static get observedAttributes() {
      return [];
    }

    attributeChangedCallback(name, oldValue, newValue) {}

    connectedCallback() {
      let deviceName;
      let deviceID;
      let connectedPucks = [];
      let currentPuck;
      let double;

      let connection = false;
      //dit is een arrowfunction omdat de scope van this anders niet meer klopt
      const connect = () => {
        //zorgt ervoor dat je connect als asynchrone functie kan gebruiken
        return new Promise((resolve, reject) => {
          Puck.connect((currentPuck) => {
            double = false;
            if (currentPuck) {
              connectedPucks.forEach((puck) => {
                console.log("puck" + puck.id);
                console.log("current puck" + currentPuck.device.id);
                if (puck.id.includes(currentPuck.device.id)) {
                  let duplicate = document.createElement("div");
                  duplicate.innerHTML = "<p>Device already connected</p>";
                  duplicate.classList.add("error-message");
                  this._shadowRoot
                    .querySelector(".flexbox")
                    .appendChild(duplicate);
                  double = true;
                }
              });
              if (!double) {
                deviceName = currentPuck.device.name;
                deviceID = currentPuck.device.id;
                connectedPucks.push({
                  name: deviceName,
                  id: deviceID,
                  puck: currentPuck,
                });
              }

              resolve(currentPuck);
            } else {
              reject("No device found");
            }
          });
        });
      };
      //deze addevent listener zorgt ervoor dat er een asynchrone functie wordt aangeroepen
      this.$connect.addEventListener("click", async () => {
        if (this._shadowRoot.querySelector(".error-message")) {
          let previousError = this._shadowRoot.querySelector(".error-message");
          previousError.remove();
        }
        try {
          //als currentPuck niet null is, dan is er een device gevonden
          currentPuck = await connect();
          if (!double) {
            this.dispatchEvent(
              new CustomEvent("connected-puck", {
                detail: { currentPuck },
                bubbles: true,
                composed: true,
              }),
            );
          }
        } catch (e) {
          let errorMessage = document.createElement("div");
          errorMessage.innerHTML = "<p>Bluetooth connection unsuccesfull</p>";
          errorMessage.classList.add("error-message");
          this._shadowRoot.querySelector(".flexbox").appendChild(errorMessage);
        }
      });
    }
  },
);
//#endregion CLASS
