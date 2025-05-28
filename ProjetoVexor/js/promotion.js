document.addEventListener("DOMContentLoaded", function () {
  const promotionGrid = document.getElementById('promotion-grid');

  if (!promotionGrid) {
    return;
  }

  const h2 = promotionGrid.previousElementSibling;

  if (h2 && h2.parentElement) {
    function createTopSpacing() {
      const spacingTop = document.createElement('div');
      spacingTop.style.height = '40px';
      h2.parentElement.insertBefore(spacingTop, h2);
    }
    createTopSpacing();
  }

  if (h2 && h2.parentElement) {
    function createBottomSpacing() {
      const spacingBottom = document.createElement('div');
      spacingBottom.style.height = '40px';
      h2.parentElement.insertBefore(spacingBottom, promotionGrid);
    }
    createBottomSpacing();
  }

  function getDisplaySettings() {
    const screenWidth = window.innerWidth;
    if (screenWidth < 768) {
      return {
        limit: 4,
        skeletons: 4,
        columnClass: 'col-12 col-sm-6 mb-4 d-flex justify-content-center'
      };
    } else {
      return {
        limit: 9,
        skeletons: 9,
        columnClass: 'col-12 col-sm-6 col-md-4 mb-4 d-flex justify-content-center'
      };
    }
  }

  let currentDisplaySettings = getDisplaySettings();

  function showSkeletons() {
    promotionGrid.innerHTML = '';
    for (let i = 0; i < currentDisplaySettings.skeletons; i++) {
      const skeletonCol = document.createElement('div');
      skeletonCol.className = currentDisplaySettings.columnClass;
      skeletonCol.innerHTML = `
        <div class="card skeleton-card" style="width: 288px;">
          <div class="skeleton-image"></div>
          <div class="card-body text-center">
            <div class="skeleton-text mb-2"></div>
            <div class="skeleton-text short"></div>
          </div>
        </div>
      `;
      promotionGrid.appendChild(skeletonCol);
    }
  }

  function renderPromotions(products) {
    const promos = products.filter(p => p.pricePromo && p.priceOriginal && parseFloat(p.priceOriginal) > parseFloat(p.pricePromo));

    if (promos.length === 0) {
      promotionGrid.innerHTML = '<p class="text-center col-12">Nenhum produto em promoção no momento.</p>';
      return;
    }

    promos.sort(() => 0.5 - Math.random());
    const selected = promos.slice(0, currentDisplaySettings.limit);

    promotionGrid.innerHTML = '';

    selected.forEach(product => {
      const originalPrice = parseFloat(product.priceOriginal);
      const promoPrice = parseFloat(product.pricePromo);
      let discountBadgeHTML = '';

      if (!isNaN(originalPrice) && !isNaN(promoPrice) && originalPrice > promoPrice) {
        const discountPercent = Math.round(((originalPrice - promoPrice) / originalPrice) * 100);
        if (discountPercent > 0) {
          discountBadgeHTML = `
                <span class="badge bg-danger position-absolute top-0 end-0 m-2 p-1 px-2" 
                      style="font-size: 0.8em; z-index: 10; transform: rotate(0deg); border-radius: 0.25rem;"> 
                  -${discountPercent}%
                </span>`;
        }
      }

      const col = document.createElement('div');
      col.className = currentDisplaySettings.columnClass;
      col.innerHTML = `
        <div class="card promo-card text-center h-100">
          <div class="promo-card-content-wrapper">
            <a href="product-page.html?id=${product.id}" class="text-decoration-none d-block" style="flex-grow: 1; display: flex; flex-direction: column;">
              <div class="image-container position-relative">
                ${discountBadgeHTML}
                <img src="${product.imgMain}" class="card-img-top" alt="${product.name}">
              </div>
              <div class="card-body d-flex flex-column">
                <h5 class="card-title product-name-promo">${product.name}</h5>
                <div class="price-area mt-auto">
                  ${originalPrice > promoPrice ? `<span class="text-muted text-decoration-line-through price-original-promo">R$ ${originalPrice.toFixed(2)}</span><br>` : ''}
                  <span class="text-success fw-bold price-promo-promo">R$ ${promoPrice.toFixed(2)}</span>
                </div>
              </div>
            </a>
          </div>
        </div>
      `;
      promotionGrid.appendChild(col);
    });
  }

  showSkeletons();
  fetch('db/products-database.json')
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(products => {
      renderPromotions(products);
    })
    .catch(error => {
      console.error('Erro ao carregar produtos promocionais:', error);
      promotionGrid.innerHTML = '<p class="text-center text-danger col-12">Erro ao carregar produtos.</p>';
    });

  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      const newSettings = getDisplaySettings();
      if (newSettings.limit !== currentDisplaySettings.limit || newSettings.columnClass !== currentDisplaySettings.columnClass) {
        currentDisplaySettings = newSettings;
        showSkeletons();
        fetch('db/products-database.json')
          .then(response => response.json())
          .then(products => renderPromotions(products))
          .catch(error => console.error('Erro ao recarregar produtos no resize:', error));
      }
    }, 250);
  });
});