//#region IMPORTS

//#endregion IMPORTS

//#region TEMPLATE
let template = document.createElement("template");
template.innerHTML = /*html*/ `
    <style>
        @import './components/nfc/nfc.css';
    </style>

    <div class="nfc">
    <label>
    <input type="text" autocomplete="off" name="text" class="input" placeholder="url" required>
    <submit-ɠ></submit-ɠ>
    </label>
    </div>

`;
//#endregion TEMPLATE

//#region CLASS
window.customElements.define(
  "nfc-ɠ",
  class extends HTMLElement {
    constructor() {
      super();
      this._shadowRoot = this.attachShadow({ mode: "open" });
      this._shadowRoot.appendChild(template.content.cloneNode(true));
      this.$nfc = this._shadowRoot.querySelector(".nfc");
    }

    // component attributes
    static get observedAttributes() {
      return [];
    }

    attributeChangedCallback(name, oldValue, newValue) {}
    connectedCallback() {
      const submit = this._shadowRoot.querySelector("submit-ɠ");

      submit.addEventListener("submit-clicked", () => {
        const input = this._shadowRoot.querySelector("input");
        const value = input.value.trim();

        if (value === "") {
          input.classList.add("input-error");
          alert("input is empty!");
          return;
        }

        this.dispatchEvent(
          new CustomEvent("nfc-submitted", {
            bubbles: true,
            composed: true,
            detail: { url: value },
          }),
        );
      });
    }
  },
);
//#endregion CLASS
