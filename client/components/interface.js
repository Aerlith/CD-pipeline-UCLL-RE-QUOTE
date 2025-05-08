let template = document.createElement('template');
import { t, setLanguage, getCurrentLanguage } from '../utils/i18n.js';
import { Quote } from '../utils/quote.js';
template.innerHTML = /* html */ `
<style>
 @import './templates/component/interface.css';
</style>

<div class="language-switcher">
  <button class="lang-nl">🇳🇱 Nederlands</button>
  <button class="lang-en">🇬🇧 English</button>
</div>

<div class="form-container">
  <form id="quoteForm">
    <label for="customerName">${t('customerName')}:</label>
    <input type="text" id="customerName" required />

    <label for="customerAdress">${t('adress')}:</label>
    <input type="text" id="customerAdress" required />

    <label for="quoteDate">${t('quoteDate')}:</label>
    <input type="date" id="quoteDate" required />

    <label for="expirationDate">${t('quoteValidUntil')}:</label>
    <input type="date" id="expirationDate" required />

    <div id="dienstenContainer">
    <!-- standaard eerste regel -->
    <div class="dienst-row">
    <label>${t('service')}:</label>
        <select class="service" required>
          <option value="">${t('choose-service')}</option>
          <option>85</option>
          <option>api-calls</option>
          <option>backups</option>
          <option>bevraging</option>
          <option>cms</option>
          <option>content updates</option>
          <option>${t('database')}</option>
          <option>dataviz</option>
          <option>${t('domain')}</option>
          <option>dynamic</option>
          <option>e-commerce</option>
          <option>${t('hosting')}</option>
          <option>${t('internationalisation')}</option>
          <option>logging & reporting (stats)</option>
          <option>maat</option>
          <option>mailer</option>
          <option>static</option>
          <option>template</option>
          <option>user management</option>
          <option>web builder</option>
          <option>(${t('empty')})</option>
        </select>
        <label>${t('unit')}:</label>
        <select class="unit">
          <option>${t('day')}</option>
          <option>${t('month')}</option>
          <option>${t('year')}</option>
        </select>
         <!-- Voeg het aantal veld toe -->
          <label>${t('amount')}:</label>
          <input type="number" class="aantal" min="1" value="1" required />
      </div>
    </div>
    <button type="button" id="addDienstBtn">+</button>
    <button type="submit">${t('genQuote')}</button>
  </form>

  
  </div>
  <div id="result"></div>

`;
//#endregion TEMPLATE

//#region CLASS

