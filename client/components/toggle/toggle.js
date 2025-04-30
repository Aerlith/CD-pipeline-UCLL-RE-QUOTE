//#region IMPORTS
//#endregion IMPORTS

//#region TEMPLATE
let template = document.createElement("template");
template.innerHTML = /*html*/ `
    <style>
        @import './components/toggle/toggle.css';
    </style>

<!-- From Uiverse.io by mobinkakei --> 
<label class="label">
    <div class="toggle">
        <input class="toggle-state" type="checkbox" name="check" value="check">
        <div class="indicator"></div>
    </div>
</label>
`;
//#endregion TEMPLATE

//#region CLASS
window.customElements.define(
  "toggle-ɠ",
  class extends HTMLElement {
    constructor() {
      super();
      this._shadowRoot = this.attachShadow({ mode: "open" });
      this._shadowRoot.appendChild(template.content.cloneNode(true));
      this.$toggle = this._shadowRoot.querySelector(".toggle-state");
    }

    // component attributes
    static get observedAttributes() {
      return [];
    }

    attributeChangedCallback(name, oldValue, newValue) {}

    connectedCallback() {
      this.$toggle.addEventListener("change", (event) => {
        const customEvent = new CustomEvent("toggleChange", {
          detail: { checked: event.target.checked },
          bubbles: true,
          composed: true,
        });
        this.dispatchEvent(customEvent);
      });
    }
  },
);
//#endregion CLASS
