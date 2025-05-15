document.addEventListener("DOMContentLoaded", function () {
  const navbarHTML = `
<nav class="navbar primary-bg-color py-3" id="navbar">
  <div class="container d-flex flex-wrap flex-md-nowrap align-items-center justify-content-between gap-3">
    <a href="index.html" class="navbar-brand flex-shrink-0" style="max-width: 100px;">Vexor</a>
    <button class="navbar-toggler d-md-none" type="button" data-bs-toggle="collapse" data-bs-target="#navbarMain">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse d-md-flex justify-content-between align-items-center w-100 mt-3 mt-md-0" id="navbarMain">
      <form class="d-flex position-relative flex-grow-1 me-3" id="search-form" autocomplete="off">
        <i class="bi bi-search primary-color"></i>
        <input type="search" class="form-control me-2" id="search-input" placeholder="Busque seu Mouse..." aria-label="Search">
        <div id="search-results"></div>
        <button class="btn search-btn" type="submit">Pesquisar</button>
      </form>
      <ul class="navbar-nav flex-row gap-3 align-items-center mb-0">
        <li class="nav-item">
          <a href="login.html" class="nav-link"><i class="bi bi-person-fill"></i></a>
        </li>
        <li class="nav-item">
          <a href="favorite.html" class="nav-link position-relative">
            <i id="favorites-icon" class="bi bi-star-fill"></i>
            <span id="favorites-qty" class="qty-info" style="display:none;">0</span>
          </a>
        </li>
        <li class="nav-item" id="bag-item">
          <a href="cart.html" class="nav-link position-relative d-flex align-items-center">
            <i class="bi bi-cart-fill position-relative">
              <span id="cart-qty-badge" class="qty-info">0</span>
            </i>
            <strong id="cart-total-price" class="ms-2">R$ 0,00</strong>
          </a>
        </li>
      </ul>
    </div>
  </div>
</nav>

<nav class="navbar navbar-expand-lg secondary-bg-color p-2" id="bottom-navbar-container">
  <div class="container">
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#bottom-navbar">
      <i class="bi bi-list"></i>
    </button>
    <ul class="navbar-nav mb-2 mb-lg-0 collapse navbar-collapse" id="bottom-navbar">
      <li class="nav-item"><a href="index.html" class="nav-link">Home</a></li>
      <li class="nav-item"><a href="product.html" class="nav-link">Produtos</a></li>
      <li class="nav-item"><a href="mouse.html" class="nav-link">O que é um Mouse?</a></li>
      <li class="nav-item"><a href="contact.html" class="nav-link">Contato</a></li>
    </ul>
  </div>
</nav>
`;

  const style = document.createElement("style");
  style.textContent = `
#search-results {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: var(--primary-bg-color);
  border: 1px solid var(--muted-text-color);
  max-height: 300px;
  overflow-y: auto;
  z-index: 9999;
  display: none;
  opacity: 0;
  transition: all 0.3s ease;
}
#search-results.show {
  display: block;
  opacity: 1;
}
#search-results a {
  display: flex;
  align-items: center;
  padding: 10px;
  color: var(--text-color);
  text-decoration: none;
  border-bottom: 1px solid var(--muted-text-color);
}
#search-results a img {
  width: 40px;
  height: 40px;
  object-fit: contain;
  margin-right: 10px;
}
#search-results a:hover {
  background-color: var(--secondary-bg-color);
  color: white;
}
.search-btn {
  border: 2px solid var(--secondary-bg-color);
  background-color: transparent;
  color: var(--secondary-bg-color);
  font-weight: bold;
  transition: all 0.3s ease;
}
.search-btn:hover {
  background-color: var(--secondary-bg-color);
  color: white;
}
.qty-info {
  position: absolute;
  top: 0;
  right: 0;
  transform: translate(50%, -50%);
  background-color: var(--secondary-bg-color);
  color: white;
  font-size: 0.7rem;
  font-weight: bold;
  padding: 3px 6px;
  border-radius: 50%;
  display: none;
  min-width: 20px;
  text-align: center;
  z-index: 5;
}
@keyframes badge-bounce {
  0%, 100% { transform: translate(50%, -50%) scale(1); }
  50% { transform: translate(50%, -50%) scale(1.4); }
}
.qty-info.animate {
  animation: badge-bounce 0.5s;
}
@keyframes pulse-navbar {
  0% { transform: scale(1); }
  50% { transform: scale(1.3); }
  100% { transform: scale(1); }
}
.pulse-navbar {
  animation: pulse-navbar 0.4s ease;
}
`;

  document.head.appendChild(style);

  const navbarContainer = document.getElementById("navbar-container");
  if (navbarContainer) {
    navbarContainer.innerHTML = navbarHTML;
    updateCartNavbar();
    updateFavoritesNavbar();
  }
});

function updateCartNavbar() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  let totalQty = 0;
  let totalPrice = 0;

  cart.forEach((product) => {
    totalQty += product.quantity;
    totalPrice += product.quantity * product.pricePromo;
  });

  const qtyBadge = document.getElementById("cart-qty-badge");
  const totalPriceElem = document.getElementById("cart-total-price");

  if (qtyBadge && totalPriceElem) {
    if (totalQty > 0) {
      qtyBadge.style.display = "inline-block";
      qtyBadge.textContent = totalQty;
      totalPriceElem.textContent = `R$ ${totalPrice.toFixed(2)}`;
      qtyBadge.classList.add("animate");
      setTimeout(() => qtyBadge.classList.remove("animate"), 500);
    } else {
      qtyBadge.style.display = "none";
      totalPriceElem.textContent = "R$ 0,00";
    }
  }
}

function updateFavoritesNavbar() {
  const likes = JSON.parse(localStorage.getItem("likes")) || {};
  const favoriteIds = Object.keys(likes).filter(
    (id) => !id.includes("-liked") && likes[id] > 0
  );

  const favoritesBadge = document.getElementById("favorites-qty");
  const favoritesIcon = document.getElementById("favorites-icon");

  if (favoritesBadge && favoritesIcon) {
    if (favoriteIds.length > 0) {
      favoritesBadge.textContent = favoriteIds.length;
      favoritesBadge.style.display = "inline-block";
      favoritesIcon.classList.add("pulse-navbar");
      setTimeout(() => favoritesIcon.classList.remove("pulse-navbar"), 400);
    } else {
      favoritesBadge.style.display = "none";
    }
  }
}
