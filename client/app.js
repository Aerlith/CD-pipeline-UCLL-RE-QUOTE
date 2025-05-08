//#region IMPORTS
import "./components/header.js";
import "./components/footer.js";
import "./components/quick_stats.js";
import "./components/editCustomer.js";
import "./utils/router.js";
import { ʤ } from "./utils/observer.js";
//#endregion IMPORTS

//#region TEMPLATE
let template = document.createElement("template");
template.innerHTML = /* html */ `
<style>

</style>

<router-χ>
<!--
    <route-χ path="/example/:attribute" title="Route to example with attribute as variable" component="component-name" resourceUrl="/{route}/{to}/{component}"></route-χ>
-->
    <route-χ path="/" title="home" component="home-ɦ" resourceUrl="/pages/home.js"></route-χ>
    <route-χ path="/home" title="home" component="home-ɦ" resourceUrl="/pages/home.js"></route-χ>
    <route-χ path="/customers" title="viewcustomer" component="overview-customer-ɦ" resourceUrl="/components/overviewCustomer.js"></route-χ>
    <route-χ path="/new" title="newcustomer" component="new-customer-ɦ" resourceUrl="/components/newCustomer.js"></route-χ>
    <route-χ path="/edit-customer/:id" title="editcustomer" component="edit-customer-ɦ" resourceUrl="/components/editCustomer.js"></route-χ>
    <route-χ path="/interface" title="interface" component="interface-ɦ" resourceUrl="/components/interface.js"></route-χ>

    <div id="inside">
        <header-ɦ></header-ɦ>
        <outlet-χ></outlet-χ>
        <footer-ɦ></footer-ɦ>
    </div>
</router-χ>

`;
//#endregion TEMPLATE

//#region CLASS
customElements.define(
  "app-ɦ",
  class extends HTMLElement {
    constructor() {
      super();
      this._shadowRoot = this.attachShadow({ mode: "open" });
      this._shadowRoot.appendChild(template.content.cloneNode(true));
      this.$inside = this._shadowRoot.querySelector("#inside");
      // ROUTING
      let $router = this._shadowRoot.querySelector("router-χ");
      let $header = this._shadowRoot.querySelector("header-ɦ");
      $router.bindRoutes($header);
      // DISPATCH
      this.ʤ = new ʤ(["i18n", "go"]);
      this.ʤ.addObserver("i18n", (_) => {
        window.localStorage.language = _;
      });
      this.ʤ.addObserver("go", (_) => {
        console.log("go : ", _);
        $router.bindRoutes(_);
      });
    }

    connectedCallback() {
      // The event listener passes messages on to the eponymous dispatcher
      this.addEventListener("ʤ", (e) => {
        if (typeof e.detail.data != "function") {
          this.ʤ.notify(e.detail.channel, e.detail.data);
        } else {
          console.log("func");
          this.ʤ.addObserver(e.detail.channel, e.detail.data);
        }
      });
    }

    attributeChangedCallback(name, oldValue, newValue) {}
  },
);
//#endregion CLASS
