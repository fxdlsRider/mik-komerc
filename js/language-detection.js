// Automatic language detection - only on root/index page
const browserLang = navigator.language.slice(0, 2);
const supportedLangs = ['en', 'de', 'sr', 'sh', 'bs', 'hr'];
const savedLang = localStorage.getItem('mik_lang');

if (!savedLang) {
    let targetLang = 'en';
    if (['sr', 'sh', 'bs', 'hr'].includes(browserLang)) targetLang = 'sr';
    else if (browserLang === 'de') targetLang = 'de';
    localStorage.setItem('mik_lang', targetLang);
}