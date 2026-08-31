const seedColorInput = document.getElementById("seedColor");
const schemeModeSelect = document.getElementById("schemeMode");
const getSchemeBtn = document.getElementById("getScheme");
const colorDisplay = document.getElementById("colorDisplay");
const toast = document.getElementById("toast");
const themeFab = document.getElementById("themeFab");
const themeFabBtn = document.getElementById("themeFabBtn");
const fabIcon = document.getElementById("fabIcon");

// ===== THEME =====
const themeIcons = { light: "☀️", dark: "🌙", system: "💻" };

function getSystemTheme() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyTheme(theme) {
  const resolved = theme === "system" ? getSystemTheme() : theme;
  document.documentElement.setAttribute("data-theme", resolved);
  fabIcon.textContent = themeIcons[theme];
  localStorage.setItem("theme", theme);

  // Update active button
  document.querySelectorAll(".theme-option-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.theme === theme);
  });
}

function initTheme() {
  const saved = localStorage.getItem("theme") || "system";
  applyTheme(saved);
}

// FAB toggle
themeFabBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  themeFab.classList.toggle("open");
});

// Theme option buttons
document.querySelectorAll(".theme-option-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    applyTheme(btn.dataset.theme);
    themeFab.classList.remove("open");
  });
});

// Close FAB when clicking outside
document.addEventListener("click", (e) => {
  if (!themeFab.contains(e.target)) {
    themeFab.classList.remove("open");
  }
});

// Listen to system theme changes
window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", () => {
    if (localStorage.getItem("theme") === "system") applyTheme("system");
  });

// ===== TOAST =====
function showToast(msg = "Copied to clipboard!") {
  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2000);
}

// ===== COLOR SCHEME =====
async function getColorScheme() {
  const hex = seedColorInput.value.replace("#", "");
  const mode = schemeModeSelect.value;

  colorDisplay.innerHTML =
    '<p style="padding:20px;color:var(--text-muted)">Loading...</p>';

  try {
    const res = await fetch(
      `https://www.thecolorapi.com/scheme?hex=${hex}&mode=${mode}&count=5`,
    );
    const data = await res.json();
    renderColors(data.colors);
  } catch {
    colorDisplay.innerHTML =
      '<p style="padding:20px;color:red;">Failed to fetch colors. Please try again.</p>';
  }
}

function renderColors(colors) {
  colorDisplay.innerHTML = "";
  colors.forEach((color) => {
    const hex = color.hex.value;

    const swatch = document.createElement("div");
    swatch.className = "color-swatch";
    swatch.style.backgroundColor = hex;

    const hexLabel = document.createElement("span");
    hexLabel.className = "hex-value";
    hexLabel.textContent = hex;
    hexLabel.title = "Click to copy";
    hexLabel.addEventListener("click", () => {
      navigator.clipboard.writeText(hex).then(() => showToast(`Copied ${hex}`));
    });

    swatch.appendChild(hexLabel);
    colorDisplay.appendChild(swatch);
  });
}

getSchemeBtn.addEventListener("click", getColorScheme);

// Init
initTheme();
getColorScheme();
