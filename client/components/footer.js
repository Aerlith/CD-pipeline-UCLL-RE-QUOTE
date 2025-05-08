//#region IMPORTS
//#endregion IMPORTS

//#region TEMPLATE
let template = document.createElement("template");
template.innerHTML = /*html*/ `
   <style>@import './templates/component/footer.css'</style>


<footer>
    <div class="info">
        vzw, UC Leuven, Campus Proximus • Geldenaaksebaan 335 • 3001 Leuven • tel: +32 16 375 700<br>
        • RPR Leuven • <a href="https://www.ucll.be">www.ucll.be</a> •
        <a href="/contact">research.expertise@ucll.be</a> •
        BTW: BE 0455.645.523
    </div>

    <div class="social-bar">
        <a class="icon-link" href="https://www.ucll.be/research-expertise">
            <img src="assets/bluew.png" alt="Website">
            www.ucll.be/research-expertise
        </a>
        <a class="icon-link" href="https://x.com/ucll_re">
            <img src="assets/twitter-icon-logo-25db10.png" alt="Twitter">
            @ucll_re
        </a>
        <a class="icon-link" href="https://facebook.com/ucll_re">
            <img src="assets/Facebook-logo.png" alt="Facebook">
            @ucll_re
        </a>
        <a class="icon-link" href="https://www.linkedin.com/company/ucleuvenlimburg-re/">
            <img src="assets/linkedin-logo(2).png" alt="LinkedIn">
            /company/ucleuvenlimburg-re
        </a>
        <span class="logo-wide">
            <img src="assets/Picture1.jpgkuleuven.jpg" alt="Associatie KU Leuven">
        </span>
    </div>
</footer>
`;
//#endregion TEMPLATE

//#region CLASS
window.customElements.define(
  "footer-ɦ",
  class extends HTMLElement {
    constructor() {
      super();
      this._shadowRoot = this.attachShadow({ mode: "open" });
      this._shadowRoot.appendChild(template.content.cloneNode(true));
    }

    static get observedAttributes() {
      return [];
    }

    attributeChangedCallback(name, oldValue, newValue) {}

    connectedCallback() {}
  },
);
//#endregion CLASS
