(function () {
    var hamburger = document.getElementById('hamburger');
    var nav = document.getElementById('nav-links');
    var year = document.getElementById('year');

    if (year) year.textContent = new Date().getFullYear();
    if (!hamburger || !nav) return;

    function setMenu(open) {
        hamburger.classList.toggle('active', open);
        nav.classList.toggle('show', open);
        hamburger.setAttribute('aria-expanded', String(open));
        hamburger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
        document.body.style.overflow = open ? 'hidden' : '';
    }

    hamburger.addEventListener('click', function () {
        setMenu(!nav.classList.contains('show'));
    });

    nav.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () { setMenu(false); });
    });

    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && nav.classList.contains('show')) {
            setMenu(false);
            hamburger.focus();
        }
    });
}());
