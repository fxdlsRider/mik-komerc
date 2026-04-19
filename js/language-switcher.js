import { setLanguage, applyTranslations, getLang } from './i18n.js';

applyTranslations(getLang());

document.querySelectorAll('.lang-switch').forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        setLanguage(link.dataset.lang);
    });
});
