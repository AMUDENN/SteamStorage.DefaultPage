window.parent.postMessage({ activePage: 'guide.html' }, '*');

(function () {
    const REPOS = {
        api:  'https://raw.githubusercontent.com/AMUDENN/SteamStorageAPI/master/README.md',
        sdk:  'https://raw.githubusercontent.com/AMUDENN/SteamStorageAPI.SDK/master/README.md',
        app:  'https://raw.githubusercontent.com/AMUDENN/SteamStorage/master/README.md',
        page: 'https://raw.githubusercontent.com/AMUDENN/SteamStorage.DefaultPage/master/README.md',
    };

    const loaded = {};
    const tabs    = document.querySelectorAll('.repo-tab-btn');
    const panels  = document.querySelectorAll('.tab-panel');
    const scroller = document.querySelector('.main-content');

    // ----- Helpers -----
    function slugify(text) {
        return text.toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-+|-+$/g, '');
    }

    function stripEmojis(node) {
        if (node.nodeType === 3) {
            node.nodeValue = node.nodeValue
                .replace(/\p{Extended_Pictographic}(?:️)?(?:‍\p{Extended_Pictographic}(?:️)?)*/gu, '')
                .replace(/\s{2,}/g, ' ');
        } else if (node.nodeType === 1 && node.tagName !== 'CODE' && node.tagName !== 'PRE') {
            node.childNodes.forEach(stripEmojis);
        }
    }

    function buildNav(headings) {
        let html = '<ul class="first-level-ul">';
        let secondItems = [];
        let hasOpenLi = false;

        const flush = () => {
            if (secondItems.length) {
                html += '<ul class="second-level-ul">' +
                    secondItems.map(h => `<li><a href="#${h.id}">${h.textContent}</a></li>`).join('') +
                    '</ul>';
                secondItems = [];
            }
            html += '</li>';
        };

        Array.from(headings).forEach(h => {
            const level = parseInt(h.tagName[1]);
            if (level <= 2) {
                if (hasOpenLi) flush();
                html += `<li><a href="#${h.id}">${h.textContent}</a>`;
                hasOpenLi = true;
                secondItems = [];
            } else {
                secondItems.push(h);
            }
        });

        if (hasOpenLi) flush();
        html += '</ul>';
        return html;
    }

    // ----- Dynamic README loader -----
    async function loadTab(tabId) {
        if (loaded[tabId] || !REPOS[tabId]) return;

        const panel = document.getElementById('tab-' + tabId);
        if (!panel) return;
        const contentEl = panel.querySelector('.guide-text');
        const navEl     = panel.querySelector('.guide-navigation nav');
        if (!contentEl) return;

        contentEl.innerHTML = '<p class="md-loading">Loading documentation…</p>';

        try {
            const res = await fetch(REPOS[tabId]);
            if (!res.ok) throw new Error('HTTP ' + res.status);
            const md = await res.text();

            const tmp = document.createElement('div');
            tmp.innerHTML = marked.parse(md);

            // Strip emojis from all text nodes (preserve code blocks)
            stripEmojis(tmp);

            // Add unique, tab-prefixed IDs to every heading
            const seen = {};
            tmp.querySelectorAll('h1, h2, h3, h4').forEach(h => {
                let base = tabId + '-' + slugify(h.textContent);
                let id = base;
                if (seen[base] !== undefined) { id = base + '-' + (++seen[base]); }
                else { seen[base] = 0; }
                h.id = id;
            });

            // Open external links in a new tab
            tmp.querySelectorAll('a[href^="http"]').forEach(a => {
                a.setAttribute('target', '_blank');
                a.setAttribute('rel', 'noopener');
            });

            contentEl.innerHTML = tmp.innerHTML;
            loaded[tabId] = true;

            if (navEl) {
                navEl.innerHTML = buildNav(contentEl.querySelectorAll('h1, h2, h3'));
                attachSmoothScroll(panel);
            }

            onScroll();

        } catch (err) {
            contentEl.innerHTML =
                `<p style="color:var(--fg-color-muted)">Could not load documentation (${err.message}). ` +
                `<a class="inline-link" href="${REPOS[tabId]}" target="_blank" rel="noopener">View on GitHub →</a></p>`;
        }
    }

    // ----- Tab switching -----
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            panels.forEach(p => p.classList.remove('active'));
            tab.classList.add('active');
            const panel = document.getElementById('tab-' + tab.dataset.tab);
            if (panel) {
                panel.classList.add('active');
                if (scroller) scroller.scrollTop = 0;
            }
            loadTab(tab.dataset.tab);
        });
    });

    // ----- Scroll-spy -----
    function onScroll() {
        const activePanel = document.querySelector('.tab-panel.active');
        if (!activePanel) return;

        const navLinks = activePanel.querySelectorAll('.guide-navigation a[href^="#"]');
        const sections = Array.from(navLinks)
            .map(a => { const id = a.getAttribute('href').slice(1); return id ? document.getElementById(id) : null; })
            .filter(Boolean);

        if (!sections.length) return;

        const scrollTop = (scroller ? scroller.scrollTop : window.scrollY) + 120;
        let current = sections[0];
        for (const s of sections) {
            if (s.offsetTop <= scrollTop) current = s;
            else break;
        }
        navLinks.forEach(a => {
            a.classList.toggle('active', a.getAttribute('href') === '#' + (current && current.id));
        });
    }

    if (scroller) scroller.addEventListener('scroll', onScroll, { passive: true });

    // ----- Smooth scroll -----
    function attachSmoothScroll(panel) {
        panel.querySelectorAll('.guide-navigation a[href^="#"]').forEach(link => {
            link.addEventListener('click', e => {
                const id = link.getAttribute('href').slice(1);
                if (!id) return;
                const el = document.getElementById(id);
                if (el && scroller) {
                    e.preventDefault();
                    scroller.scrollTo({ top: el.offsetTop - 20, behavior: 'smooth' });
                }
            });
        });
    }

    // Kick off the initial (active) tab
    const activeTab = document.querySelector('.repo-tab-btn.active');
    if (activeTab) loadTab(activeTab.dataset.tab);
})();
