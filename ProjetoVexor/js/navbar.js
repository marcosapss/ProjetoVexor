// ProjetoVexor/js/navbar.js

document.addEventListener("DOMContentLoaded", function () {
  // Adiciona as fontes Orbitron e Montserrat para garantir o visual
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

  // --- Nova Estrutura HTML da Navbar ---
  const navbarHTML = `
    <nav class="navbar primary-bg-color py-3 fixed-top" id="main-navbar">
      <div class="container d-flex flex-wrap flex-md-nowrap align-items-center justify-content-between gap-3">
        <a href="index.html" class="navbar-brand flex-shrink-0">Vexor</a>
        
        <button class="navbar-toggler d-md-none" type="button" data-bs-toggle="collapse" data-bs-target="#navbarMain" aria-controls="navbarMain" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse d-md-flex justify-content-between align-items-center w-100 mt-3 mt-md-0" id="navbarMain">
          <form class="d-flex position-relative flex-grow-1 me-md-3 search-form-modern" id="search-form" autocomplete="off">
            <i class="bi bi-search search-icon primary-color"></i>
            <input type="search" class="form-control me-2 search-input-modern" id="search-input" placeholder="Busque seu Mouse..." aria-label="Search">
            <button type="button" class="btn-clear-search d-none" id="clear-search-btn"><i class="bi bi-x-circle-fill"></i></button>
            <div id="search-results" class="search-results-modern"></div>
            <button class="btn search-btn" type="submit">Pesquisar</button>
          </form>

          <ul class="navbar-nav flex-row gap-3 align-items-center mb-0 ms-md-auto">
            <li class="nav-item">
              <a href="login.html" class="nav-link" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Minha Conta" data-icon-page="login">
                <i class="bi bi-person-fill"></i>
              </a>
            </li>
            <li class="nav-item">
              <a href="favorite.html" class="nav-link position-relative" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Meus Favoritos" data-icon-page="favorite">
                <i id="favorites-icon" class="bi bi-heart-fill"></i>
                <span id="favorites-qty" class="qty-info" style="display:none;">0</span>
              </a>
            </li>
            <li class="nav-item" id="bag-item">
              <a href="cart.html" class="nav-link position-relative d-flex align-items-center" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Meu Carrinho" data-icon-page="cart">
                <i class="bi bi-cart-fill position-relative">
                  <span id="cart-qty-badge" class="qty-info">0</span>
                </i>
                <strong id="cart-total-price" class="ms-2 d-none d-lg-inline">R$ 0,00</strong>
              </a>
            </li>
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

  // --- Injeção e Inicialização ---
  const navbarContainer = document.getElementById("navbar-container");
  if (navbarContainer) {
    navbarContainer.innerHTML = navbarHTML;
    initializeNavbarFeatures();
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

    // Inicializa os tooltips do Bootstrap
    [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]')).map(function (el) {
      return new bootstrap.Tooltip(el);
    });

    const adjustBodyPadding = () => {
        const mainNavbarHeight = mainNavbar.offsetHeight;
        const bottomNavbarHeight = bottomNavbar.offsetHeight;
        document.body.style.paddingTop = `${mainNavbarHeight + bottomNavbarHeight}px`;
    };

    const handleScroll = () => {
        const mainNavbarHeight = mainNavbar.offsetHeight;
        if (window.scrollY > lastScrollY && window.scrollY > mainNavbarHeight) {
            mainNavbar.classList.add('hidden-up');
        } else {
            mainNavbar.classList.remove('hidden-up');
        }
        lastScrollY = window.scrollY;
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', adjustBodyPadding);
    
    // Atraso para garantir que tudo foi renderizado antes de calcular o padding
    setTimeout(adjustBodyPadding, 100); 

    // Lógica da Barra de Busca
    fetch("db/products-database.json")
      .then(response => response.json())
      .then(products => {
        productsCache = products;
      })
      .catch(err => console.error("Erro ao carregar produtos para a busca:", err));

    searchInput.addEventListener("input", () => {
      const query = searchInput.value.trim().toLowerCase();
      clearSearchBtn.classList.toggle('d-none', query === '');
      
      if (!query) {
        searchResults.classList.remove("show");
        return;
      }
      
      const results = productsCache.filter(p => p.name.toLowerCase().includes(query) || p.brand.toLowerCase().includes(query)).slice(0, 7);
      
      searchResults.innerHTML = results.length > 0 
        ? results.map(p => `
            <a href="product-page.html?id=${p.id}" class="search-result-item">
              <img src="${p.imgMain}" alt="${p.name}">
              <span>${p.name}</span>
            </a>`).join("") 
        : `<div class="p-2 text-muted">Nenhum produto encontrado.</div>`;
        
      searchResults.classList.add("show");
    });

    document.addEventListener("click", (e) => {
        if (!searchForm.contains(e.target)) {
            searchResults.classList.remove("show");
        }
    });

    clearSearchBtn.addEventListener('click', () => {
      searchInput.value = '';
      clearSearchBtn.classList.add('d-none');
      searchResults.classList.remove('show');
      searchInput.focus();
    });

    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const query = searchInput.value.trim();
      if (query) window.location.href = `product.html?search=${encodeURIComponent(query)}`;
    });

    // Atualização dos Badges
    window.updateCartNavbar = updateCartNavbar;
    window.updateFavoritesNavbar = updateFavoritesNavbar;
    updateCartNavbar();
    updateFavoritesNavbar();

    // Destaque da Página Ativa
    highlightActivePage();
  }

  function highlightActivePage() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    
    // Links de texto na navbar inferior
    document.querySelectorAll('#bottom-navbar .nav-link').forEach(link => {
      const pageName = link.dataset.pageName;
      if (currentPath.startsWith(pageName)) {
        link.classList.add('active-page-indicator');
      }
    });

    // Ícones na navbar superior
    const iconPageMap = {
      login: ['login.html', 'register.html', 'usuario.html', 'config.html'],
      favorite: ['favorite.html'],
      cart: ['cart.html']
    };

    document.querySelectorAll('#main-navbar .nav-link[data-icon-page]').forEach(link => {
      const iconPageKey = link.dataset.iconPage;
      if (iconPageMap[iconPageKey]?.includes(currentPath)) {
        link.classList.add('active-page-indicator-icon');
      }
    });
  }

  function updateCartNavbar() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    let totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
    let totalPrice = cart.reduce((sum, item) => sum + item.quantity * parseFloat(item.pricePromo), 0);
    
    const qtyBadge = document.getElementById("cart-qty-badge");
    const totalPriceElem = document.getElementById("cart-total-price");

    if (qtyBadge && totalPriceElem) {
      if (totalQty > 0) {
        qtyBadge.textContent = totalQty;
        qtyBadge.style.display = "flex";
        totalPriceElem.textContent = `R$ ${totalPrice.toFixed(2).replace('.', ',')}`;
        // Adiciona animação apenas se a quantidade mudou
        if (parseInt(qtyBadge.dataset.prevQty || 0) !== totalQty) {
            qtyBadge.classList.add("animated");
            setTimeout(() => qtyBadge.classList.remove("animated"), 400);
        }
        qtyBadge.dataset.prevQty = totalQty;
      } else {
        qtyBadge.style.display = "none";
        totalPriceElem.textContent = "R$ 0,00";
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