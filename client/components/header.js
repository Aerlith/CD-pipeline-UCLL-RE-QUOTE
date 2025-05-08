//#region IMPORTS
import './interface.js';
import './priceServices.js';
//#endregion IMPORTS

//#region TEMPLATE
let template = document.createElement('template');
template.innerHTML = /* html */ `
<style> 
.header {
  padding: 20px;
  max-width: 800px;
  margin: auto;
  background: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #002757;
  position: relative;
}

.center-text {
  flex: 1;
  text-align: center;
  font-size: 1.5rem;
  font-weight: bold;
}

.logo-container {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}

.logo-container img {
  height: 50px;
  width: auto;
}

nav {
  flex: 1;
  text-align: center;
  margin-top: 10px;
}

nav ul {
  list-style: none;
  display: flex;
  justify-content: center;
  gap: 20px;
  padding: 0;
}

nav a {
  text-decoration: none;
  font-weight: bold;
  color: #002757;
  padding: 5px 10px;
  border: 2px solid #002757;
  border-radius: 5px;
  transition: background 0.3s, color 0.3s;
}

nav a:hover {
  background: #E30147;
  color: #fff;
}

nav a.active {
  background: #002757;
  color: #fff;
}

/* Dynamische content sectie */
#content {
  margin-top: 20px;
  text-align: center; /* Centraal uitlijnen van de tekst */
}

#dynamic-text {
  font-size: 2rem; /* Grotere tekst */
  color: #002757; /* Kleur van de tekst */
  font-family: 'Arial', sans-serif; /* Specifiek lettertype */
  font-weight: bold; /* Vetgedrukte tekst */
  text-transform: uppercase; /* Optioneel: Maakt de tekst hoofdletters */
  margin-top: 50px; /* Wat extra ruimte boven de tekst */
}
</style>

<header class="header">
 <div class="center-text">
    <p>Dit is een Offertegenerator</p>
  </div>
  <div class="logo-container">
<img src="./img/image.png" alt="">
</div>
</header>
   <nav>
      <ul>
        <li><a href="#" route="/">Recente offertes</a></li>
        <li><a href="#" route="/about">Interface</a></li>
        <li><a href="#" route="/contact">Nieuwe klant</a></li>
        <li><a href="#" route="/faq">Overzicht klant</a></li>
        <li><a href="#" route="/price">Dienst prijzen</a></li>
      </ul>
    </nav>
  <section id="content">
  <p id="dynamic-text">Welkom op de homepagina!</p></section>
`;
//#endregion TEMPLATE

//#region CLASS

window.customElements.define('header-ɦ', class extends HTMLElement {
    constructor() {
        super();
        this._shadowRoot = this.attachShadow({ 'mode': 'open' });
        this._shadowRoot.appendChild(template.content.cloneNode(true));

        // route element als dependency
        // router = inject router
        // router.bindRoutes(this);
        // links moeten met <a route"=/example">element</a>
    }

    connectedCallback() {
        const links = this._shadowRoot.querySelectorAll('nav a');
        const dynamicContent = this._shadowRoot.querySelector('#content');


        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();

                const route = link.getAttribute('route');
                dynamicContent.innerHTML = ''; // Verwijder altijd de bestaande inhoud

                if (route === '/about') {
                    const interfaceElement = document.createElement('interface-ɦ');
                    dynamicContent.appendChild(interfaceElement);
                } else if (route === '/') {
                    const defaultWidgets = document.createElement('div');
                    defaultWidgets.innerHTML = `<recent_quotes-ɦ></recent_quotes-ɦ><quick_stats-ɦ></quick_stats-ɦ>`;
                    dynamicContent.appendChild(defaultWidgets);
                } else if (route === '/contact') {
                    const newCustomer = document.createElement('new-customer-ɦ');
                    dynamicContent.appendChild(newCustomer);
                } else if (route === '/faq') {
                    const faqContent = document.createElement('overview-customer-ɦ');
                    dynamicContent.appendChild(faqContent);
                }
                else if (route === '/price') {
                    const faqContent = document.createElement('price-services-ɦ');
                    dynamicContent.appendChild(faqContent);
                }

                links.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            });
        });
    }

    static get observedAttributes() {
        return [];
    }

    attributeChangedCallback(name, oldValue, newValue) {

    }
    navigate(route) {
        console.log(route);
        this.dispatchEvent(new CustomEvent('ʤ', {
            bubbles: true,
            cancelable: false,
            composed: true,
            detail: {
                channel: "go",
                data: route
            }
        }));
    }
});

//#endregion CLASS