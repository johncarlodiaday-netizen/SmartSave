/**
 * SmartSave — script.js
 * Phase 4: System Logic
 * Uses localStorage to persist budget history entries.
 */

const STORAGE_KEY = 'save_history';

// ── Saving Logic (Tracker Page) ───────────────────────────────
const saveBtn = document.getElementById('save-btn');

if (saveBtn) {
    saveBtn.addEventListener('click', () => {
        const budget = document.getElementById('user-budget').value;
        const amount = document.getElementById('expense-amount').value;

        if (!budget || !amount) {
            alert("Please fill in both fields before saving!");
            return;
        }

        if (parseFloat(budget) <= 0 || parseFloat(amount) <= 0) {
            alert("Please enter values greater than zero.");
            return;
        }

        let history = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

        const newEntry = {
            id: Date.now(),
            budget: parseFloat(budget),
            spent: parseFloat(amount),
            date: new Date().toLocaleString()
        };

        history.push(newEntry);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(history));

        // Visual feedback on the button
        saveBtn.textContent = '✅ Saved!';
        saveBtn.style.opacity = '0.8';
        setTimeout(() => {
            saveBtn.textContent = '💾 Save to History';
            saveBtn.style.opacity = '1';
        }, 1800);

        // Clear inputs after saving
        document.getElementById('user-budget').value = '';
        document.getElementById('expense-amount').value = '';
    });
}

// ── Display Logic (History Page) ─────────────────────────────
const historyContainer = document.getElementById('history-list');

if (historyContainer) {
    const history = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

    if (history.length === 0) {
        historyContainer.innerHTML = `
            <div style="grid-column:1/-1; text-align:center; padding: 40px 20px; color: var(--text-muted);">
                <div style="font-size:3rem; margin-bottom:14px;">📭</div>
                <p style="font-size:1.05rem;">No entries yet. Head to the <a href="tracker.html" style="color:var(--grad-1); font-weight:700;">Tracker</a> to add your first record!</p>
            </div>
        `;
    } else {
        let historyHTML = "";

        for (let i = 0; i < history.length; i++) {
            const item = history[i];
            const saved = item.budget - item.spent;
            const savedColor = saved >= 0 ? 'var(--clr-tracker)' : 'var(--clr-danger)';
            const savedLabel = saved >= 0 ? '✅ Remaining' : '⚠️ Over Budget';
            const animDelay = (i % 6) * 0.08; // stagger cards

            historyHTML += `
                <div class="interact-box history-item" style="animation-delay:${animDelay}s; border-left: 5px solid var(--clr-history);">
                    <p style="font-size:0.78rem; color:var(--text-muted); margin-bottom:10px;">📅 ${item.date}</p>
                    <p style="margin-bottom:6px;"><strong>Budget:</strong> ₱${item.budget.toFixed(2)}</p>
                    <p style="margin-bottom:6px;"><strong>Spent:</strong> ₱${item.spent.toFixed(2)}</p>
                    <p style="font-weight:700; color:${savedColor};">${savedLabel}: ₱${Math.abs(saved).toFixed(2)}</p>
                </div>
            `;
        }

        historyContainer.innerHTML = historyHTML;
    }
}

// ── Reset Function (History Page) ────────────────────────────
function resetHistory() {
    if (confirm("Are you sure you want to delete ALL transaction history? This cannot be undone.")) {
        localStorage.removeItem(STORAGE_KEY);
        window.location.reload();
    }
}
