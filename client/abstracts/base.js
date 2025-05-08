export class base extends HTMLElement {
  async connectedCallback() {
    // await this.init(); // pre-hiook
    this._shadowRoot = this.attachShadow({ mode: "open" });
    // this._shadowRoot.appendChild(await getStyle('/css/shared.css')); // for cached styles
    this._shadowRoot.appendChild(this.temp.content.cloneNode(true));
    // this._setupBindings(); // see binding (2-way)
    let i18n = this.getAttribute("i18n");
    if (i18n) {
      console.log("base i18n LAUNCHED", i18n);
      queueMicrotask(() => {
        this.dispatchEvent(
          new CustomEvent("ʤ", {
            bubbles: true,
            cancelable: false,
            composed: true,
            detail: {
              channel: "i18n",
              // topic:"",
              data: (_) => {
                console.log("NOTIFIED BALLON! ", _);
                // this.$p.innerHTML = STRINGS[_]["blok1"]
                this.i18n(_);
              },
            },
          }),
        );
      });
    }
    await this.created(); // post-hook
  }

  i18n(language) {
    console.log("i18n SOURCING");
    this.findAll(".i18n").forEach((_) => {
      console.log("source" + this.id, language, _.id);
    });
  }

  find(selector) {
    return this._shadowRoot.querySelector(selector);
  }

  findAll(selector) {
    return this._shadowRoot.querySelectorAll(selector);
  }

  async init() {}
  async created() {}
}

export function define(name, classContent, template) {
  let temp = document.createElement("template");
  temp.innerHTML = template;
  classContent.prototype.temp = temp;

  window.customElements.define(name, classContent);
}
