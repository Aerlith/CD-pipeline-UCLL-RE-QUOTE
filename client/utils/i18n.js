let translations = {};
let currentLang = 'nl';

export async function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('lang', lang);

    try {
        const response = await fetch(`./assets/${lang}.json`);
        translations = await response.json();
    } catch (err) {
        console.warn(`Taalbestand voor "${lang}" niet gevonden, val terug op Nederlands`);
        try {
            const fallback = await fetch(`./assets/nl.json`);
            translations = await fallback.json();
        } catch (fallbackError) {
            console.error("Fallback taalbestand (nl.json) kon niet worden geladen.");
            translations = {};
        }
    }
}

export function getCurrentLanguage() {
    return currentLang;
}

export function t(key) {
    return translations[key] || key;
}
