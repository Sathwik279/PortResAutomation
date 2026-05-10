export function printResume() {
  window.print();
}

import { getPortfolioCSS } from "../styles/portfolioStyles";

export function getPortfolioHtml(configName) {
  const originalPreview = document.querySelector(".portfolio-original");
  if (!originalPreview) return "";

  // 1. Clone the preview so we can modify it without affecting the UI
  const cleanPreview = originalPreview.cloneNode(true);

  // 2. Remove all Edit Mode controls and extra classes
  const controls = cleanPreview.querySelectorAll(".editable-controls");
  controls.forEach(el => el.remove());

  const activeWrappers = cleanPreview.querySelectorAll(".edit-active");
  activeWrappers.forEach(el => el.classList.remove("edit-active"));

  const documentTitle = `${configName || "portfolio"} portfolio`;
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(documentTitle)}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Josefin+Sans:ital,wght@0,100..700;1,100..700&display=swap" rel="stylesheet" />
  <style>${getPortfolioCSS()}</style>
</head>
<body>
${cleanPreview.outerHTML}
</body>
</html>`;
}

export function downloadPortfolioHtml(configName) {
  const html = getPortfolioHtml(configName);
  if (html) downloadTextFile("portfolio.html", html);
}

function downloadTextFile(filename, content) {
  const blob = new Blob([content], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
