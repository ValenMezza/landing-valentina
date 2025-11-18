document.addEventListener("DOMContentLoaded", () => {
    const toggle = document.querySelector('.nav__toggle');
    const navList = document.querySelector('.nav__list');

    toggle.addEventListener('click', () => {
        const isOpen = navList.classList.toggle('nav__list--open');
        toggle.classList.toggle('nav__toggle--open', isOpen);
        toggle.setAttribute('aria-expanded', isOpen);
    });
});