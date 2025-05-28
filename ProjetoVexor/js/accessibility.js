// js/accessibility.js
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
  const accessibilityButtonContainer = document.getElementById('accessibility-button-container'); // Já selecionado

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

  if (themeToggle) { // Adicionando verificação de existência
    themeToggle.addEventListener("click", () => {
      if (document.documentElement.getAttribute("data-theme") === "dark") {
        document.documentElement.removeAttribute("data-theme");
        localStorage.setItem("theme", "light");
      } else {
        document.documentElement.setAttribute("data-theme", "dark");
        localStorage.setItem("theme", "dark");
      }
      updateAccessibilityIcon();
      if (accessibilityOptions) accessibilityOptions.classList.add("d-none");
      localStorage.setItem("accessibility-open", "false");
    });
  }

  if (increaseFont) {
    increaseFont.addEventListener("click", () => {
      fontSize += 0.1;
      document.body.style.fontSize = fontSize + "em";
      localStorage.setItem("fontSize", fontSize);
    });
  }

  if (decreaseFont) {
    decreaseFont.addEventListener("click", () => {
      fontSize = Math.max(0.5, fontSize - 0.1);
      document.body.style.fontSize = fontSize + "em";
      localStorage.setItem("fontSize", fontSize);
    });
  }
  
  if (resetFont) {
    resetFont.addEventListener("click", () => {
      fontSize = 1;
      document.body.style.fontSize = "1em";
      localStorage.setItem("fontSize", fontSize);
    });
  }

  if (closeAccessibility) {
    closeAccessibility.addEventListener("click", () => {
      if (accessibilityOptions) accessibilityOptions.classList.add("d-none");
      localStorage.setItem("accessibility-open", "false");
    });
  }
  
  if (hideButton) {
    hideButton.addEventListener("click", () => {
      if (accessibilityOptions) accessibilityOptions.classList.add("d-none");
      if (accessibilityToggle) accessibilityToggle.classList.add("d-none"); // Esconde o botão principal também
      localStorage.setItem("accessibility-open", "false");
    });
  }

  if (accessibilityToggle) {
    accessibilityToggle.addEventListener("click", () => {
      if (accessibilityOptions) {
          const isOpen = accessibilityOptions.classList.contains("d-none");
          if (isOpen) {
            adjustAccessibilityPosition(); 
            accessibilityOptions.classList.remove("d-none");
            localStorage.setItem("accessibility-open", "true");
          } else {
            accessibilityOptions.classList.add("d-none");
            localStorage.setItem("accessibility-open", "false");
          }
      }
    });
  }

  function updateAccessibilityIcon() {
    if (accessibilityIcon) { // Adicionando verificação
        if (document.documentElement.getAttribute("data-theme") === "dark") {
        accessibilityIcon.classList.remove("bi-moon");
        accessibilityIcon.classList.add("bi-sun");
        } else {
        accessibilityIcon.classList.remove("bi-sun");
        accessibilityIcon.classList.add("bi-moon");
        }
    }
  }

  function adjustAccessibilityPosition() {
    if (accessibilityOptions && accessibilityToggle) { // Adicionando verificação
        const width = window.innerWidth;
        const buttonHeight = accessibilityToggle.offsetHeight; 
        const optionsHeight = accessibilityOptions.offsetHeight;
        const optionsWidth = accessibilityOptions.offsetWidth;
        const gap = 10; // Espaço entre o botão e o menu de opções

        if (width <= 767) {
            // Mobile/tablet pequeno ➔ abre para cima do botão
            accessibilityOptions.style.bottom = (buttonHeight + gap) + "px"; // Ajusta para ficar acima
            accessibilityOptions.style.left = "10px"; // Mantém à esquerda
            accessibilityOptions.style.right = 'auto';
            accessibilityOptions.style.top = 'auto';
        } else {
            // Desktop/tablet grande ➔ abre para direita do botão
            accessibilityOptions.style.left = (accessibilityToggle.offsetWidth + gap + parseInt(getComputedStyle(accessibilityToggle).marginLeft)) + "px";
            accessibilityOptions.style.bottom = parseInt(getComputedStyle(accessibilityToggle).marginBottom) + "px";
            accessibilityOptions.style.right = 'auto';
            accessibilityOptions.style.top = 'auto';
        }
    }
  }

  // NOVA LÓGICA PARA O OFFCANVAS DE FILTROS (MOVIDA PARA CÁ)
  const filterOffcanvasElement = document.getElementById('filterOffcanvas');

  // Verifica se os elementos existem ANTES de adicionar os listeners
  if (filterOffcanvasElement && accessibilityButtonContainer) {
      filterOffcanvasElement.addEventListener('show.bs.offcanvas', function () {
          accessibilityButtonContainer.style.visibility = 'hidden'; // Usa visibility para não afetar layout
          accessibilityButtonContainer.style.opacity = '0';
          accessibilityButtonContainer.style.transition = 'visibility 0s linear 0.3s, opacity 0.3s linear';
      });

      filterOffcanvasElement.addEventListener('shown.bs.offcanvas', function() {
          // Confirma que está escondido caso a transição não complete
          if (accessibilityButtonContainer.style.visibility !== 'hidden') {
            accessibilityButtonContainer.style.visibility = 'hidden';
            accessibilityButtonContainer.style.opacity = '0';
          }
      });

      filterOffcanvasElement.addEventListener('hide.bs.offcanvas', function() {
          // Começa a transição para mostrar o botão de acessibilidade um pouco antes do offcanvas fechar completamente
          // Isso é opcional e pode ser ajustado. Se preferir que apareça só depois: use 'hidden.bs.offcanvas'
          accessibilityButtonContainer.style.removeProperty('transition'); // Limpa transição anterior para evitar conflitos
          accessibilityButtonContainer.style.visibility = 'visible';
          accessibilityButtonContainer.style.opacity = '1';
          accessibilityButtonContainer.style.transition = 'opacity 0.3s linear 0.2s'; // Delay na aparição
      });
      
      filterOffcanvasElement.addEventListener('hidden.bs.offcanvas', function () {
          // Garante que o botão está visível e com o display correto após o offcanvas fechar
          accessibilityButtonContainer.style.display = 'flex'; // Seu display original
          accessibilityButtonContainer.style.visibility = 'visible';
          accessibilityButtonContainer.style.opacity = '1';
      });
  } else {
      // Log para o console se os elementos não forem encontrados na página atual
      // Isso é normal se a página atual não for product.html
      if (!filterOffcanvasElement) {
          // console.log("Offcanvas de filtros não encontrado nesta página.");
      }
      if (!accessibilityButtonContainer) {
          console.error("Contêiner do botão de acessibilidade não encontrado.");
      }
  }
});