// Automatic language detection - only on root/index page
if (window.location.pathname === '/' || window.location.pathname.includes('index') && !window.location.pathname.includes('/en/') && !window.location.pathname.includes('/de/') && !window.location.pathname.includes('/sr/')) {
    const browserLang = navigator.language.slice(0, 2);
    
    const supportedLangs = ['en', 'de', 'sr'];
    const targetLang = supportedLangs.includes(browserLang) ? browserLang : 'en';
    
    window.location.replace(`/${targetLang}/index.html`);
}