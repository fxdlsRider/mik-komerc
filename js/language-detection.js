// Automatic language detection - only on root/index page
const browserLang = navigator.language.slice(0, 2);
const supportedLangs = ['en', 'de', 'sr'];
const savedLang = localStorage.getItem('mik_lang');

if (!savedLang) {
    const targetLang = supportedLangs.includes(browserLang) ? browserLang : 'en';
    localStorage.setItem('mik_lang', targetLang);
}