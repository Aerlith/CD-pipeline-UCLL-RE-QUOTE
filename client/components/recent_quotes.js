//#region IMPORTS
import { Quote } from '/utils/quote.js';

//#endregion IMPORTS

//#region TEMPLATE
let template = document.createElement('template');
template.innerHTML = /* html */ `
<style> @import './templates/component/style.css';</style>


<h2>Recente offertes</h2>
<ul id="quote-list"></ul>
`;
//#endregion TEMPLATE

//#region CLASS
window.customElements.define('recent_quotes-ɦ', class extends HTMLElement {
  constructor() {
    super();
    this._shadowRoot = this.attachShadow({ 'mode': 'open' });
    this._shadowRoot.appendChild(template.content.cloneNode(true));

    // route element als dependency
    // router = inject router
    // router.bindRoutes(this);
    // links moeten met <a route"=/example">element</a>
    this._quotes = [];
  }

  connectedCallback() {
  }

  set quotes(data) {
    this._quotes = data;
    this.render();
  }

  render() {
    const list = this._shadowRoot.getElementById('quote-list');
    list.innerHTML = '';

    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const recentQuotes = this._quotes.filter(q =>
      new Date(q.quoteDate) > oneMonthAgo
    );

    if (recentQuotes.length === 0) {
      list.innerHTML = '<li>No recent quotes found.</li>';
      return;
    }

    for (const quote of recentQuotes) {
      const li = document.createElement('li');
      li.innerHTML = `
            <strong>${quote.customerName}</strong><br>
            Date: ${quote.quoteDate}<br>
            Status: ${quote.getStatus()}<br>
            Total: $${quote.getTotal().toFixed(2)}
          `;
      list.appendChild(li);
    }
  }

  navigate(_) {
    console.log(_);
    this.dispatchEvent(new CustomEvent('ʤ',
      {
        bubbles: true,
        cancelable: false,
        composed: true,
        detail: {
          channel: "go",
          data: _
        }
      }));
  }

  static get observedAttributes() {
    return [];
  }

  attributeChangedCallback(name, oldValue, newValue) {

  }

});
//#endregion CLASS

//#region TEST USAGE

// Create the custom element dynamically
/*
const recentQuotesEl = document.createElement('recent_quotes-ɦ');
document.body.appendChild(recentQuotesEl); // Or use a specific container like document.getElementById('app')

// Create test quotes
const q1 = new Quote("Sophie Vermeulen", "Stationsstraat 12, Gent", "2025-04-10", "2025-05-10");
q1.addItem("Webdesign", 750, 1);
q1.addItem("Onderhoud", 60, 2);
q1.setDiscount(10);
q1.setStatus("Approved");

const q2 = new Quote("Liam Janssens", "Kerkstraat 45, Brugge", "2025-02-28", "2025-03-28");
q2.addItem("Consulting", 500, 1);
q2.setStatus("Pending");

// Set quotes into the component
recentQuotesEl.quotes = [q1, q2];
*/
//#endregion TEST USAGE