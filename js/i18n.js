const STORAGE_KEY = 'mik_lang';

function getLang() {
    return localStorage.getItem(STORAGE_KEY) || 'en';
}

function resolve(obj, path) {
    return path.split('.').reduce((acc, key) => acc && acc[key], obj);
}

async function applyTranslations(lang) {
    const url = `../translations/${lang}.json`;
    let data;

    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Failed to load ${url}`);
        data = await res.json();
    } catch (err) {
        console.error('[i18n]', err);
        return;
    }

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const value = resolve(data, el.dataset.i18n);
        if (value !== undefined) el.textContent = value;
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const value = resolve(data, el.dataset.i18nPlaceholder);
        if (value !== undefined) el.placeholder = value;
    });
}

export async function setLanguage(lang) {
    localStorage.setItem(STORAGE_KEY, lang);
    await applyTranslations(lang);
}

// Apply on load
applyTranslations(getLang());
