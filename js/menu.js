/* =======================================================
   SteamStorage — Menu & interactions
   ======================================================= */

(function () {
    'use strict';

    // ---------- Active menu state ----------
    const menuLinks = document.querySelectorAll('.menu a');
    const centerHeader = document.querySelector('.center-header');
    const menuToggle = document.querySelector('.menu-toggle');

    menuLinks.forEach(item => {
        item.addEventListener('click', () => {
            menuLinks.forEach(m => m.classList.remove('active'));
            item.classList.add('active');
            if (centerHeader) centerHeader.classList.remove('open');
            if (menuToggle)  menuToggle.classList.remove('open');
        });
    });

    // ---------- Mobile menu toggle ----------
    if (menuToggle && centerHeader) {
        menuToggle.addEventListener('click', () => {
            centerHeader.classList.toggle('open');
            menuToggle.classList.toggle('open');
        });

        document.addEventListener('click', (e) => {
            if (!centerHeader.contains(e.target) &&
                !menuToggle.contains(e.target) &&
                centerHeader.classList.contains('open')) {
                centerHeader.classList.remove('open');
                menuToggle.classList.remove('open');
            }
        });
    }

    // ---------- Sync active nav with iframe URL on load ----------
    // Frames post their filename via postMessage — more reliable than
    // reading contentWindow.location (blocked in some file:// contexts).
    window.addEventListener('message', (e) => {
        const page = e.data && e.data.activePage;
        if (!page) return;
        const idx = [...menuLinks].findIndex(link =>
            link.getAttribute('href').endsWith(page)
        );
        if (idx >= 0) {
            menuLinks.forEach(m => m.classList.remove('active'));
            menuLinks[idx].classList.add('active');
        }
    });

    function syncActiveNav(iframe) {
        try {
            const src = iframe.contentWindow.location.href;
            const idx = [...menuLinks].findIndex(link =>
                src.includes(link.getAttribute('href').split('/').pop())
            );
            if (idx >= 0) {
                menuLinks.forEach(m => m.classList.remove('active'));
                menuLinks[idx].classList.add('active');
            }
        } catch (_) {}
    }

    // ---------- Card mouse-tracking glow ----------
    function attachGlow(root) {
        root.querySelectorAll('.feature-card, .contact-card').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
                card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
            });
        });
    }
    attachGlow(document);

    document.querySelectorAll('iframe').forEach(iframe => {
        iframe.addEventListener('load', () => {
            syncActiveNav(iframe);
            try {
                const doc = iframe.contentDocument;
                if (doc) attachGlow(doc);
            } catch (_) {}
        });
    });
})();
