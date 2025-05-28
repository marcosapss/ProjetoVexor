document.addEventListener("DOMContentLoaded", async () => {
  const productId = new URLSearchParams(window.location.search).get("id");
  if (!productId) {
    window.location.href = 'index.html';
    return;
  }

  try {
    const response = await fetch("db/products-database.json");
    const allProducts = await response.json();
    const product = allProducts.find((p) => p.id == productId);

    if (!product) {
      alert("Produto não encontrado.");
      window.location.href = 'product.html';
      return;
    }

    document.title = `${product.name} - Vexor`;
    populateGalleryAndBadge(product); 
    populateInfoPanel(product);
    populateDetailsTabs(product);
    setupActionButtons(product);
    loadSuggestedProducts(allProducts, product.id, product.brand);

  } catch (error) {
    console.error("Erro ao carregar dados do produto:", error);
  }
});

function populateGalleryAndBadge(product) {
  const mainImageContainer = document.querySelector(".main-image-container"); 
  const mainImage = document.getElementById("main-product-image");
  const thumbnailsContainer = document.getElementById("product-thumbnails");
  const reviewsStarsContainer = document.getElementById("product-reviews-stars"); 

  if (!mainImageContainer || !mainImage || !thumbnailsContainer || !reviewsStarsContainer) { // Adicionada verificação para reviewsStarsContainer
      console.error("Elementos da galeria ou de reviews não encontrados!");
      return;
  }

  mainImage.src = product.imgMain;
  mainImage.alt = product.name; 
  thumbnailsContainer.innerHTML = "";

  const existingBadge = mainImageContainer.querySelector('.product-badge.badge-discount');
  if (existingBadge) {
    existingBadge.remove();
  }

  const originalPrice = parseFloat(product.priceOriginal);
  const promoPrice = parseFloat(product.pricePromo);
  
  if (!isNaN(originalPrice) && !isNaN(promoPrice) && originalPrice > promoPrice) {
      const discountPercent = Math.round(((originalPrice - promoPrice) / originalPrice) * 100);
      if (discountPercent > 0) { 
          const badgeElement = document.createElement('span');
          badgeElement.className = 'badge product-badge badge-discount';
          badgeElement.textContent = `-${discountPercent}%`;
          mainImageContainer.prepend(badgeElement); 
      }
  }

  product.thumbnails.forEach((thumbSrc, index) => {
    const thumb = document.createElement("img");
    thumb.src = thumbSrc;
    thumb.alt = `Thumbnail ${product.name} ${index + 1}`; 
    thumb.classList.add("thumbnail");
    if (index === 0) thumb.classList.add("active");
    thumb.addEventListener("click", () => {
      mainImage.src = thumbSrc;
      document.querySelectorAll(".thumbnail").forEach(t => t.classList.remove("active"));
      thumb.classList.add("active");
    });
    thumbnailsContainer.appendChild(thumb);
  });

  // Popular estrelas e contagem de avaliações
  if(product.reviews) {
    const rating = product.reviews.rating || 0;
    let starsHTML = '<div class="stars">'; // Removida margem daqui, CSS controla
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) starsHTML += '<i class="bi bi-star-fill"></i>';
        else if (i - 0.5 <= rating) starsHTML += '<i class="bi bi-star-half"></i>';
        else starsHTML += '<i class="bi bi-star"></i>';
    }
    starsHTML += `</div>`; // Fim do div.stars
    // Adiciona a contagem de reviews separadamente para melhor controle de estilo
    starsHTML += `<span class="review-count-text text-muted">${rating.toFixed(1)} (${product.reviews.count || 0})</span>`;
    reviewsStarsContainer.innerHTML = starsHTML;
  } else {
    reviewsStarsContainer.innerHTML = ''; // Limpa se não houver reviews
  }
}

// O restante do seu js/product-page.js permanece o mesmo:
// populateInfoPanel, populateDetailsTabs, setupActionButtons, addToCart, loadSuggestedProducts, showToast