window.customElements.define('interface-ɦ', class extends HTMLElement {
    constructor() {
        super();
        this._shadowRoot = this.attachShadow({ 'mode': 'open' });
        this._shadowRoot.appendChild(template.content.cloneNode(true));

        // Set the default language to Dutch
        setLanguage('nl').then(() => {
            this.updateContent();
        });

        // Add event listeners for language buttons
        const langNlButton = this._shadowRoot.querySelector('.lang-nl');
        const langEnButton = this._shadowRoot.querySelector('.lang-en');

        langNlButton.addEventListener('click', async () => {
            if (getCurrentLanguage() !== 'nl') {
                await setLanguage('nl');  // wacht op vertaling
                this.updateContent();
            }
        });

        langEnButton.addEventListener('click', async () => {
            if (getCurrentLanguage() !== 'en') {
                await setLanguage('en');  // wacht op vertaling
                this.updateContent();
            }
        });

        // Initial content update
        this.updateContent();
    }

    connectedCallback() {
        this._shadowRoot.innerHTML = '';
        this._shadowRoot.appendChild(template.content.cloneNode(true));

        // Dan pas selecteren
        const form = this._shadowRoot.querySelector('#quoteForm');
        const result = this._shadowRoot.querySelector('#result');
        const servicesWrapper = this._shadowRoot.querySelector('#servicesWrapper');


        const tarieven = {
            '85': 1000, 'api-calls': 250, 'backups': 0, 'bevraging': 250,
            'cms': 3000, 'content updates': 83, 'databank': 500, 'dataviz': 500,
            'domein': 50, 'dynamic': 0, 'e-commerce': 0, 'hosting': 0,
            'internatiolisering': 0, 'logging & reporting (stats)': 0,
            'maat': 0, 'mailer': 1000, 'static': 1000, 'template': 1000,
            'user management': 3000, 'web builder': 1000, '(leeg)': 0
        };
        const langNlButton = this._shadowRoot.querySelector('.lang-nl');
        const langEnButton = this._shadowRoot.querySelector('.lang-en');

        // Stel de taal in bij klikken
        langNlButton.addEventListener('click', () => {
            setLanguage('nl');  // Stel de taal in op Nederlands
            this.updateContent();
        });

        langEnButton.addEventListener('click', () => {
            setLanguage('en');  // Stel de taal in op Engels
            this.updateContent();
        });

        const addBtn = this._shadowRoot.querySelector('#addDienstBtn');
        const dienstenContainer = this._shadowRoot.querySelector('#dienstenContainer');

        addBtn.addEventListener('click', () => {
            const dienstRow = document.createElement('div');
            dienstRow.classList.add('dienst-row');
            dienstRow.innerHTML = `
              <label>${t('service')}:</label>
             <select class="service">
                 <option value="">${t('choose-service')}</option>
                 <option>85</option>
                 <option>api-calls</option>
                 <option>backups</option>
                 <option>bevraging</option>
                 <option>cms</option>
                 <option>content updates</option>
                 <option>${t('database')}</option>
                 <option>dataviz</option>
                 <option>${t('domain')}</option>
                <option>dynamic</option>
                 <option>e-commerce</option>
                 <option>${t('hosting')}</option>
                 <option>${t('internationalisation')}</option>
                  <option>logging & reporting (stats)</option>
                  <option>maat</option>
                  <option>mailer</option>
                  <option>static</option>
                  <option>template</option>
                  <option>user management</option>
                 <option>web builder</option>
                  <option>(${t('empty')})</option>
        </select>
        
              <label>${t('unit')}:</label>
              <select class="unit">
                <option>${t('day')}</option>
                <option>${t('month')}</option>
                <option>${t('year')}</option>
              </select>

                 <label>${t('amount')}:</label>
                 <input type="number" class="aantal" value="1" min="1" />

              <button class="removeDienstBtn">Verwijder Dienst</button> <!-- Verwijderknop toegevoegd -->
            `;
            dienstenContainer.appendChild(dienstRow);
            const removeDienstBtn = dienstRow.querySelector('.removeDienstBtn');
            removeDienstBtn.addEventListener('click', () => {
                dienstRow.remove(); // Verwijdert de dienstregel uit de DOM
            });
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const klant = this._shadowRoot.querySelector('#customerName').value;
            const adres = this._shadowRoot.querySelector('#customerAdress').value;
            const datum = this._shadowRoot.querySelector('#quoteDate').value;
            const geldigTot = this._shadowRoot.querySelector('#expirationDate').value;
            /* const dienst = this._shadowRoot.querySelector('#service').value;
            const eenheid = this._shadowRoot.querySelector('#unit').value; */

            const quote = new Quote(klant, adres, datum, geldigTot);


            const dienstRijen = this._shadowRoot.querySelectorAll('.dienst-row');

            let dienstenHTML = '';

            let totaalExcl = 0;

            dienstRijen.forEach(row => {
                const dienst = row.querySelector('.service').value;
                const eenheid = row.querySelector('.unit').value;
                const aantal = parseInt(row.querySelector('.aantal')?.value || '1');
                const tariefPerStuk = tarieven[dienst] || 0;

                quote.addItem(dienst, tariefPerStuk, aantal);
                const totaal = quote.getTotal();

                dienstenHTML += `
            <tr>
                <td>${dienst}</td>
                <td>€${tariefPerStuk.toFixed(2)} / ${aantal}</td>
                <td>21%</td>
                <td>€${totaal} / ${eenheid}</td>
            </tr>`;
            });
            const offerteDiv = document.createElement('div');
            offerteDiv.classList.add('offerte-item');
            // Maak een nieuw div element voor elke nieuwe offerte
            // Maak de JSON voor de offerte
            const offerteData = {
                customerName: quote.customerName,
                customerAddress: quote.customerAdress,
                quoteDate: quote.quoteDate,
                expirationDate: quote.expirationDate,
                status: quote.getStatus(),
                items: quote.items,
                discount: quote.discount,
                subtotal: quote.getSubtotalAfterDiscount().toFixed(2), // Subtotal after discount (without tax)
                tax: quote.getTax().toFixed(2), // Tax calculated here
                total: quote.getTotal().toFixed(2) // Total including tax
            };


            // Verstuur de JSON naar CouchDB
            fetch('/api/save-offerte', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(offerteData)
            })
                .then(response => response.json())
                .then(data => {
                    alert('Offerte succesvol opgeslagen!');
                    console.log('Server response:', data);
                })
                .catch(error => {
                    console.error('Er ging iets mis:', error);
                });

            offerteDiv.innerHTML = `
                    <div class="offerte-layout">
                        <div class="offerte-header">
                            <h1>${t('QUOTE')}</h1>
                            <img src="./img/downloads.png" alt="UCLL" height="60">
                        </div>
        
                        <div class="offerte-info">
                            <p><strong>${t('to')}</strong><br>${klant}<br>${adres}</p>
                            <p><strong>${t('quoteDate')}:</strong> ${datum}</p>
                            <p><strong>${t('quoteValidUntil')}:</strong> ${geldigTot}</p>
                        </div>
        
                        <table>
                        <thead>
                            <tr>
                                <th>${t('service')}</th>
                                <th>${t('tariff')}</th>
                                <th>${t('vat')}</th>
                                <th>${t('sum')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${dienstenHTML}
                        </tbody>
                    </table>
                            <p><strong>${t('totalExclVAT')}:</strong> €${totaalExcl.toFixed(2)}</p>
                            <p><strong>${t('vat21')}:</strong> €${quote.getTax().toFixed(2)}</p>
                            <p><strong>${t('totalInclVAT')}:</strong> €${quote.getTotal()}</p>
                            <p style="margin-top:20px;">${t('attachedTerms')}</p>
        
                        <div class="signatures">
                            <div>
                                 ${t('forApprovalClient')}
                                <div class="subtext">${t('datePlace')}<br>${t('nameSignature')}</div>
                            </div>
                            <div>
                                ${t('forApprovalContractor')}
                                <div class="subtext">${t('datePlace')}<br>${t('nameSignature')}</div>         
                  </div>
            </div>
        <div class="article">
            <h1>${t('generalConditions')}</h1>

            <p>${t('before')}</strong><br />
               ${t('ucLimburgDescription')}

            <p>${t('inTheseTermsMeaning')}:</p>
            <ul>
                <li><strong>${t('services')}:</strong>${t('ucLimburgServicesDescription')}.</li>
                <li><strong>${t('products')}:</strong>${t('ucLimburgProductsDescription')}.</li>
                <li><strong>${t('client')}:</strong>${t('ucLimburgClientDescription')}.</li>
            </ul>

            <p><strong>${t('article1')}</strong></p>
            <p>${t('article1Text')}.</p>

            <p><strong>${t('article2')}</strong></p>
            <p><strong>2.1.</strong> ${t('offerConditions')}.</p>
            <p><strong>2.2.</strong> ${t('orderConfirmation')}.</p>
            <p><strong>2.3.</strong> ${t('cancellationPolicy')}.</p>
            <p><strong>2.4.</strong> ${t('terminationRights')}.</p>

            <p><strong>${t('article3Execution')}</strong></p>
            <p><strong>3.1.</strong> ${t('executionCare')}.</p>
            <p><strong>3.2.</strong> ${t('clientData')}.</p>
            <p><strong>3.3.</strong> ${t('partialDeliveries')}.</p>

            <p><strong>${t('article4ExecutionPlace')}</strong></p>
            <p>${t('executionLocationClient')}.</p>
            <p>${t('executionLocationUCLL')}.</p>

            <p><strong></strong></p>
            <p><strong>5.1.</strong> ${t('article5_paragraph1')}.</p>
            <p><strong>5.2.</strong> ${t('article5_paragraph2')}.</p>
            <p><strong>5.3.</strong> ${t('article5_paragraph3')}.</p>
            <p><strong>5.4.</strong> ${t('article5_paragraph4')}.</p>

            <p><strong>${t('article6_title')}</strong></p>
            <p><strong>6.1.</strong> ${t('article6_paragraph1')}.</p>
            <p><strong>6.2.</strong> ${t('article6_paragraph2')}.</p>
            <p><strong>6.3.</strong> ${t('article6_paragraph3')}.</p>
            <p><strong>6.4.</strong> ${t('article6_paragraph4')}.</p>
            <p><strong>6.5.</strong> ${t('article6_paragraph5')}.</p>
            <p><strong>${t('article7_title')}</strong></p>
            <p>${t('article7_paragraph1')}.</p>

            <p><strong>${t('article8_title')}</strong></p>
            <p><strong>8.1.</strong> ${t('article8_paragraph1')}</p>
            <p><strong>8.2.</strong> ${t('article8_paragraph2')}</p>
            <p><strong>8.3.</strong> ${t('article8_paragraph3')}</p>
            <p><strong>8.4.</strong> ${t('article8_paragraph4')}</p>
            <p><strong>8.5.</strong> ${t('article8_paragraph5')}</p>
            <p><strong>8.6.</strong> ${t('article8_paragraph6_intro')}</p>
        <ul>
             <li>${t('article8_paragraph6_bullet1')}</li>
            <li>${t('article8_paragraph6_bullet2')}</li>
        </ul>
            <p><strong>8.7.</strong> ${t('article8_paragraph7')}</p>

            <p><strong>${t('article9_title')}</strong></p>
            <p><strong>9.1.</strong> ${t('article9_paragraph1')}</p>
            <p><strong>9.2.</strong> ${t('article9_paragraph2')}</p>
            <p><strong>9.3.</strong> ${t('article9_paragraph3')}</p>
            <p><strong>9.4.</strong> ${t('article9_paragraph4')}</p>
            <p><strong>9.5.</strong> ${t('article9_paragraph5')}</p>

            <p><strong>${t('article10_title')}</strong></p>
            <p><strong>10.1.</strong> ${t('article10_paragraph1')}</p>  
            <p><strong>10.2.</strong> ${t('article10_paragraph2')}</p>
            <p><strong>10.3.</strong> ${t('article10_paragraph3')}</p>
            <p><strong>10.4.</strong> ${t('article10_paragraph4')}</p>

            <p><strong>${t('article11_title')}</strong></p>
            <p>${t('article11_intro')}</p>
        <ul>
            <li>${t('article11_bullet1')}</li>
            <li>${t('article11_bullet2')}</li>
            <li>${t('article11_bullet3')}</li>
        </ul>
            <p>${t('article11_confidentiality_duration')}</p>
            <p>${t('article11_exceptions_intro')}</p>
        <ul>
            <li>${t('article11_exception1')}</li>
            <li>${t('article11_exception2')}</li>
            <li>${t('article11_exception3')}</li>
            <li>${t('article11_exception4')}</li>
            <li>${t('article11_exception5')}</li>
        </ul>
            <p><strong>${t('article12_title')}</strong></p>
            <p><strong>12.1.</strong> ${t('article12_paragraph1')}</p>
            <p><strong>12.2.</strong> ${t('article12_paragraph2')}</p>
            <p><strong>12.3.</strong> ${t('article12_paragraph3')}</p>

            <p><strong>${t('article13_title')}</strong></p>
            <p>${t('article13_intro1')}</p>
            <p>${t('article13_intro2')}</p>
            <p>${t('article13_intro3')}</p>
            <p>${t('article13_list_intro')}</p>
        <ul>
            <li>${t('article13_bullet1')}</li>
            <li>${t('article13_bullet2')}</li>
            <li>${t('article13_bullet3')}</li>
            <li>${t('article13_bullet4')}</li>
            <li>${t('article13_bullet5')}</li>
            <li>${t('article13_bullet6')}</li>
             <li>${t('article13_bullet7')}</li>
        </ul>
            <p>${t('article13_instruction_restriction')}</p>
        <ul>
            <li>${t('article13_scope1')}</li>
            <li>${t('article13_scope2')}</li>
            <li>${t('article13_scope3')}</li>
            <li>${t('article13_scope4')}</li>
            <li>${t('article13_scope5')}</li>
        </ul>
            <p>${t('article13_doubt_resolution')}</p>

            <p><strong>${t('article14_title')}</strong></p>
            <p>${t('article14_paragraph1')}.</p>
            <p>${t('article14_paragraph2')}.</p>

            <p><strong>${t('article15_title')}</strong></p>
            <p>${t('article15_paragraph1')}.</p>
            <p>${t('article15_paragraph2')}.</p>

            <p><strong>${t('article16_title')}</strong></p>
            <p><strong>16.1.</strong> ${t('article16_paragraph1')} .</p>
            <p><strong>16.2.</strong> ${t('article15_paragraph2')}.</p>

        </div>
                    </div >
            `;

            // Voeg de nieuwe offerte toe aan de result container
            result.appendChild(offerteDiv);

            // Reset het formulier na het toevoegen van de offerte
            form.reset();
        });
    }
    updateContent() {
        // Sla de huidige diensten op
        const dienstRijen = this._shadowRoot.querySelectorAll('.dienst-row');
        const diensten = [];

        dienstRijen.forEach(row => {
            const dienst = row.querySelector('.service').value;
            const eenheid = row.querySelector('.unit').value;
            const aantal = row.querySelector('.aantal').value;
            diensten.push({ dienst, eenheid, aantal });
        });

        // Werk de content bij met de nieuwe taal
        const customerNameLabel = this._shadowRoot.querySelector('label[for="customerName"]');
        const customerAdressLabel = this._shadowRoot.querySelector('label[for="customerAdress"]');
        const quoteDateLabel = this._shadowRoot.querySelector('label[for="quoteDate"]');
        const expirationDateLabel = this._shadowRoot.querySelector('label[for="expirationDate"]');
        const serviceLabel = this._shadowRoot.querySelector('.dienst-row label');
        const timeLabel = this._shadowRoot.querySelector('.dienst-row select');
        const quantityLabel = this._shadowRoot.querySelector('.dienst-row input');
        const addBtnText = this._shadowRoot.querySelector('#addDienstBtn');
        const submitBtnText = this._shadowRoot.querySelector('button[type="submit"]');

        // Update the labels and buttons with translated content
        customerNameLabel.textContent = t('customerName');
        customerAdressLabel.textContent = t('adress');
        quoteDateLabel.textContent = t('quoteDate');
        expirationDateLabel.textContent = t('quoteValidUntil');
        serviceLabel.textContent = t('service');
        timeLabel.textContent = t('unit');
        quantityLabel.setAttribute('placeholder', t('quantity'));
        addBtnText.textContent = t('addService');
        submitBtnText.textContent = t('genQuote');

        // Update the language buttons
        const langNlButton = this._shadowRoot.querySelector('.lang-nl');
        const langEnButton = this._shadowRoot.querySelector('.lang-en');

        langNlButton.textContent = '🇳🇱 NL';
        langEnButton.textContent = '🇬🇧 EN';

        // Verwijder alle bestaande diensten (ter voorkoming van duplicaten)
        const dienstenContainer = this._shadowRoot.querySelector('#dienstenContainer');
        dienstenContainer.innerHTML = '';  // Verwijder alle diensten uit de container

        // Voeg de opgeslagen diensten opnieuw toe
        diensten.forEach(dienst => {
            const dienstRow = document.createElement('div');
            dienstRow.classList.add('dienst-row');
            dienstRow.innerHTML = `
            <label>${t('service')}:</label>
             <select class="service" required>
          <option value="">${t('choose-service')}</option>
          <option>85</option>
          <option>api-calls</option>
          <option>backups</option>
          <option>bevraging</option>
          <option>cms</option>
          <option>content updates</option>
          <option>${t('database')}</option>
          <option>dataviz</option>
          <option>${t('domain')}</option>
          <option>dynamic</option>
          <option>e-commerce</option>
          <option>${t('hosting')}</option>
          <option>${t('internationalisation')}</option>
          <option>logging & reporting (stats)</option>
          <option>maat</option>
          <option>mailer</option>
          <option>static</option>
          <option>template</option>
          <option>user management</option>
          <option>web builder</option>
          <option>(${t('empty')})</option>
        </select>
        <label>${t('unit')}:</label>
            <select class="unit">
                <option>${t('day')}</option>
                <option>${t('month')}</option>
                <option>${t('year')}</option>
            </select>
            <label>${t('amount')}:</label>
            <input type="number" class="aantal" min="1" value="${dienst.aantal}" required />
            <button class="removeDienstBtn">${t('removeService')}</button>
        `;
            dienstenContainer.appendChild(dienstRow);

            // Voeg de verwijderknop toe
            const removeDienstBtn = dienstRow.querySelector('.removeDienstBtn');
            removeDienstBtn.addEventListener('click', () => {
                dienstRow.remove(); // Verwijder de dienst
            });

            // Stel de geselecteerde waarde van de dienst en eenheid in
            const serviceSelect = dienstRow.querySelector('.service');
            const unitSelect = dienstRow.querySelector('.unit');

            serviceSelect.value = dienst.dienst;
            unitSelect.value = dienst.eenheid;
        });
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
;;;;
