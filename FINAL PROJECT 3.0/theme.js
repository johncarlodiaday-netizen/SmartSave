/*Include this on every page: <script src="theme.js"></script>*/
(function () {
    const THEME_KEY = 'smartsave_theme';

    const themes = [
        { id: 'theme-color', label: 'Colorful',    icon: '🎨', swatch: 'swatch-color' },
        { id: 'theme-dark',  label: 'Dark',         icon: '🌙', swatch: 'swatch-dark'  },
        { id: 'theme-bw',    label: 'Black & White',icon: '⬛', swatch: 'swatch-bw'    },
    ];

    // ── Apply theme ───────────────────────────────────────
    function applyTheme(id) {
        document.body.classList.remove('theme-dark', 'theme-bw');
        if (id === 'theme-dark') document.body.classList.add('theme-dark');
        if (id === 'theme-bw')   document.body.classList.add('theme-bw');
        localStorage.setItem(THEME_KEY, id);

        // Update active state on buttons
        document.querySelectorAll('.theme-option').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.theme === id);
        });

        // Update toggle button label
        const current = themes.find(t => t.id === id) || themes[0];
        const toggleBtn = document.getElementById('theme-toggle-btn');
        if (toggleBtn) toggleBtn.innerHTML = `${current.icon} Theme`;
    }

    // ── Build & inject UI ─────────────────────────────────
    function buildUI() {
        // Panel
        const panel = document.createElement('div');
        panel.className = 'theme-panel';
        panel.id = 'theme-panel';

        const title = document.createElement('div');
        title.className = 'theme-panel-title';
        title.textContent = 'Choose Theme';
        panel.appendChild(title);

        themes.forEach(t => {
            const btn = document.createElement('button');
            btn.className = 'theme-option';
            btn.dataset.theme = t.id;
            btn.innerHTML = `<span class="theme-swatch ${t.swatch}"></span>${t.icon} ${t.label}`;
            btn.addEventListener('click', () => {
                applyTheme(t.id);
                panel.classList.remove('open');
            });
            panel.appendChild(btn);
        });

        // Toggle button
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'theme-toggle-btn';
        toggleBtn.id = 'theme-toggle-btn';
        toggleBtn.innerHTML = '🎨 Theme';
        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            panel.classList.toggle('open');
        });

        // Close panel when clicking outside
        document.addEventListener('click', () => panel.classList.remove('open'));
        panel.addEventListener('click', e => e.stopPropagation());

        document.body.appendChild(panel);
        document.body.appendChild(toggleBtn);
    }

    // ── Init ──────────────────────────────────────────────
    function init() {
        buildUI();
        const saved = localStorage.getItem(THEME_KEY) || 'theme-color';
        applyTheme(saved);
    }

    // Run after DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
