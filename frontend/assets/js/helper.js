function formatSize(bytes) {
    if (!bytes) return "0 KB";
    const mb = bytes / (1024 * 1024);
    return mb.toFixed(1) + " MB";
}

function formatDate(date) {
    const d = new Date(date);
    return d.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric"
    });
}
