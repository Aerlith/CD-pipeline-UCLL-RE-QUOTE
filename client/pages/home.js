//#region IMPORTS
import "/components/recent_quotes.js";
import "/components/quick_stats.js";
import "/components/newCustomer.js";
import "/components/overviewCustomer.js";
import "/components/interface.js";

//#region TEMPLATE
let template = document.createElement("template");
template.innerHTML = /*html*/ `
    <style>
    </style>

    <div id="homepage">

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
    }

    // component attributes
    static get observedAttributes() {
      return [];
    }

    attributeChangedCallback(name, oldValue, newValue) {}

    connectedCallback() {}
  },
);
//#endregion CLASS
