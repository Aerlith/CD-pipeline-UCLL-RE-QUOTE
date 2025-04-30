//#region IMPORTS
//#endregion IMPORTS

//#region TEMPLATE
let template = document.createElement("template");
template.innerHTML = /*html*/ `
    <style>
        @import './components/card-light/card.css';
    </style>

    <div class="card">
    <img src="../../assets/svg-images/lightSensor-icon.svg" alt="powericon">

    </div>
`;
//#endregion TEMPLATE

//#region CLASS
window.customElements.define(
  "card-temperature-ɠ",
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
      setInterval(this.readLight(), 1000);
    }

    readLight() {
      // Read the light level (returns a value between 0 and 1)
      light = Puck.light();
      console.log("Light level: " + light * 100);
      return light;
    }
  },
);
//#endregion CLASS
