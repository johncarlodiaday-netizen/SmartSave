/**
 * SmartSave — profile-loader.js
 * Loads profile data from localStorage and injects it
 * into every page that includes this script.
 */

(function () {
    const PROFILE_KEY = 'smartsave_profile';
    const STORAGE_KEY = 'save_history';

    const avatarEmojis = ['😊','😀','🤩','😎','🤓','😄','🤨','🥰','😊','🤑'];

    function getProfile() {
        return JSON.parse(localStorage.getItem(PROFILE_KEY)) || {};
    }

    function getHistory() {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    }

    // ── Inject profile nav badge on every page ──────────
    function injectNavBadge() {
        const p = getProfile();
        const name = p.name || null;
        const emoji = avatarEmojis[p.avatarIndex || 0];

        const profileLink = document.querySelector('.nav-item.profile');
        if (profileLink && name) {
            profileLink.innerHTML = `${emoji} ${name}`;
        }
    }

    // ── index.html — personalised hero greeting ─────────
    function loadIndex() {
        const p = getProfile();
        const history = getHistory();
        const name = p.name || 'Student';
        const emoji = avatarEmojis[p.avatarIndex || 0];

        // Greeting in hero
        const h1 = document.querySelector('.hero-banner h1');
        if (h1) h1.innerHTML = `Welcome back, ${emoji} ${name}!`;

        // Hero sub text with entry count
        const heroP = document.querySelector('.hero-banner p');
        if (heroP && history.length > 0) {
            heroP.textContent = `You have ${history.length} recorded ${history.length === 1 ? 'entry' : 'entries'}. Keep it up!`;
        }

        // Stat card values — real numbers
        let totalSaved = 0, totalSpent = 0;
        history.forEach(item => {
            totalSpent += item.spent;
            totalSaved += Math.max(0, item.budget - item.spent);
        });

        const statValues = document.querySelectorAll('.stat-value');
        if (statValues.length >= 3) {
            statValues[0].textContent = history.length + ' entries';
            statValues[1].textContent = '₱' + totalSaved.toFixed(0);
            statValues[2].textContent = '₱' + totalSpent.toFixed(0);
        }

        const statLabels = document.querySelectorAll('.stat-label');
        if (statLabels.length >= 3) {
            statLabels[0].textContent = 'Recorded';
            statLabels[1].textContent = 'Total Saved';
            statLabels[2].textContent = 'Total Spent';
        }

        // Weekly goal progress bar if goal is set
        if (p.goal && parseFloat(p.goal) > 0) {
            const goal = parseFloat(p.goal);
            const thisWeekSpent = getThisWeekSpent(history);
            const pct = Math.min(100, (thisWeekSpent / goal) * 100).toFixed(0);
            const color = pct < 70 ? '#3ddc84' : pct < 90 ? '#ffb347' : '#ff7675';

            const goalBar = document.getElementById('goal-bar-wrap');
            if (goalBar) {
                goalBar.style.display = 'block';
                document.getElementById('goal-bar-fill').style.width = pct + '%';
                document.getElementById('goal-bar-fill').style.background = color;
                document.getElementById('goal-bar-pct').textContent = pct + '%';
                document.getElementById('goal-bar-label').textContent =
                    `Weekly goal: ₱${thisWeekSpent.toFixed(0)} spent of ₱${goal} budget`;
            }
        }
    }

    // ── tracker.html — show name + goal reminder ────────
    function loadTracker() {
        const p = getProfile();
        const name = p.name || null;

        const heading = document.querySelector('.card h2');
        if (heading && name) heading.textContent = `Hi ${name}, Record a Transaction`;

        const subtext = document.querySelector('.card > p');
        if (p.goal && parseFloat(p.goal) > 0 && subtext) {
            const history = getHistory();
            const thisWeekSpent = getThisWeekSpent(history);
            const remaining = parseFloat(p.goal) - thisWeekSpent;
            const msg = remaining > 0
                ? `Your weekly goal is ₱${p.goal}. You have ₱${remaining.toFixed(0)} left this week.`
                : `You've exceeded your ₱${p.goal} weekly goal. Be mindful of new expenses!`;
            subtext.textContent = msg;
            subtext.style.color = remaining > 0 ? 'var(--clr-tracker)' : 'var(--clr-danger)';
            subtext.style.fontWeight = '600';
        }
    }

    // ── history.html — personalised header ──────────────
    function loadHistory() {
        const p = getProfile();
        const name = p.name || null;
        const history = getHistory();

        const heading = document.querySelector('.card h2');
        if (heading && name) heading.textContent = `${name}'s Transaction History`;

        const subtext = document.querySelector('.card > p');
        if (subtext && history.length > 0) {
            subtext.textContent = `You have ${history.length} total ${history.length === 1 ? 'entry' : 'entries'} on record.`;
        }
    }

    // ── insights.html — personalised greeting ───────────
    function loadInsights() {
        const p = getProfile();
        const name = p.name || null;
        const history = getHistory();

        const subtext = document.querySelector('.card > p');
        if (subtext && name) {
            const totalSaved = history.reduce((acc, i) => acc + Math.max(0, i.budget - i.spent), 0);
            if (totalSaved > 0) {
                subtext.innerHTML = `<span class="pulse-dot"></span> Great work, <strong>${name}</strong>! You've saved ₱${totalSaved.toFixed(0)} so far. Here are tips to save even more.`;
            } else {
                subtext.innerHTML = `<span class="pulse-dot"></span> Hey <strong>${name}</strong>! Start tracking your expenses to unlock personalised insights.`;
            }
        }
    }

    // ── Helper: total spent this week ───────────────────
    function getThisWeekSpent(history) {
        const now = new Date();
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        startOfWeek.setHours(0, 0, 0, 0);
        return history
            .filter(item => new Date(item.date) >= startOfWeek)
            .reduce((sum, item) => sum + item.spent, 0);
    }

    // ── Route by page ────────────────────────────────────
    function init() {
        injectNavBadge();
        const page = window.location.pathname.split('/').pop() || 'index.html';
        if (page === 'index.html'   || page === '') loadIndex();
        if (page === 'tracker.html')                loadTracker();
        if (page === 'history.html')                loadHistory();
        if (page === 'insights.html')               loadInsights();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
