document.addEventListener("DOMContentLoaded", () => {
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    const bdy = document.querySelector('body');
    const nvb = document.querySelector('.navbar');
    const nvbc = document.querySelector('.navbar-container');

    if (mobileMenu) {
        mobileMenu.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            bdy.classList.toggle('active');
            nvb.classList.toggle('active');
            nvbc.classList.toggle('active');

            // Hide the mobile menu after click
            mobileMenu.style.display = 'none';

        });

    }
    // Add event listener to navLinks to show mobileMenu again when navLinks is clicked
    if (bdy) {
        navLinks.addEventListener('click', () => {
            mobileMenu.style.display = 'block';
        });
    }



    document.querySelectorAll('.accordion-header').forEach(header => {
        header.addEventListener('click', () => {
            header.parentElement.classList.toggle('active');
        });
    });
});
