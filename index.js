const seedColorInput = document.getElementById("seedColor");
const schemeModeSelect = document.getElementById("schemeMode");
const getSchemeBtn = document.getElementById("getScheme");
const colorDisplay = document.getElementById("colorDisplay");

// Toast notification
const toast = document.createElement("div");
toast.className = "copied-toast";
toast.textContent = "Copied to clipboard!";
document.body.appendChild(toast);

function showToast() {
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2000);
}

async function getColorScheme() {
  const hex = seedColorInput.value.replace("#", "");
  const mode = schemeModeSelect.value;
  const count = 5;

  try {
    const res = await fetch(
      `https://www.thecolorapi.com/scheme?hex=${hex}&mode=${mode}&count=${count}`,
    );
    const data = await res.json();
    renderColors(data.colors);
  } catch (err) {
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
      navigator.clipboard.writeText(hex).then(showToast);
    });

    swatch.appendChild(hexLabel);
    colorDisplay.appendChild(swatch);
  });
}

getSchemeBtn.addEventListener("click", getColorScheme);

// Load default on start
getColorScheme();
