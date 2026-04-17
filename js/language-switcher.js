const langLinks = document.querySelectorAll('.lang-switch');
const currentPage = window.location.pathname.split('/').pop() || 'index.html';

langLinks.forEach(link => {
    const lang = link.dataset.lang;
    link.href = `../${lang}/${currentPage}`;
});