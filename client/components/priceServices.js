//#region IMPORTS
//#endregion IMPORTS

//#region TEMPLATE
let template = document.createElement('template');
template.innerHTML = /*html*/`
  <style>
  .pricing-table {
    width: 80%;
    margin: 0 auto;
    border-collapse: collapse;
    font-family: Arial, sans-serif;
    background: #f9f9f9;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    overflow: hidden;
  }

  .pricing-table th, .pricing-table td {
    padding: 15px;
    text-align: left;
    border-bottom: 1px solid #ddd;
  }

  .pricing-table th {
    background-color: #002757;
    color: #fff;
    font-size: 1.2rem;
  }

  .pricing-table td {
    font-size: 1rem;
    color: #333;
  }

  .pricing-table tr:hover {
    background-color: #E30147;
    color: #fff;
    transition: background 1.5s, color 1.5s; /* Overgang van 1.5 seconden */
  }

  .title {
    text-align: center;
    font-size: 2rem;
    margin-bottom: 20px;
    color: #002757;
  }
</style>

<div class="title">Prijzen en Diensten</div>
<table class="pricing-table">
  <thead>
    <tr>
      <th>Dienst</th>
      <th>Prijs per stuk (€)</th>
    </tr>
  </thead>
  <tbody>
   <tr><td>85</td><td>1000</td></tr>
    <tr><td>API Calls</td><td>250</td></tr>
    <tr><td>Backups</td><td>0</td></tr>
    <tr><td>Bevraging</td><td>250</td></tr>
    <tr><td>CMS</td><td>3000</td></tr>
    <tr><td>Content Updates</td><td>83</td></tr>
    <tr><td>Databank</td><td>500</td></tr>
    <tr><td>Dataviz</td><td>500</td></tr>
    <tr><td>Domein</td><td>50</td></tr>
    <tr><td>Dynamic</td><td>0</td></tr>
    <tr><td>e-commerce</td><td>0</td></tr>
    <tr><td>Hosting</td><td>0</td></tr>
    <tr><td>Internatiolisering</td><td>0</td></tr>
    <tr><td>Logging & reporting (stats)</td><td>0</td></tr>
    <tr><td>Maat</td><td>0</td></tr>
    <tr><td>Mailer</td><td>1000</td></tr>
    <tr><td>Static</td><td>1000</td></tr>
    <tr><td>Template</td><td>1000</td></tr>
    <tr><td>User Management</td><td>3000</td></tr>
    <tr><td>Web Builder</td><td>1000</td></tr>
  </tbody>
</table>

`;
//#endregion TEMPLATE

//#region CLASS
window.customElements.define('price-services-ɦ', class extends HTMLElement {
    constructor() {
        super();
        this._shadowRoot = this.attachShadow({ 'mode': 'open' });
        this._shadowRoot.appendChild(template.content.cloneNode(true));
    }

    static get observedAttributes() {
        return [];
    }

    attributeChangedCallback(name, oldValue, newValue) { }

    connectedCallback() { }
});
//#endregion CLASS