function populateInfoPanel(product) {
  document.getElementById("product-name").textContent = product.name;
  const productModelEl = document.getElementById("product-model");
  if (productModelEl) {
    // A contagem de reviews agora está no gallery-footer
    productModelEl.textContent = `Modelo: ${product.model}`;
  }


  const featuresContainer = document.getElementById("key-features");
  if(featuresContainer && product.keyFeatures && product.keyFeatures.length > 0) {
    featuresContainer.innerHTML = `<h5 class="features-title">Destaques do Produto:</h5><ul>` + 
                                  product.keyFeatures.map(feature => `<li><i class="bi bi-check-circle-fill"></i> ${feature}</li>`).join('') + `</ul>`;
  } else if (featuresContainer) {
      featuresContainer.innerHTML = ''; 
  }


  const priceOriginalEl = document.getElementById("price-original");
  const pricePromoEl = document.getElementById("price-promo");
  const pixDiscountEl = document.getElementById("pix-discount");
  const installmentsEl = document.getElementById("installments");

  if (priceOriginalEl) {
    const originalPrice = parseFloat(product.priceOriginal);
    const promoPrice = parseFloat(product.pricePromo);
    if (!isNaN(originalPrice) && !isNaN(promoPrice) && originalPrice > promoPrice) {
        priceOriginalEl.textContent = `R$ ${originalPrice.toFixed(2)}`;
    } else {
        priceOriginalEl.textContent = ''; 
    }
  }
  if (pricePromoEl) pricePromoEl.textContent = `R$ ${parseFloat(product.pricePromo).toFixed(2)}`;
  if (pixDiscountEl) pixDiscountEl.innerHTML = `à vista no PIX com <strong>15% OFF</strong>`;
  
  if (installmentsEl) {
    const promoPrice = parseFloat(product.pricePromo);
    if (!isNaN(promoPrice)) {
        const parcelPrice = promoPrice / 0.90; 
        installmentsEl.innerHTML = `ou <strong>R$ ${parcelPrice.toFixed(2)}</strong> em até 12x de R$ ${(parcelPrice / 12).toFixed(2)} sem juros`;
    }
  }
}

function populateDetailsTabs(product) {
  const descriptionEl = document.getElementById("description-content");
  const specsTableBody = document.querySelector("#specs-table tbody");

  if(descriptionEl && product.description) {
      descriptionEl.innerHTML = `<p>${product.description.replace(/\n/g, '<br>')}</p>`;
  } else if (descriptionEl) {
      descriptionEl.innerHTML = '<p>Nenhuma descrição disponível para este produto.</p>';
  }
  
  if(specsTableBody && product.specifications) {
    let specsHTML = ''; 
    for (const [key, value] of Object.entries(product.specifications)) {
      specsHTML += `<tr><th scope="row" class="text-nowrap">${key}</th><td>${value}</td></tr>`;
    }
    specsTableBody.innerHTML = specsHTML; 
  } else if (specsTableBody) {
      specsTableBody.innerHTML = '<tr><td colspan="2">Nenhuma especificação técnica disponível.</td></tr>';
  }
}

