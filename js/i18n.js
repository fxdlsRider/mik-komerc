const STORAGE_KEY = 'mik_lang';
const cache = {};

export function getLang() {
    return localStorage.getItem(STORAGE_KEY) || 'en';
}

function resolve(obj, path) {
    return path.split('.').reduce((acc, key) => acc && acc[key], obj);
}

export async function applyTranslations(lang) {
    if (!cache[lang]) {
        const url = `translations/${lang}.json`;
        try {
            const res = await fetch(url);
            if (!res.ok) throw new Error(`Failed to load ${url}`);
            cache[lang] = await res.json();
        } catch (err) {
            console.error('[i18n]', err);
            return;
        }
    }

    const data = cache[lang];

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
    document.documentElement.lang = lang;
    await applyTranslations(lang);
}
