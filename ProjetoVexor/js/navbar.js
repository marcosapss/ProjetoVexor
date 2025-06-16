document.addEventListener("DOMContentLoaded", function () {
  // Adiciona as fontes
  const addFontLink = (id, href) => {
    if (!document.getElementById(id)) {
      const link = document.createElement('link');
      link.id = id;
      link.rel = 'stylesheet';
      link.href = href;
      document.head.appendChild(link);
    }
  };
  addFontLink('orbitron-font-link', 'https://fonts.googleapis.com/css2?family=Orbitron:wght@700&display=swap');
  addFontLink('montserrat-font-link', 'https://fonts.googleapis.com/css2?family=Montserrat:wght@700&display=swap');

  // --- ESTRUTURA HTML DA NAVBAR ---
  const loggedUser = localStorage.getItem("loggedUser");
  let userMenuHTML;

  if (loggedUser) {
    // Se o usuário está LOGADO, mostra um menu dropdown simples com suas opções
    userMenuHTML = `
      <li class="nav-item dropdown">
        <a href="#" class="nav-link dropdown-toggle d-flex align-items-center" id="userDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false" title="Minha Conta">
          <i class="bi bi-person-check-fill"></i>
          <span class="d-none d-lg-inline ms-2" style="font-size: 14px;">${loggedUser}</span>
        </a>
        <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
          <li><a class="dropdown-item" href="usuario.html"><i class="bi bi-person-circle me-2"></i>Painel</a></li>
          <li><a class="dropdown-item" href="favorite.html"><i class="bi bi-heart-fill me-2"></i>Favoritos</a></li>
          <li><hr class="dropdown-divider"></li>
          <li><a class="dropdown-item text-danger" href="#" id="logout-button"><i class="bi bi-box-arrow-right me-2"></i>Sair</a></li>
        </ul>
      </li>
    `;
  } else {
    // Se o usuário está DESLOGADO, o ícone vira o gatilho para o POPOVER
    userMenuHTML = `
      <li class="nav-item">
        <a href="#" class="nav-link" id="user-popover-toggle" title="Login / Registro">
          <i class="bi bi-person-fill"></i>
        </a>
      </li>
    `;
  }

  const navbarHTML = `
    <nav class="navbar primary-bg-color py-3 fixed-top" id="main-navbar">
      <div class="container d-flex flex-wrap flex-md-nowrap align-items-center justify-content-between gap-3">
        <a href="index.html" class="navbar-brand flex-shrink-0">Vexor</a>
        <button class="navbar-toggler d-md-none" type="button" data-bs-toggle="collapse" data-bs-target="#navbarMain" aria-controls="navbarMain" aria-expanded="false" aria-label="Toggle navigation"><span class="navbar-toggler-icon"></span></button>
        <div class="collapse navbar-collapse d-md-flex justify-content-between align-items-center w-100 mt-3 mt-md-0" id="navbarMain">
          <form class="d-flex position-relative flex-grow-1 me-md-3 search-form-modern" id="search-form" autocomplete="off">
            <i class="bi bi-search search-icon primary-color"></i>
            <input type="search" class="form-control me-2 search-input-modern" id="search-input" placeholder="Busque seu Mouse..." aria-label="Search">
            <button type="button" class="btn-clear-search d-none" id="clear-search-btn"><i class="bi bi-x-circle-fill"></i></button>
            <div id="search-results" class="search-results-modern"></div>
            <button class="btn search-btn" type="submit">Pesquisar</button>
          </form>
          <ul class="navbar-nav flex-row gap-3 align-items-center mb-0 ms-auto">
            <li class="nav-item">
                <a href="favorite.html" class="nav-link position-relative" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Meus Favoritos"><i class="bi bi-heart-fill"></i><span id="favorites-qty" class="qty-info" style="display:none;">0</span></a>
            </li>
            <li class="nav-item">
                <a href="cart.html" class="nav-link position-relative" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Meu Carrinho"><i class="bi bi-cart-fill position-relative"><span id="cart-qty-badge" class="qty-info">0</span></i></a>
            </li>
            <li class="nav-item d-none d-lg-block ms-3 me-2" style="border-left: 1px solid var(--border-color); height: 24px;"></li>
            <li class="nav-item">
                <button class="nav-link btn-access" id="theme-toggle" aria-label="Alternar Tema"><i class="bi bi-moon-stars-fill"></i></button>
            </li>
            <li class="nav-item">
                <button class="nav-link btn-access" id="decrease-font" aria-label="Diminuir Fonte"><i class="bi bi-zoom-out"></i></button>
            </li>
            <li class="nav-item">
                <button class="nav-link btn-access" id="increase-font" aria-label="Aumentar Fonte"><i class="bi bi-zoom-in"></i></button>
            </li>
            ${userMenuHTML}
          </ul>
        </div>
      </div>
    </nav>
    <nav class="navbar navbar-expand-lg p-2" id="bottom-navbar">
        <div class="container">
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#bottom-navbar-collapse" aria-controls="bottom-navbar-collapse" aria-expanded="false" aria-label="Toggle bottom navigation">
                <i class="bi bi-list"></i>
            </button>
            <div class="collapse navbar-collapse justify-content-center" id="bottom-navbar-collapse">
                <ul class="navbar-nav mb-2 mb-lg-0">
                    <li class="nav-item"><a href="index.html" class="nav-link" data-page-name="index">Home</a></li>
                    <li class="nav-item"><a href="product.html" class="nav-link" data-page-name="product">Produtos</a></li>
                    <li class="nav-item"><a href="mouse.html" class="nav-link" data-page-name="mouse">O que é um Mouse?</a></li>
                    <li class="nav-item"><a href="contact.html" class="nav-link" data-page-name="contact">Contato</a></li>
                </ul>
            </div>
        </div>
    </nav>
  `;

  const navbarContainer = document.getElementById("navbar-container");
  if (navbarContainer) {
    navbarContainer.innerHTML = navbarHTML;
    const style = document.createElement('style');
    style.innerHTML = `
      .btn-access { background: none; border: none; padding: 5px; line-height: 1; color: var(--muted-text-color); transition: color 0.3s ease; }
      .btn-access:hover { color: var(--secondary-bg-color); }
      #main-navbar .navbar-nav .nav-link i { font-size: 24px; }
    `;
    document.head.appendChild(style);
    
    initializeNavbarFeatures();
    initializeAccessibilityFeatures();
  }

  function initializeNavbarFeatures() {
    const mainNavbar = document.getElementById('main-navbar');
    const bottomNavbar = document.getElementById('bottom-navbar');
    const searchForm = document.getElementById("search-form");
    const searchInput = document.getElementById("search-input");
    const searchResults = document.getElementById("search-results");
    const clearSearchBtn = document.getElementById("clear-search-btn");
    let productsCache = [];
    let lastScrollY = window.scrollY;

    [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]')).map(el => new bootstrap.Tooltip(el));
    [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]')).map(el => new bootstrap.Popover(el));

    const adjustBodyPadding = () => {
        document.body.style.paddingTop = `${mainNavbar.offsetHeight + bottomNavbar.offsetHeight}px`;
    };
    
    const handleScroll = () => {
        if (window.scrollY > lastScrollY && window.scrollY > mainNavbar.offsetHeight) {
            mainNavbar.classList.add('hidden-up');
        } else {
            mainNavbar.classList.remove('hidden-up');
        }
        lastScrollY = window.scrollY;
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', adjustBodyPadding);
    setTimeout(adjustBodyPadding, 150);
    
    fetch("db/products-database.json").then(r => r.json()).then(p => { productsCache = p; });
    
    searchInput.addEventListener("input", () => {
      const query = searchInput.value.trim().toLowerCase();
      clearSearchBtn.classList.toggle('d-none', query === '');
      if (!query) { searchResults.classList.remove("show"); return; }
      const results = productsCache.filter(p => p.name.toLowerCase().includes(query) || p.brand.toLowerCase().includes(query)).slice(0, 7);
      searchResults.innerHTML = results.length ? results.map(p => `<a href="product-page.html?id=${p.id}" class="search-result-item"><img src="${p.imgMain}" alt="${p.name}"><span>${p.name}</span></a>`).join("") : `<div class="p-2 text-muted">Nenhum produto encontrado.</div>`;
      searchResults.classList.add("show");
    });
    
    document.addEventListener("click", (e) => { if (searchForm && !searchForm.contains(e.target)) { searchResults.classList.remove("show"); } });
    clearSearchBtn.addEventListener('click', () => { searchInput.value = ''; searchInput.focus(); searchResults.classList.remove("show"); clearSearchBtn.classList.add('d-none'); });
    searchForm.addEventListener('submit', (e) => { e.preventDefault(); if (searchInput.value.trim()) window.location.href = `product.html?search=${encodeURIComponent(searchInput.value.trim())}`; });

    window.updateCartNavbar = updateCartNavbar;
    window.updateFavoritesNavbar = updateFavoritesNavbar;
    updateCartNavbar();
    updateFavoritesNavbar();
    highlightActivePage();
    initializeUserPopover();
    initializeLogout();
  }
  
  function initializeAccessibilityFeatures() {
    const elements = {
        docElement: document.documentElement,
        themeToggleButton: document.getElementById("theme-toggle"),
        increaseFontButton: document.getElementById("increase-font"),
        decreaseFontButton: document.getElementById("decrease-font"),
    };
    const BASE_FONT_SIZE_PX = 16;
    const FONT_STEP_PX = 1;
    const MIN_FONT_SIZE_PX = 14;
    const MAX_FONT_SIZE_PX = 20;
    let currentFontSizePx = parseFloat(localStorage.getItem("vexorFontSizePx")) || BASE_FONT_SIZE_PX;
    const updateThemeIcon = (theme) => {
        if (!elements.themeToggleButton) return;
        const themeIcon = elements.themeToggleButton.querySelector('i');
        if (theme === "dark") { if (themeIcon) themeIcon.className = 'bi bi-sun-fill'; } 
        else { if (themeIcon) themeIcon.className = 'bi bi-moon-stars-fill'; }
    };
    const applyTheme = (theme) => {
        elements.docElement.setAttribute("data-theme", theme);
        localStorage.setItem("vexorTheme", theme);
        updateThemeIcon(theme);
    };
    const applyFontSize = (sizeInPx) => {
        currentFontSizePx = Math.max(MIN_FONT_SIZE_PX, Math.min(sizeInPx, MAX_FONT_SIZE_PX));
        elements.docElement.style.fontSize = currentFontSizePx + "px";
        localStorage.setItem("vexorFontSizePx", currentFontSizePx);
    };
    const handleThemeToggle = () => {
        const currentTheme = elements.docElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
        applyTheme(currentTheme);
    };
    const handleIncreaseFont = () => applyFontSize(currentFontSizePx + FONT_STEP_PX);
    const handleDecreaseFont = () => applyFontSize(currentFontSizePx - FONT_STEP_PX);
    const savedTheme = localStorage.getItem("vexorTheme") || "light";
    applyTheme(savedTheme);
    applyFontSize(currentFontSizePx);
    if (elements.themeToggleButton) elements.themeToggleButton.addEventListener("click", handleThemeToggle);
    if (elements.increaseFontButton) elements.increaseFontButton.addEventListener("click", handleIncreaseFont);
    if (elements.decreaseFontButton) elements.decreaseFontButton.addEventListener("click", handleDecreaseFont);
  }

  function initializeUserPopover() {
    const popoverToggle = document.getElementById('user-popover-toggle');
    if (!popoverToggle) return;

    const loginFormHTML = `
      <form id="popover-login-form" novalidate class="p-2">
        <div class="mb-2">
          <label for="popover-login-user" class="form-label small">Usuário</label>
          <input type="text" class="form-control form-control-sm" id="popover-login-user" required>
        </div>
        <div class="mb-3">
          <label for="popover-login-pass" class="form-label small">Senha</label>
          <input type="password" class="form-control form-control-sm" id="popover-login-pass" required>
        </div>
        <button type="submit" class="btn btn-primary btn-sm w-100">Entrar</button>
      </form>
      <div id="popover-login-message" class="text-center small my-2"></div>
      <hr class="my-1">
      <div class="p-2 text-center">
        <a href="register.html" class="btn btn-outline-secondary btn-sm w-100">Não tem conta? Cadastre-se</a>
      </div>
    `;

    const popover = new bootstrap.Popover(popoverToggle, {
      container: 'body',
      html: true,
      sanitize: false,
      placement: 'bottom',
      title: 'Acessar Conta',
      content: loginFormHTML,
      customClass: 'login-popover'
    });
    
    popoverToggle.addEventListener('shown.bs.popover', () => {
      const loginForm = document.getElementById('popover-login-form');
      const messageContainer = document.getElementById('popover-login-message');
      if (!loginForm) return;

      loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('popover-login-user').value.trim();
        const password = document.getElementById('popover-login-pass').value.trim();

        if (!username || !password) {
          messageContainer.innerHTML = `<span class="text-danger">Preencha todos os campos.</span>`;
          return;
        }

        try {
          const res = await fetch('db/users-database.json');
          if (!res.ok) throw new Error('Falha ao carregar banco de dados.');
          const remoteUsers = await res.json();
          const localUsers = JSON.parse(localStorage.getItem('usuariosLocais')) || [];
          const allUsers = [...remoteUsers, ...localUsers];

          const userFound = allUsers.find(u => u.username.toLowerCase() === username.toLowerCase() && u.password === password);

          if (userFound) {
            localStorage.setItem("loggedUser", userFound.username);
            messageContainer.innerHTML = `<span class="text-success">Bem-vindo! Recarregando...</span>`;
            setTimeout(() => {
              popover.hide();
              location.reload();
            }, 1000);
          } else {
            messageContainer.innerHTML = `<span class="text-danger">Usuário ou senha inválidos.</span>`;
          }
        } catch (error) {
          console.error('Erro no login:', error);
          messageContainer.innerHTML = `<span class="text-danger">Erro ao tentar login.</span>`;
        }
      });
    });
  }

  function initializeLogout() {
      const logoutButton = document.getElementById('logout-button');
      if(logoutButton){
          logoutButton.addEventListener('click', (e) => {
              e.preventDefault();
              localStorage.removeItem('loggedUser');
              if(window.location.pathname.includes('usuario.html')){
                  window.location.href = 'index.html';
              } else {
                  location.reload();
              }
          });
      }
  }

  function highlightActivePage() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('#bottom-navbar .nav-link').forEach(link => {
      const pageName = link.dataset.pageName;
      if (currentPath.startsWith(pageName)) { link.classList.add('active-page-indicator'); }
    });
  }

  function updateCartNavbar() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    let totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
    const qtyBadge = document.getElementById("cart-qty-badge");
    if (qtyBadge) {
      if (totalQty > 0) {
        qtyBadge.textContent = totalQty;
        qtyBadge.style.display = "flex";
        if (parseInt(qtyBadge.dataset.prevQty || 0) !== totalQty) {
            qtyBadge.classList.add("animated");
            setTimeout(() => qtyBadge.classList.remove("animated"), 400);
        }
        qtyBadge.dataset.prevQty = totalQty;
      } else {
        qtyBadge.style.display = "none";
      }
    }
  }

  function updateFavoritesNavbar() {
    const likes = JSON.parse(localStorage.getItem("likes")) || {};
    const favoriteCount = Object.keys(likes).filter(id => !id.includes("-liked") && likes[id] > 0).length;
    const favoritesBadge = document.getElementById("favorites-qty");
    if (favoritesBadge) {
      if (favoriteCount > 0) {
        favoritesBadge.textContent = favoriteCount;
        favoritesBadge.style.display = "flex";
         if (parseInt(favoritesBadge.dataset.prevQty || 0) !== favoriteCount) {
            favoritesBadge.classList.add("animated");
            setTimeout(() => favoritesBadge.classList.remove("animated"), 400);
        }
        favoritesBadge.dataset.prevQty = favoriteCount;
      } else {
        favoritesBadge.style.display = "none";
      }
    }
  }
});