function setupActionButtons(product) {
  const heartButton = document.getElementById("heart-button");
  const likes = JSON.parse(localStorage.getItem("likes")) || {};
  
  const updateHeartState = () => {
    if (!heartButton) return; 
    const isLiked = likes[product.id] > 0;
    heartButton.classList.toggle("is-favorite", isLiked);
    const heartIcon = heartButton.querySelector('i');
    if (heartIcon) heartIcon.className = isLiked ? 'bi bi-heart-fill' : 'bi bi-heart';
  };

  if (heartButton) {
    heartButton.addEventListener("click", () => {
      likes[product.id] = likes[product.id] > 0 ? 0 : 1;
      localStorage.setItem("likes", JSON.stringify(likes));
      updateHeartState();
      if (typeof updateFavoritesNavbar === "function") updateFavoritesNavbar();
    });
  }
  
  const shareButton = document.getElementById("share-button");
  if (shareButton) {
      shareButton.addEventListener("click", () => {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(window.location.href)
            .then(() => showToast("Link do produto copiado!"));
        } else {
            showToast("Não foi possível copiar o link.", "danger"); 
        }
    });
  }


  const addToCartButton = document.getElementById("add-to-cart");
  if (addToCartButton) {
    addToCartButton.addEventListener("click", () => {
        addToCart(product);
        showToast(`${product.name} foi adicionado ao carrinho!`, 'success');
    });
  }


  const buyButton = document.getElementById("buy-button-big");
  if (buyButton) {
    buyButton.addEventListener("click", () => {
        addToCart(product);
        buyButton.disabled = true;
        buyButton.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Processando...`;
        setTimeout(() => window.location.href = "cart.html", 1000);
    });
  }
  

  updateHeartState(); 
}

function addToCart(product) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const existingProduct = cart.find(item => item.id == product.id);
  if (existingProduct) {
    existingProduct.quantity = (existingProduct.quantity || 0) + 1; 
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  if (typeof updateCartNavbar === "function") updateCartNavbar();
}

function loadSuggestedProducts(allProducts, currentProductId, currentProductBrand) {
  const suggestionsGrid = document.getElementById("suggested-products-grid");
  if(!suggestionsGrid) return; 

  let suggestions = allProducts.filter(p => p.id != currentProductId); 
  
  let brandSuggestions = suggestions.filter(p => p.brand === currentProductBrand);
  let otherSuggestions = suggestions.filter(p => p.brand !== currentProductBrand);

  brandSuggestions.sort(() => 0.5 - Math.random());
  otherSuggestions.sort(() => 0.5 - Math.random());
  
  const finalSuggestions = brandSuggestions.slice(0, 4);
  if (finalSuggestions.length < 4) {
    finalSuggestions.push(...otherSuggestions.slice(0, 4 - finalSuggestions.length));
  }

  suggestionsGrid.innerHTML = finalSuggestions.slice(0,4).map(p => {
    const originalSuggPrice = parseFloat(p.priceOriginal);
    const promoSuggPrice = parseFloat(p.pricePromo);
    let suggDiscountBadgeHTML = '';
    if (!isNaN(originalSuggPrice) && !isNaN(promoSuggPrice) && originalSuggPrice > promoSuggPrice) {
        const suggDiscountPercent = Math.round(((originalSuggPrice - promoSuggPrice) / originalSuggPrice) * 100);
        if (suggDiscountPercent > 0) {
            suggDiscountBadgeHTML = `<span class="badge product-badge badge-discount" style="font-size: 0.65em; padding: 4px 7px; top: 8px; right: 8px;">-${suggDiscountPercent}%</span>`;
        }
    }

    return `
    <div class="col-6 col-md-4 col-lg-3 d-flex align-items-stretch mb-3">
      <a href="product-page.html?id=${p.id}" class="suggested-link w-100 text-decoration-none">
        <div class="card suggested-card h-100">
          <div class="product-image-container-suggested" style="height: 150px; display: flex; align-items: center; justify-content: center; padding: 10px; background-color: #fff; position: relative; border-radius: 0.5rem 0.5rem 0 0;">
             ${suggDiscountBadgeHTML}
             <img src="${p.imgMain}" alt="${p.name}" style="max-height: 100%; max-width: 100%; object-fit: contain;">
          </div>
          <div class="card-body p-2 d-flex flex-column text-center">
            <h5 class="card-title small fw-bold flex-grow-1" style="font-size: 0.9em;">${p.name}</h5>
            <p class="card-price small fw-bold mt-auto" style="font-size: 1.1em; color: var(--secondary-bg-color);">R$ ${parseFloat(p.pricePromo).toFixed(2)}</p>
          </div>
        </div>
      </a>
    </div>
  `}).join('');
}

function showToast(message, type = 'info') {
  const toastContainerGlobal = document.getElementById('toast-container-main');
  const toastContainerLocal = document.getElementById('toast');
  const finalToastContainer = toastContainerGlobal || toastContainerLocal || document.body;

  if (finalToastContainer.classList && finalToastContainer.classList.contains('toast-vexor')) {
      finalToastContainer.classList.remove('show');
      finalToastContainer.style.display = 'none';
  } else if (toastContainerGlobal) {
      const oldToasts = toastContainerGlobal.querySelectorAll('.toast-vexor');
      oldToasts.forEach(t => t.remove());
  }

  let toastBgClass = 'bg-secondary';
  let iconClass = 'bi-info-circle-fill';

  if (type === 'success') {
      toastBgClass = 'bg-success';
      iconClass = 'bi-check-circle-fill';
  } else if (type === 'danger') {
      toastBgClass = 'bg-danger';
      iconClass = 'bi-exclamation-triangle-fill';
  } else if (type === 'info') {
      toastBgClass = 'bg-primary';
  }

  const toastElement = document.createElement('div');
  toastElement.id = 'toast-notification-' + Date.now();
  toastElement.className = `toast-vexor align-items-center text-white ${toastBgClass} border-0 fade`;
  toastElement.setAttribute('role', 'alert');
  toastElement.setAttribute('aria-live', 'assertive');
  toastElement.setAttribute('aria-atomic', 'true');
  toastElement.setAttribute('data-bs-delay', '3000');

  toastElement.innerHTML = `
      <div class="d-flex p-2 align-items-center">
          <div class="toast-body d-flex align-items-center">
              <i class="bi ${iconClass} me-2" style="font-size: 1.2em;"></i>
              <span style="font-size: 0.95em;">${message}</span>
          </div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close" style="font-size: 0.8em;"></button>
      </div>
  `;
  
  const styleId = 'toast-vexor-style';
  if (!document.getElementById(styleId) && finalToastContainer !== toastContainerLocal) {
      const style = document.createElement('style');
      style.id = styleId;
      style.innerHTML = `
          .toast-vexor {
              position: fixed;
              bottom: 20px;
              left: 50%;
              transform: translateX(-50%);
              min-width: 280px;
              max-width: 90%;
              box-shadow: 0 0.25rem 0.75rem rgba(0, 0, 0, 0.15);
              z-index: 1090; 
              border-radius: 0.5rem;
          }
      `;
      document.head.appendChild(style);
  }
  
  finalToastContainer.appendChild(toastElement);
  
  const toast = new bootstrap.Toast(toastElement);
  toast.show();
  toastElement.addEventListener('hidden.bs.toast', () => toastElement.remove());
}