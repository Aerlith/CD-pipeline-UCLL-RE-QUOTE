//#region IMPORTS
//#endregion IMPORTS

//#region TEMPLATE
let template = document.createElement("template");
template.innerHTML = /*html*/ `
    <style>
        @import './components/card-light/card.css';
    </style>

    <div class="card">
    <img src="../../assets/svg-images/mdi--cellphone-nfc.svg" alt="powericon">
<H1>NFC</H1>
<nfc-ɠ></nfc-ɠ>
    </div>
`;
//#endregion TEMPLATE

//#region CLASS
window.customElements.define(
  "card-nfc-ɠ",
  class extends HTMLElement {
    constructor() {
      super();
      this._shadowRoot = this.attachShadow({ mode: "open" });
      this._shadowRoot.appendChild(template.content.cloneNode(true));
      this.$card = this._shadowRoot.querySelector(".card");
    }

    // component attributes
    static get observedAttributes() {
      return [];
    }

    attributeChangedCallback(name, oldValue, newValue) {}

    connectedCallback() {
      //NFC
      this.addEventListener("nfc-submitted", (event) => {
        console.log("🎯 Input ontvangen:", event.detail.url);
        Puck.write(`NRF.nfcURL("${event.detail.url}");
              save()`);
      }); //NFC
    }
  }
);
//#endregion CLASS
