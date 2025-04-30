//#region IMPORTS
//#endregion IMPORTS

//#region TEMPLATE
let template = document.createElement("template");
template.innerHTML = /*html*/ `
    <style>
        @import './components/submit/submit.css';
    </style>

    <div class="submit">
    <button>
    Submit
</button>
    </div>
`;
//#endregion TEMPLATE

//#region CLASS
window.customElements.define(
  "submit-ɠ",
  class extends HTMLElement {
    constructor() {
      super();
      this._shadowRoot = this.attachShadow({ mode: "open" });
      this._shadowRoot.appendChild(template.content.cloneNode(true));
      this.$submit = this._shadowRoot.querySelector(".submit");
    }

    // component attributes
    static get observedAttributes() {
      return [];
    }

    attributeChangedCallback(name, oldValue, newValue) {}

    connectedCallback() {
      const button = this._shadowRoot.querySelector("button");

      button.addEventListener("click", () => {
        this.dispatchEvent(
          new CustomEvent("submit-clicked", {
            bubbles: true,
            composed: true,
          }),
        );
      });
    }
  },
);
//#endregion CLASS
