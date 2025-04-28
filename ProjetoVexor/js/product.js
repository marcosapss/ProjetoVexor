const productsContainer = document.getElementById("productpage_productsContainer");
const itemsPerPageSelect = document.getElementById("productpage_itemsPerPage") || { value: 12 };
const pagination = document.getElementById("productpage_pagination");
const gridViewBtn = document.getElementById("productpage_gridView");
const listViewBtn = document.getElementById("productpage_listView");

const filterBrand = document.getElementById("filter-brand");
const filterSensor = document.getElementById("filter-sensor");
const filterLighting = document.getElementById("filter-lighting");
const filterConnectivity = document.getElementById("filter-connectivity");
const sortPrice = document.getElementById("sort-price");

let productpage_products = [];
let currentPage = 1;
let itemsPerPage = parseInt(itemsPerPageSelect.value) || 12;
let viewMode = "grid"; // grid ou list

if (productsContainer) {
  // Buscar produtos do arquivo JSON
  fetch('db/products-database.json')
    .then((response) => response.json())
    .then((data) => {
      productpage_products = data;
      populateFilters();
      renderProducts();
    })
    .catch((error) => console.error("Erro ao carregar produtos:", error));
}

function populateFilters() {
  const brands = [...new Set(productpage_products.map((p) => p.brand))];
  const sensors = [...new Set(productpage_products.map((p) => p.sensor))];
  const lightings = [...new Set(productpage_products.map((p) => p.lighting))];
  const connectivities = [...new Set(productpage_products.map((p) => p.connectivity))];

  brands.forEach((brand) => {
    filterBrand.innerHTML += `<option value="${brand}">${brand}</option>`;
  });
  sensors.forEach((sensor) => {
    filterSensor.innerHTML += `<option value="${sensor}">${sensor}</option>`;
  });
  lightings.forEach((lighting) => {
    filterLighting.innerHTML += `<option value="${lighting}">${lighting}</option>`;
  });
  connectivities.forEach((connectivity) => {
    filterConnectivity.innerHTML += `<option value="${connectivity}">${connectivity}</option>`;
  });
}

function applyFilters(products) {
  let filtered = [...products];
  if (filterBrand?.value) filtered = filtered.filter((p) => p.brand === filterBrand.value);
  if (filterSensor?.value) filtered = filtered.filter((p) => p.sensor === filterSensor.value);
  if (filterLighting?.value) filtered = filtered.filter((p) => p.lighting === filterLighting.value);
  if (filterConnectivity?.value) filtered = filtered.filter((p) => p.connectivity === filterConnectivity.value);

  if (sortPrice?.value === "asc") {
    filtered.sort((a, b) => parseFloat(a.pricePromo) - parseFloat(b.pricePromo));
  } else if (sortPrice?.value === "desc") {
    filtered.sort((a, b) => parseFloat(b.pricePromo) - parseFloat(a.pricePromo));
  }

  return filtered;
}

function renderProducts() {
  productsContainer.innerHTML = "";

  // Pega o parâmetro "search" da URL
  const urlParams = new URLSearchParams(window.location.search);
  const searchQuery = urlParams.get('search')?.toLowerCase() || '';

  let filteredProducts = applyFilters(productpage_products);

  // Se tiver busca, filtra o que bater com o nome do produto
  if (searchQuery) {
    filteredProducts = filteredProducts.filter(product =>
      product.name.toLowerCase().includes(searchQuery)
    );
  }

  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const visibleProducts = filteredProducts.slice(start, end);

  if (visibleProducts.length === 0) {
    productsContainer.innerHTML = `
      <div class="col-12 text-center">
        <h4 class="text-muted">Nenhum produto encontrado.</h4>
      </div>
    `;
    pagination.innerHTML = '';
    return;
  }

  visibleProducts.forEach((product) => {
    const col = document.createElement("div");
    col.className = viewMode === "grid" ? "col-md-3" : "col-12";

    col.innerHTML = `
      <div class="card productpage_card h-100 p-2">
        <a href="product-page.html?id=${product.id}">
          <img src="${product.imgMain}" class="card-img-top" alt="${product.name}">
        </a>
        <div class="card-body text-center">
          <h5 class="card-title">${product.name}</h5>
          <p class="card-text text-success fw-bold">R$ ${product.pricePromo}</p>
          <a href="product-page.html?id=${product.id}" class="btn btn-primary btn-sm">Ver Produto</a>
        </div>
      </div>
    `;
    productsContainer.appendChild(col);
  });

  renderPagination(filteredProducts.length);
}


function renderPagination(totalItems) {
  pagination.innerHTML = "";
  const pages = Math.ceil(totalItems / itemsPerPage);

  for (let i = 1; i <= pages; i++) {
    const li = document.createElement("li");
    li.className = "page-item" + (i === currentPage ? " active" : "");
    li.innerHTML = `<button class="page-link">${i}</button>`;
    li.addEventListener("click", () => {
      currentPage = i;
      renderProducts();
    });
    pagination.appendChild(li);
  }
}

// Proteção nos filtros e ordenação
if (filterBrand) {
  filterBrand.addEventListener("change", () => {
    currentPage = 1;
    renderProducts();
  });
}
if (filterSensor) {
  filterSensor.addEventListener("change", () => {
    currentPage = 1;
    renderProducts();
  });
}
if (filterLighting) {
  filterLighting.addEventListener("change", () => {
    currentPage = 1;
    renderProducts();
  });
}
if (filterConnectivity) {
  filterConnectivity.addEventListener("change", () => {
    currentPage = 1;
    renderProducts();
  });
}
if (sortPrice) {
  sortPrice.addEventListener("change", () => {
    currentPage = 1;
    renderProducts();
  });
}
