// Acessibilidade Inteligente
document.addEventListener("DOMContentLoaded", () => {
  const accessibilityHTML = `
    <div id="accessibility-button-container" class="d-flex flex-column align-items-center">
      <button id="accessibility-toggle" class="btn btn-secondary position-fixed bottom-0 start-0 m-3">
        <i id="accessibility-icon" class="bi bi-moon"></i>
      </button>
      <div id="accessibility-options" class="position-fixed d-none">
        <div class="p-3 rounded shadow position-relative" style="background: var(--primary-bg-color);">
          <button class="btn btn-outline-primary mb-1" id="theme-toggle"><i class="bi bi-brightness-high"></i></button>
          <button class="btn btn-outline-primary mb-1" id="increase-font"><i class="bi bi-plus-circle"></i></button>
          <button class="btn btn-outline-primary mb-1" id="decrease-font"><i class="bi bi-dash-circle"></i></button>
          <button class="btn btn-outline-primary mb-1" id="reset-font"><i class="bi bi-fonts"></i></button>
          <button class="btn position-absolute mb-1" id="close-accessibility"><i class="bi bi-x-circle"></i></button>
          <button class="btn btn-outline-primary mb-1" id="hide-button"><i class="bi bi-eye-slash"></i></button>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", accessibilityHTML);

  const accessibilityToggle = document.getElementById("accessibility-toggle");
  const accessibilityOptions = document.getElementById("accessibility-options");
  const themeToggle = document.getElementById("theme-toggle");
  const increaseFont = document.getElementById("increase-font");
  const decreaseFont = document.getElementById("decrease-font");
  const resetFont = document.getElementById("reset-font");
  const closeAccessibility = document.getElementById("close-accessibility");
  const hideButton = document.getElementById("hide-button");
  const accessibilityIcon = document.getElementById("accessibility-icon");

  let fontSize = parseFloat(localStorage.getItem("fontSize")) || 1;
  document.body.style.fontSize = fontSize + "em";

  if (localStorage.getItem("theme") === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
  } else {
    document.documentElement.removeAttribute("data-theme");
  }
  updateAccessibilityIcon();

  if (localStorage.getItem("accessibility-open") === "true") {
    accessibilityOptions.classList.remove("d-none");
  }

  themeToggle.addEventListener("click", () => {
    if (document.documentElement.getAttribute("data-theme") === "dark") {
      document.documentElement.removeAttribute("data-theme");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
    }
    updateAccessibilityIcon();
    accessibilityOptions.classList.add("d-none");
    localStorage.setItem("accessibility-open", "false");
  });

  increaseFont.addEventListener("click", () => {
    fontSize += 0.1;
    document.body.style.fontSize = fontSize + "em";
    localStorage.setItem("fontSize", fontSize);
  });

  decreaseFont.addEventListener("click", () => {
    fontSize = Math.max(0.5, fontSize - 0.1);
    document.body.style.fontSize = fontSize + "em";
    localStorage.setItem("fontSize", fontSize);
  });

  resetFont.addEventListener("click", () => {
    fontSize = 1;
    document.body.style.fontSize = "1em";
    localStorage.setItem("fontSize", fontSize);
  });

  closeAccessibility.addEventListener("click", () => {
    accessibilityOptions.classList.add("d-none");
    localStorage.setItem("accessibility-open", "false");
  });

  hideButton.addEventListener("click", () => {
    accessibilityOptions.classList.add("d-none");
    accessibilityToggle.classList.add("d-none");
    localStorage.setItem("accessibility-open", "false");
  });

  accessibilityToggle.addEventListener("click", () => {
    const isOpen = accessibilityOptions.classList.contains("d-none");
    if (isOpen) {
      adjustAccessibilityPosition(); // ⚡ Atualiza a posição ao abrir
      accessibilityOptions.classList.remove("d-none");
      localStorage.setItem("accessibility-open", "true");
    } else {
      accessibilityOptions.classList.add("d-none");
      localStorage.setItem("accessibility-open", "false");
    }
  });

  function updateAccessibilityIcon() {
    if (document.documentElement.getAttribute("data-theme") === "dark") {
      accessibilityIcon.classList.remove("bi-moon");
      accessibilityIcon.classList.add("bi-sun");
    } else {
      accessibilityIcon.classList.remove("bi-sun");
      accessibilityIcon.classList.add("bi-moon");
    }
  }

  // ⚡ Função inteligente de posicionamento
  function adjustAccessibilityPosition() {
    const width = window.innerWidth;
    if (width <= 767) {
      // Mobile/tablet pequeno ➔ abre para cima
      accessibilityOptions.style.bottom = "70px";
      accessibilityOptions.style.left = "10px";
    } else {
      // Desktop/tablet grande ➔ abre para direita
      accessibilityOptions.style.bottom = "10px";
      accessibilityOptions.style.left = "70px";
    }
  }
});
