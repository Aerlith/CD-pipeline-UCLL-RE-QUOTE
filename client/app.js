//#region IMPORTS
import "./components/header/header.js";
import "./components/footer/footer.js";
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
    <route-χ path="/" title="home" component="home-ɦ" resourceUrl="/pages/home/home.js"></route-χ>
    <route-χ path="/home" title="home" component="home-ɦ" resourceUrl="/pages/home/home.js"></route-χ>
    <route-χ path="/dashboard" title="dashboard" component="dashboard-ɦ" resourceUrl="/pages/dashboard/dashboard.js"></route-χ>
    <route-χ path="/settings" title="settings" component="settings-ɦ" resourceUrl="/pages/settings/settings.js"></route-χ>
    <route-χ path="/test" title="middag" component="test2-ɦ" resourceUrl="/pages/test2.js"></route-χ>

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
  }
);
//#endregion CLASS
