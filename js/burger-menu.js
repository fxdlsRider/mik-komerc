const burgerBtn = document.querySelector('.burger-menu-btn');
const closeBtn = document.querySelector('.burger-close-btn');
const burgerNav = document.querySelector('.burger-nav');
const overlay = document.querySelector('.burger-overlay');

if (burgerBtn && closeBtn && burgerNav && overlay) {
    burgerBtn.addEventListener('click', () => {
        burgerNav.classList.add('open');
        overlay.classList.add('open');
    });

    closeBtn.addEventListener('click', () => {
        burgerNav.classList.remove('open');
        overlay.classList.remove('open');
    });

    overlay.addEventListener('click', () => {
        burgerNav.classList.remove('open');
        overlay.classList.remove('open');
    });
}
