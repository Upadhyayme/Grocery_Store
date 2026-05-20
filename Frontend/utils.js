/**
 * utils.js
 * --------
 * Shared utility functions used across all pages.
 */

/* ── Toast Notifications ─────────────────────────────────────── */

/**
 * Shows a toast message at the bottom-right corner.
 * @param {string} message - Text to display.
 * @param {'success'|'error'} type - Visual style.
 */
function showToast(message, type = "success") {
    let container = document.getElementById("toast-container");
    if (!container) {
        container = document.createElement("div");
        container.id = "toast-container";
        container.className = "toast-container-custom";
        document.body.appendChild(container);
    }

    const icon = type === "success" ? "✅" : "❌";
    const toast = document.createElement("div");
    toast.className = `toast-item ${type}`;
    toast.innerHTML = `<span>${icon}</span><span>${message}</span>`;
    container.appendChild(toast);

    // Auto-remove after 3.5 seconds
    setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translateY(10px)";
        toast.style.transition = "all .3s ease";
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}


/* ── API Helper ───────────────────────────────────────────────── */

/**
 * Wrapper around fetch() that adds JSON headers and error handling.
 * @param {string} endpoint - API path (e.g. '/products')
 * @param {Object} options  - fetch options (method, body, etc.)
 * @returns {Promise<any>}  - Parsed JSON response
 */
async function apiRequest(endpoint, options = {}) {
    const url = `${CONFIG.API_BASE_URL}${endpoint}`;

    const defaultOptions = {
        headers: { "Content-Type": "application/json" },
    };

    const mergedOptions = { ...defaultOptions, ...options };

    const response = await fetch(url, mergedOptions);
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "An unexpected error occurred.");
    }

    return data;
}


/* ── Format Currency ──────────────────────────────────────────── */

/**
 * Formats a number as Indian Rupees.
 * @param {number} amount
 * @returns {string} e.g. "₹1,250.00"
 */
function formatCurrency(amount) {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 2,
    }).format(amount);
}


/* ── Date Formatter ───────────────────────────────────────────── */

/**
 * Formats a MySQL datetime string into a readable format.
 * @param {string} datetimeStr - e.g. "2024-01-15 10:30:00"
 * @returns {string} e.g. "Jan 15, 2024 10:30 AM"
 */
function formatDateTime(datetimeStr) {
    if (!datetimeStr) return "—";
    const date = new Date(datetimeStr);
    return date.toLocaleString("en-IN", {
        day: "2-digit", month: "short", year: "numeric",
        hour: "2-digit", minute: "2-digit",
    });
}


/* ── Sidebar Toggle (Mobile) ──────────────────────────────────── */
function initSidebarToggle() {
    const toggle = document.getElementById("sidebar-toggle");
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("sidebar-overlay");

    if (!toggle || !sidebar) return;

    toggle.addEventListener("click", () => {
        sidebar.classList.toggle("open");
        overlay.classList.toggle("show");
    });

    overlay?.addEventListener("click", () => {
        sidebar.classList.remove("open");
        overlay.classList.remove("show");
    });
}


/* ── Live Clock ───────────────────────────────────────────────── */
function initClock() {
    const el = document.getElementById("topbar-time");
    if (!el) return;

    function update() {
        el.textContent = new Date().toLocaleString("en-IN", {
            weekday: "short", hour: "2-digit", minute: "2-digit",
        });
    }
    update();
    setInterval(update, 60000);
}


/* ── Product Emoji Map ────────────────────────────────────────── */
function getProductEmoji(name = "") {
    const n = name.toLowerCase();
    if (n.includes("rice"))   return "🌾";
    if (n.includes("oil"))    return "🫙";
    if (n.includes("milk"))   return "🥛";
    if (n.includes("egg"))    return "🥚";
    if (n.includes("bread"))  return "🍞";
    if (n.includes("sugar"))  return "🍬";
    if (n.includes("salt"))   return "🧂";
    if (n.includes("tea"))    return "🍵";
    if (n.includes("flour"))  return "🌾";
    if (n.includes("butter")) return "🧈";
    if (n.includes("cheese")) return "🧀";
    if (n.includes("tomato")) return "🍅";
    if (n.includes("onion"))  return "🧅";
    if (n.includes("potato")) return "🥔";
    return "🛒";
}
