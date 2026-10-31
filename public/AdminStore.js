@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap");

/* Unlayered, so it wins over the global Arial rule in index.css */
.admin-root,
.admin-root * {
    font-family: "Inter", system-ui, -apple-system, "Segoe UI", Arial, sans-serif;
}

.admin-scroll::-webkit-scrollbar {
    width: 6px;
}
.admin-scroll::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 999px;
}
