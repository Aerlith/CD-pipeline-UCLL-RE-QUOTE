//#region IMPORTS

//#endregion IMPORTS

//#region TEMPLATE
let template = document.createElement("template");
template.innerHTML = /* html */ `
<style>
        @import './components/header/header.css';  
</style>
<header>
  <nav class="navbar">
    <div class="home-icon">
      <a route="/home" class="nav-link">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#000" d="M12 3s-6.186 5.34-9.643 8.232A1.04 1.04 0 0 0 2 12a1 1 0 0 0 1 1h2v7a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-4h4v4a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-7h2a1 1 0 0 0 1-1a.98.98 0 0 0-.383-.768C18.184 8.34 12 3 12 3"/></svg>
      </a>
    </div>
    <ul>
      <li>
        <a route="/settings" class="nav-link">SETTINGS</a>
      </li>
      <li class="separator">|</li>
      <li>
        <a route="/dashboard" class="nav-link">DASHBOARD</a>
      </li>
    </ul>
  </nav>
</header>

`;
//#endregion TEMPLATE

//#region CLASS
window.customElements.define(
  "header-ɦ",
  class extends HTMLElement {
    constructor() {
      super();
      this._shadowRoot = this.attachShadow({ mode: "open" });
      this._shadowRoot.appendChild(template.content.cloneNode(true));

      // route element als dependency
      // router = inject router
      // router.bindRoutes(this);
      // links moeten met <a route"=/example">element</a>
    }

    connectedCallback() {
      this.updateActiveLink();
      window.addEventListener("popstate", () => this.updateActiveLink());
      // Intercept pushState and replaceState to detect programmatic navigation
      const originalPushState = history.pushState;
      const originalReplaceState = history.replaceState;

      history.pushState = (...args) => {
        originalPushState.apply(history, args);
        this.updateActiveLink(); // Update the active link after navigation
      };

      history.replaceState = (...args) => {
        originalReplaceState.apply(history, args);
        this.updateActiveLink(); // Update the active link after navigation
      };
    }
    updateActiveLink() {
      const currentPath = window.location.pathname; // Get the current path
      const links = this._shadowRoot.querySelectorAll(".nav-link");

      links.forEach((link) => {
        const route = link.getAttribute("route");
        if (currentPath.includes(route)) {
          link.style.fontWeight = "bold"; // Make the active link bold
          link.style.color = "#000"; // Active link color
        } else {
          link.style.fontWeight = "normal"; // Reset other links
          link.style.color = "#888"; // Inactive link color
        }
      });
    }
    navigate(_) {
      console.log(_);
      this.dispatchEvent(
        new CustomEvent("ʤ", {
          bubbles: true,
          cancelable: false,
          composed: true,
          detail: {
            channel: "go",
            data: _,
          },
        })
      );
    }

    static get observedAttributes() {
      return [];
    }

    attributeChangedCallback(name, oldValue, newValue) {}
  }
);
//#endregion CLASS
