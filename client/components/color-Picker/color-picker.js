//#region IMPORTS
//#endregion IMPORTS

//#region TEMPLATE
let template = document.createElement("template");
template.innerHTML = /*html*/ `
    <style>
        @import './components/color-Picker/color-picker.css';
    </style>

<div class="color-picker">
  <p>Kies je kleuren:</p> 

  <label class="ios-checkbox blue">
    <input type="checkbox" value="blue" />
    <div class="checkbox-wrapper">
      <div class="checkbox-bg"></div>
      <svg fill="none" viewBox="0 0 24 24" class="checkbox-icon">
        <path
          stroke-linejoin="round"
          stroke-linecap="round"
          stroke-width="3"
          stroke="currentColor"
          d="M4 12L10 18L20 6"
          class="check-path"
        ></path>
      </svg>
    </div>
    <span>Blauw</span>  <!-- 👈 tekst naast de checkbox -->
  </label>

  <label class="ios-checkbox green">
    <input type="checkbox" value="green" />
    <div class="checkbox-wrapper">
      <div class="checkbox-bg"></div>
      <svg fill="none" viewBox="0 0 24 24" class="checkbox-icon">
        <path
          stroke-linejoin="round"
          stroke-linecap="round"
          stroke-width="3"
          stroke="currentColor"
          d="M4 12L10 18L20 6"
          class="check-path"
        ></path>
      </svg>
    </div>
    <span>Groen</span>
  </label>

  <label class="ios-checkbox red">
    <input type="checkbox" value="red" />
    <div class="checkbox-wrapper">
      <div class="checkbox-bg"></div>
      <svg fill="none" viewBox="0 0 24 24" class="checkbox-icon">
        <path
          stroke-linejoin="round"
          stroke-linecap="round"
          stroke-width="3"
          stroke="currentColor"
          d="M4 12L10 18L20 6"
          class="check-path"
        ></path>
      </svg>
    </div>
    <span>Rood</span>
  </label>
</div>

`;
//#endregion TEMPLATE

//#region CLASS
window.customElements.define(
  "color-picker-ɠ",
  class extends HTMLElement {
    constructor() {
      super();
      this._shadowRoot = this.attachShadow({ mode: "open" });
      this._shadowRoot.appendChild(template.content.cloneNode(true));
      this.$example = this._shadowRoot.querySelector(".color-picker");
    }

    // component attributes
    static get observedAttributes() {
      return [];
    }

    attributeChangedCallback(name, oldValue, newValue) {}

    connectedCallback() {
      const checkboxes = this._shadowRoot.querySelectorAll(
        'input[type="checkbox"]',
      );

      checkboxes.forEach((checkbox) => {
        checkbox.addEventListener("change", () => {
          // Alle geselecteerde kleuren ophalen
          const selectedColors = Array.from(checkboxes)
            .filter((cb) => cb.checked)
            .map((cb) => cb.value);

          // Custom event maken
          const event = new CustomEvent("colorChange", {
            detail: { colors: selectedColors },
            bubbles: true,
            composed: true,
          });

          // Dispatchen (versturen) vanaf het component
          this.dispatchEvent(event);
        });
      });
    }
  },
);
//#endregion CLASS
