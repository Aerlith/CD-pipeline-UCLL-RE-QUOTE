// components/QuickStats.js
import { Quote } from '../utils/quote.js';
import { t, setLanguage, getCurrentLanguage } from '/utils/i18n.js';

let template = document.createElement('template');
template.innerHTML = /* html */ `
<style> @import './templates/component/quickStats.css';</style>
<div class="statistics-section">
    <div class="language-switcher">
        <button id="lang-nl">🇳🇱 Nederlands</button>
        <button id="lang-en">🇬🇧 English</button>
    </div>

    <h2 id="title"></h2>

    <h3 id="pending-title"></h3>
    <div id="pending-list" class="offer-list pending-offers"></div>

    <h3 id="approved-title"></h3>
    <div id="recently-approved-list" class="offer-list recent-quotes"></div>

    <h3 id="count-title"></h3>
    <div id="all-quote-list" class="offer-list all-quotes"></div>

    <h3 id="sum-title"></h3>
    <div id="all-quote-money-list" class="offer-list sum-quotes"></div>

    <h3 id="avg-title"></h3>
    <div id="all-quote-average-list" class="offer-list avg-quotes"></div>
</div>
`;

window.customElements.define('quick_stats-ɦ', class extends HTMLElement {
    constructor() {
        super();
        this._shadowRoot = this.attachShadow({ mode: 'open' });
        this._shadowRoot.appendChild(template.content.cloneNode(true));
        this._quotes = [];
    }

    connectedCallback() {
        this._shadowRoot.getElementById('lang-nl').addEventListener('click', () => this.changeLang('nl'));
        this._shadowRoot.getElementById('lang-en').addEventListener('click', () => this.changeLang('en'));

        const savedLang = localStorage.getItem('lang') || 'nl';
        this.changeLang(savedLang);

        // Fetch the quotes from the backend API
        fetch('/api/quotes')
            .then(response => {
                if (!response.ok) throw new Error('Failed to load quotes');
                return response.text(); // Use text() first to log the raw response
            })
            .then(data => {
                try {
                    const parsedData = JSON.parse(data); // Parse the response to JSON
                    const parsedQuotes = parsedData.map(item => {
                        // Now, item is already the quote data, no need to access item.doc
                        const quoteData = item; // Directly use item as quoteData

                        const quote = new Quote(
                            quoteData.customerName, // customerName
                            quoteData.customerAddress, // customerAddress
                            quoteData.quoteDate, // quoteDate
                            quoteData.expirationDate, // expirationDate
                            quoteData.status // Status (Pending or another value)
                        );

                        // Add items (ensure it's an array)
                        if (quoteData.items && Array.isArray(quoteData.items)) {
                            quoteData.items.forEach(item => {
                                quote.addItem(item.description, item.unitPrice, item.quantity);
                            });
                        }

                        return quote;
                    });

                    this.quotes = parsedQuotes;
                    this.render();
                } catch (err) {
                    console.error('Error parsing JSON:', err);
                }
            })
            .catch(err => console.error('Error loading quotes:', err));

    }

    async changeLang(lang) {
        await setLanguage(lang);
        localStorage.setItem('lang', lang);
        this.updateText();
        this.render();
    }

    updateText() {
        this._shadowRoot.getElementById('title').textContent = t('statsTitle');
        this._shadowRoot.getElementById('pending-title').textContent = t('pendingQuotes');
        this._shadowRoot.getElementById('approved-title').textContent = t('recentApprovedQuotes');
        this._shadowRoot.getElementById('count-title').textContent = t('totalQuotes');
        this._shadowRoot.getElementById('sum-title').textContent = t('totalValue');
        this._shadowRoot.getElementById('avg-title').textContent = t('averageValue');
    }

    set quotes(data) {
        this._quotes = data;
        this.render();
    }

    render() {
        const $ = id => this._shadowRoot.getElementById(id);

        // Pending quotes
        const pendingList = $('pending-list');
        const pendingQuotes = this._quotes.filter(q => q.getStatus() === 'Pending');
        pendingList.innerHTML = pendingQuotes.length === 0
            ? `<div class="offer-card">${t('noPendingQuotes')}</div>`
            : pendingQuotes.map(q => `
            <div class="offer-card">
                <strong>${q.customerName}</strong>
                <p>${t('date')}: ${q.quoteDate}</p>
                <p>${t('total')}: €${q.getTotal().toFixed(2)}</p>
            </div>
        `).join('');

        // Recently approved quotes
        const approvedList = $('recently-approved-list');
        const approvedQuotes = this._quotes.filter(q => q.getStatus() === 'Recently approved');
        approvedList.innerHTML = approvedQuotes.length === 0
            ? `<div class="offer-card">${t('noRecentApproved')}</div>`
            : approvedQuotes.map(q => `
            <div class="offer-card">
                <strong>${q.customerName}</strong>
                <p>${t('date')}: ${q.quoteDate}</p>
                <p>${t('total')}: €${q.getTotal().toFixed(2)}</p>
            </div>
        `).join('');

        // Total count
        const allQuoteList = $('all-quote-list');
        allQuoteList.innerHTML = this._quotes.length === 0
            ? `<div class="offer-card">${t('noQuotes')}</div>`
            : `<div class="offer-card"><strong>${this._quotes.length} ${t('quotes')}</strong></div>`;

        // Total value
        const sumOfMoney = this._quotes.reduce((sum, x) => sum + x.getTotal(), 0);
        const allQuoteMoneyList = $('all-quote-money-list');
        allQuoteMoneyList.innerHTML = `<div class="offer-card"><strong>€${sumOfMoney.toFixed(2)}</strong></div>`;

        // Average
        const average = this._quotes.length > 0 ? sumOfMoney / this._quotes.length : 0;
        const allQuoteAverageList = $('all-quote-average-list');
        allQuoteAverageList.innerHTML = `<div class="offer-card"><strong>€${average.toFixed(2)}</strong></div>`;
    }


    navigate(_) {
        this.dispatchEvent(new CustomEvent('ʤ', {
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

    attributeChangedCallback(name, oldValue, newValue) { }
});
//#endregion CLASS

//#region TESTDATA & USAGE
const q2 = new Quote("Liam Janssens", "Kerkstraat 45, Brugge", "2025-02-28", "2025-03-28");
q2.addItem("Consulting", 500, 1);
q2.setStatus("Pending");

const q1 = new Quote("Ian Shmian", "Banaanlaan 45, Brussel", "2025-04-01", "2025-04-30");
q1.addItem("Consulting", 200, 5);
q1.setStatus("Recently approved");

const q3 = new Quote("bqbqbqbqb Shmian", "Banaanlaan 45, Brussel", "2025-04-01", "2025-04-30");
q3.addItem("Consulting", 200, 5);
q3.setStatus("Recently approved");

const q4 = new Quote("bart de wever", "Banaanlaan 45, Brussel", "2025-04-01", "2025-04-30");
q4.addItem("Consulting", 200, 5);
q4.setStatus("Recently approved");

// const quickStatsEl = document.createElement('quick_stats-ɦ');
// document.body.appendChild(quickStatsEl);
// quickStatsEl.quotes = [q1, q2, q3, q4];
//#endregion TESTDATA & USAGE
