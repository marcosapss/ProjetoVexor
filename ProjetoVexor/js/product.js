document.addEventListener("DOMContentLoaded", () => {
  const productsContainer = document.getElementById("productpage_productsContainer");
  const paginationContainer = document.getElementById("productpage_pagination");
  const productCountInfo = document.getElementById("product-count-info");
  
  const filterOffcanvasElement = document.getElementById('filterOffcanvas');
  const applyFiltersBtn = document.getElementById('apply-filters-btn');
  const clearFiltersBtn = document.getElementById('clear-filters-btn');
  const filterBrandOptions = document.getElementById('filter-brand-options');
  const filterMinPrice = document.getElementById('filter-min-price');
  const filterMaxPrice = document.getElementById('filter-max-price');
  const filterSensorOptions = document.getElementById('filter-sensor-options');
  const filterLightingOptions = document.getElementById('filter-lighting-options');
  const filterConnectivityOptions = document.getElementById('filter-connectivity-options');

  const sortOptions = document.getElementById("sort-options");

  let allProducts = [];
  let filteredProducts = [];
  let currentPage = 1;
  const itemsPerPage = 12; 

  let bsOffcanvasInstance = null;
  if (filterOffcanvasElement) {
    bsOffcanvasInstance = new bootstrap.Offcanvas(filterOffcanvasElement);
  }

  if (!productsContainer) {
    console.error("Elemento productpage_productsContainer não encontrado!");
    return;
  }

  fetchAndRenderProducts();

  async function fetchAndRenderProducts() {
    try {
      const response = await fetch('db/products-database.json');
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      allProducts = await response.json();
      
      populateOffcanvasFilters();
      applyAllFiltersAndSort(); 
      
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
      productsContainer.innerHTML = `<div class="col-12"><p class="text-danger text-center">Erro ao carregar produtos. Tente novamente mais tarde.</p></div>`;
    }
  }

  function populateOffcanvasFilters() {
    if (!allProducts.length) return;

    const brands = [...new Set(allProducts.map(p => p.brand))].sort();
    const sensors = [...new Set(allProducts.map(p => p.specifications?.Sensor))].filter(Boolean).sort();
    const lightings = [...new Set(allProducts.map(p => p.specifications?.Iluminação))].filter(Boolean).sort();
    const connectivities = [...new Set(allProducts.map(p => p.specifications?.Conectividade))].filter(Boolean).sort();

    populateCheckboxList(filterBrandOptions, brands, 'brand');
    populateCheckboxList(filterSensorOptions, sensors, 'sensor');
    populateCheckboxList(filterLightingOptions, lightings, 'lighting');
    populateCheckboxList(filterConnectivityOptions, connectivities, 'connectivity');

    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', () => {
            currentPage = 1;
            applyAllFiltersAndSort();
            if (bsOffcanvasInstance) bsOffcanvasInstance.hide();
        });
    }
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', () => {
            clearAllOffcanvasFilters();
            currentPage = 1;
            applyAllFiltersAndSort();
            // Opcional: if (bsOffcanvasInstance) bsOffcanvasInstance.hide(); 
        });
    }
    if (sortOptions) {
        sortOptions.addEventListener("change", () => {
            currentPage = 1;
            applyAllFiltersAndSort();
        });
    }
  }

  function populateCheckboxList(container, options, groupName) {
    if (!container) return;
    container.innerHTML = ''; 
    options.forEach((option, index) => {
      const div = document.createElement('div');
      div.className = 'form-check';
      div.innerHTML = `
        <input class="form-check-input" type="checkbox" value="${option}" id="${groupName}-${index}" name="${groupName}">
        <label class="form-check-label" for="${groupName}-${index}">
          ${option}
        </label>
      `;
      container.appendChild(div);
    });
  }

  function clearAllOffcanvasFilters() {
    if (filterOffcanvasElement) {
        filterOffcanvasElement.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
    }
    if (filterMinPrice) filterMinPrice.value = '';
    if (filterMaxPrice) filterMaxPrice.value = '';
  }

  function getSelectedCheckboxValues(groupName) {
    const selected = [];
    if (filterOffcanvasElement) {
        filterOffcanvasElement.querySelectorAll(`input[name="${groupName}"]:checked`).forEach(cb => {
            selected.push(cb.value);
        });
    }
    return selected;
  }

  function applyAllFiltersAndSort() {
    let tempProducts = [...allProducts];
    const urlParams = new URLSearchParams(window.location.search);

    // 1. Filtro por ESTILO DE JOGO vindo da index.html (parâmetro 'style')
    const playstyleFilterFromURL = urlParams.get('style');
    if (playstyleFilterFromURL) {
        tempProducts = tempProducts.filter(p => 
            p.playstyles && Array.isArray(p.playstyles) && p.playstyles.includes(playstyleFilterFromURL)
        );
        // Opcional: pré-selecionar filtros no Offcanvas com base neste estilo, se desejado.
        // Por agora, apenas filtra. Se o usuário abrir o Offcanvas, ele verá os filtros limpos.
    }

    // 2. Filtro por TERMO DE BUSCA (parâmetro 'search')
    const searchQuery = urlParams.get('search')?.toLowerCase();
    if (searchQuery) {
        tempProducts = tempProducts.filter(product =>
            product.name.toLowerCase().includes(searchQuery) ||
            product.brand.toLowerCase().includes(searchQuery) ||
            (product.keyFeatures && product.keyFeatures.some(kf => kf.toLowerCase().includes(searchQuery)))
      );
    }

    // 3. Filtros do Offcanvas (só aplicar se não veio filtro de estilo da URL ou integrar)
    // Para simplificar, se um `playstyleFilterFromURL` está ativo, os filtros do offcanvas não são aplicados
    // OU, você pode querer que eles se somem. Vamos somar:
    const selectedBrands = getSelectedCheckboxValues('brand');
    const minPrice = parseFloat(filterMinPrice?.value);
    const maxPrice = parseFloat(filterMaxPrice?.value);
    const selectedSensors = getSelectedCheckboxValues('sensor');
    const selectedLightings = getSelectedCheckboxValues('lighting');
    const selectedConnectivities = getSelectedCheckboxValues('connectivity');

    if (selectedBrands.length > 0) {
        tempProducts = tempProducts.filter(p => selectedBrands.includes(p.brand));
    }
    if (!isNaN(minPrice) && minPrice >=0) { // Adicionado minPrice >=0
        tempProducts = tempProducts.filter(p => parseFloat(p.pricePromo) >= minPrice);
    }
    if (!isNaN(maxPrice) && maxPrice > 0) { // Adicionado maxPrice > 0
        tempProducts = tempProducts.filter(p => parseFloat(p.pricePromo) <= maxPrice);
    }
    if (selectedSensors.length > 0) {
        tempProducts = tempProducts.filter(p => p.specifications?.Sensor && selectedSensors.includes(p.specifications.Sensor));
    }
    if (selectedLightings.length > 0) {
        tempProducts = tempProducts.filter(p => p.specifications?.Iluminação && selectedLightings.includes(p.specifications.Iluminação));
    }
    if (selectedConnectivities.length > 0) {
        tempProducts = tempProducts.filter(p => p.specifications?.Conectividade && selectedConnectivities.includes(p.specifications.Conectividade));
    }
    
    // 4. Ordenação
    const sortValue = sortOptions.value;
    if (sortValue === "price-asc") {
      tempProducts.sort((a, b) => parseFloat(a.pricePromo) - parseFloat(b.pricePromo));
    } else if (sortValue === "price-desc") {
      tempProducts.sort((a, b) => parseFloat(b.pricePromo) - parseFloat(a.pricePromo));
    } else if (sortValue === "rating-desc") {
      tempProducts.sort((a, b) => (b.reviews?.rating || 0) - (a.reviews?.rating || 0));
    }
    // "relevance" não precisa de sort explícito aqui, usa a ordem atual (pós-filtros)

    filteredProducts = tempProducts;
    renderProductPage();
  }


  function renderProductPage() {
    if (!productsContainer) return;
    productsContainer.innerHTML = ""; 

    const totalItems = filteredProducts.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    
    if (currentPage > totalPages && totalPages > 0) currentPage = totalPages;
    if (currentPage < 1 && totalItems > 0) currentPage = 1; 
    else if (totalItems === 0) currentPage = 1; 

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedProducts = filteredProducts.slice(start, end);

    if (paginatedProducts.length === 0 && totalItems === 0) { 
      productsContainer.innerHTML = `
        <div class="col-12">
          <div class="no-products-message">
            <i class="bi bi-mouse2-fill"></i>
            <h4>Nenhum produto encontrado</h4>
            <p>Tente ajustar seus filtros ou clique em "Limpar Filtros".</p>
          </div>
        </div>`;
    } else {
      paginatedProducts.forEach(product => {
        const col = document.createElement("div");
        col.className = "col-6 col-md-4 col-lg-3 mb-4 d-flex align-items-stretch"; 
        col.innerHTML = createProductCardHTML(product);
        productsContainer.appendChild(col);
      });
    }
    
    updateProductCountInfo(start, end, totalItems);
    renderPagination(totalPages);
    addCardEventListeners();
  }

  function createProductCardHTML(product) {
    const originalPrice = parseFloat(product.priceOriginal);
    const promoPrice = parseFloat(product.pricePromo);
    let discountBadgeHTML = '';
    
    if (!isNaN(originalPrice) && !isNaN(promoPrice) && originalPrice > promoPrice) {
        const discountPercent = Math.round(((originalPrice - promoPrice) / originalPrice) * 100);
        if (discountPercent > 0) { 
            discountBadgeHTML = `<span class="badge product-badge badge-discount">-${discountPercent}%</span>`;
        }
    }
    
    const originalPriceHTML = (!isNaN(originalPrice) && !isNaN(promoPrice) && originalPrice > promoPrice)
      ? `<span class="price-original me-2">R$ ${originalPrice.toFixed(2)}</span>`
      : '';
    
    let starsHTML = '';
    if (product.reviews && product.reviews.rating) {
        const rating = product.reviews.rating;
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) starsHTML += '<i class="bi bi-star-fill"></i>';
            else if (i - 0.5 <= rating) starsHTML += '<i class="bi bi-star-half"></i>';
            else starsHTML += '<i class="bi bi-star"></i>';
        }
        starsHTML += `<span class="review-count">(${product.reviews.count || 0})</span>`;
    }

    const likes = JSON.parse(localStorage.getItem("likes")) || {};
    const isFavorite = likes[product.id] > 0;

    return `
      <div class="product-card card h-100">
        <a href="product-page.html?id=${product.id}" class="product-card-link text-decoration-none">
          <div class="product-image-container">
            ${discountBadgeHTML}
            <img src="${product.imgMain}" class="card-img-top" alt="${product.name}">
          </div>
        </a>
        <div class="card-body d-flex flex-column">
          ${starsHTML ? `<div class="product-rating mb-2 d-flex align-items-center">${starsHTML}</div>` : '<div class="mb-2" style="height: 21px;"></div>'}
          <h5 class="product-brand text-muted small">${product.brand}</h5>
          <a href="product-page.html?id=${product.id}" class="text-decoration-none">
            <h4 class="product-name card-title h6">${product.name}</h4>
          </a>
          <div class="product-price mt-auto">
            ${originalPriceHTML}
            <span class="price-promo fw-bold">R$ ${promoPrice.toFixed(2)}</span>
          </div>
        </div>
        <div class="card-footer product-actions">
          <button class="btn btn-sm btn-outline-success add-to-cart-list" data-id="${product.id}" title="Adicionar ao Carrinho"><i class="bi bi-cart-plus me-1"></i>Adicionar</button>
          <button class="btn btn-sm btn-outline-danger favorite-list ${isFavorite ? 'active-favorite' : ''}" data-id="${product.id}" title="Favoritar"><i class="bi bi-heart"></i></button>
          <a href="product-page.html?id=${product.id}" class="btn btn-sm btn-primary see-product-list"><i class="bi bi-eye"></i></a>
        </div>
      </div>
    `;
  }

  function updateProductCountInfo(start, end, totalItems) {
    if (!productCountInfo) return;
    if (totalItems === 0) {
      productCountInfo.textContent = "Nenhum produto encontrado.";
    } else {
      const currentEnd = Math.min(end, totalItems);
      productCountInfo.textContent = `Mostrando ${start + 1} - ${currentEnd} de ${totalItems} produtos`;
    }
  }
  
  function renderPagination(totalPages) {
    if (!paginationContainer) return;
    paginationContainer.innerHTML = "";
    if (totalPages <= 1) return;

    const createPageItem = (page, text, isDisabled = false, isActive = false) => { /* ... */ }; // Sua função createPageItem
    
    // ... (lógica de renderPagination como antes)
    const createPageItemInternal = (page, text, isDisabled = false, isActive = false) => {
        const li = document.createElement("li");
        li.className = `page-item ${isDisabled ? 'disabled' : ''} ${isActive ? 'active' : ''}`;
        const button = document.createElement("button");
        button.className = "page-link";
        if (page !== null) button.dataset.page = page; // Apenas adiciona data-page se page não for null (para elipses)
        button.innerHTML = text;
        if (isDisabled && page === null) {
            button.tabIndex = -1; // Torna a elipse não focável
        }
        li.appendChild(button);
        return li;
    };
    
    paginationContainer.appendChild(createPageItemInternal(currentPage - 1, `<span aria-hidden="true">&laquo;</span>`, currentPage === 1));

    const maxPagesToShow = 3; 
    const halfPagesToShow = Math.floor(maxPagesToShow / 2);

    let startPage = Math.max(1, currentPage - halfPagesToShow);
    let endPage = Math.min(totalPages, currentPage + halfPagesToShow);

    if (currentPage - halfPagesToShow <= 1) {
        endPage = Math.min(totalPages, maxPagesToShow);
    }
    if (currentPage + halfPagesToShow >= totalPages) {
        startPage = Math.max(1, totalPages - maxPagesToShow + 1);
    }
    
    if (startPage > 1) {
        paginationContainer.appendChild(createPageItemInternal(1, '1'));
        if (startPage > 2) {
            paginationContainer.appendChild(createPageItemInternal(null, '...', true));
        }
    }

    for (let i = startPage; i <= endPage; i++) {
        paginationContainer.appendChild(createPageItemInternal(i, i.toString(), false, i === currentPage));
    }

    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            paginationContainer.appendChild(createPageItemInternal(null, '...', true));
        }
        paginationContainer.appendChild(createPageItemInternal(totalPages, totalPages.toString()));
    }
    
    paginationContainer.appendChild(createPageItemInternal(currentPage + 1, `<span aria-hidden="true">&raquo;</span>`, currentPage === totalPages));


    paginationContainer.querySelectorAll(".page-link").forEach(button => {
      // Apenas adiciona listener se não for um item desabilitado que é uma elipse
      if(button.parentElement.classList.contains('disabled') && button.dataset.page === undefined) return; 

      button.addEventListener("click", (e) => {
        const targetButton = e.target.closest('.page-link');
        if (!targetButton.dataset.page) return; // Ignora cliques em elipses
        
        const page = parseInt(targetButton.dataset.page);
        if (!isNaN(page) && page !== currentPage && page > 0 && page <= totalPages) {
          currentPage = page;
          renderProductPage();
          const controlsBarTop = document.querySelector('.controls-bar')?.offsetTop || 0;
          window.scrollTo({ top: controlsBarTop - 70, behavior: 'smooth' });
        }
      });
    });
  }

  function addCardEventListeners() {
    document.querySelectorAll(".add-to-cart-list").forEach(button => {
      button.addEventListener("click", function() {
        const productId = this.dataset.id;
        const product = allProducts.find(p => p.id == productId);
        if (product) {
          addProductToCart(product);
        }
      });
    });

    document.querySelectorAll(".favorite-list").forEach(button => {
      button.addEventListener("click", function() {
        const productId = this.dataset.id;
        toggleFavorite(productId, this);
      });
    });
  }

  function addProductToCart(product) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingProduct = cart.find(item => item.id == product.id);
    if (existingProduct) {
      existingProduct.quantity = (existingProduct.quantity || 0) + 1; 
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    if (typeof updateCartNavbar === "function") updateCartNavbar();
    showToast(`${product.name} adicionado ao carrinho!`, 'success');
  }

  function toggleFavorite(productId, buttonElement) {
    let likes = JSON.parse(localStorage.getItem("likes")) || {};
    const product = allProducts.find(p => p.id == productId);
    if (!product) return;

    const heartIcon = buttonElement.querySelector('i');

    if (likes[productId] > 0) {
      likes[productId] = 0; 
      buttonElement.classList.remove('active-favorite');
      if (heartIcon) heartIcon.className = 'bi bi-heart';
      showToast(`${product.name} removido dos favoritos.`, 'info');
    } else {
      likes[productId] = 1;
      buttonElement.classList.add('active-favorite');
      if (heartIcon) heartIcon.className = 'bi bi-heart-fill';
      showToast(`${product.name} adicionado aos favoritos!`, 'success');
    }
    localStorage.setItem("likes", JSON.stringify(likes));
    if (typeof updateFavoritesNavbar === "function") updateFavoritesNavbar();
  }

  function showToast(message, type = 'info') {
      const toastContainer = document.getElementById('toast-container-main') || document.body; 
      const toastId = 'toast-' + Date.now();
      let bgColorClass = 'bg-secondary'; 
      if (type === 'success') bgColorClass = 'bg-success';
      if (type === 'danger') bgColorClass = 'bg-danger';
      if (type === 'info') bgColorClass = 'bg-primary';

      const toastHTML = `
          <div id="${toastId}" class="toast align-items-center text-white ${bgColorClass} border-0" role="alert" aria-live="assertive" aria-atomic="true" data-bs-delay="3000">
              <div class="d-flex">
                  <div class="toast-body d-flex align-items-center">
                       <i class="bi ${type === 'success' ? 'bi-check-circle-fill' : type === 'info' ? 'bi-info-circle-fill' : 'bi-exclamation-triangle-fill'} me-2" style="font-size: 1.2em;"></i>
                      <span style="font-size: 0.95em;">${message}</span>
                  </div>
                  <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close" style="font-size: 0.8em;"></button>
              </div>
          </div>
      `;
      toastContainer.insertAdjacentHTML('beforeend', toastHTML);
      
      const toastElement = document.getElementById(toastId);
      const toast = new bootstrap.Toast(toastElement);
      toast.show();
      toastElement.addEventListener('hidden.bs.toast', () => toastElement.remove());
  }

});