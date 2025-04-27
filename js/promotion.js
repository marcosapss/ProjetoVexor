document.addEventListener("DOMContentLoaded", function () {
  const promotionGrid = document.getElementById('promotion-grid');
  const h2 = promotionGrid.previousElementSibling; // o h2 que está antes da grid

  // Cria espaçamento acima do H2
  function createTopSpacing() {
    const spacingTop = document.createElement('div');
    spacingTop.style.height = '40px'; // altura do espaço acima do h2
    h2.parentElement.insertBefore(spacingTop, h2);
  }

  // Cria espaçamento abaixo do H2 (antes dos cards)
  function createBottomSpacing() {
    const spacingBottom = document.createElement('div');
    spacingBottom.style.height = '40px'; // altura do espaço abaixo do h2
    h2.parentElement.insertBefore(spacingBottom, promotionGrid);
  }

  createTopSpacing();
  createBottomSpacing();

  function showSkeletons() {
    promotionGrid.innerHTML = '';
    for (let i = 0; i < 9; i++) {
      const skeleton = document.createElement('div');
      skeleton.className = 'col-12 col-sm-6 col-md-4 mb-4 d-flex justify-content-center';
      skeleton.innerHTML = `
        <div class="card skeleton-card">
          <div class="skeleton-image"></div>
          <div class="card-body text-center">
            <div class="skeleton-text mb-2"></div>
            <div class="skeleton-text short"></div>
          </div>
        </div>
      `;
      promotionGrid.appendChild(skeleton);
    }
  }

  showSkeletons();

  fetch('db/products-database.json')
    .then(response => response.json())
    .then(products => {
      const promos = products.filter(p => p.pricePromo);

      if (promos.length === 0) {
        promotionGrid.innerHTML = '<p class="text-center">Nenhum produto em promoção no momento.</p>';
        return;
      }

      promos.sort(() => 0.5 - Math.random());
      const selected = promos.slice(0, 9);

      promotionGrid.innerHTML = '';

      selected.forEach(product => {
        const col = document.createElement('div');
        col.className = 'col-12 col-sm-6 col-md-4 mb-4 d-flex justify-content-center';
        col.innerHTML = `
          <div class="card promo-card text-center">
            <a href="product-page.html?id=${product.id}">
              <div class="image-container">
                <img src="${product.imgMain}" class="card-img-top" alt="${product.name}">
              </div>
            </a>
            <div class="card-body">
              <h5 class="card-title">${product.name}</h5>
              <p class="card-text">
                <span class="text-muted text-decoration-line-through">R$ ${parseFloat(product.priceOriginal).toFixed(2)}</span><br>
                <span class="text-success fw-bold">R$ ${parseFloat(product.pricePromo).toFixed(2)}</span>
              </p>
              <a href="product-page.html?id=${product.id}" class="btn btn-primary btn-sm">Ver Produto</a>
            </div>
          </div>
        `;
        promotionGrid.appendChild(col);
      });
    })
    .catch(error => {
      console.error('Erro ao carregar produtos promocionais:', error);
      promotionGrid.innerHTML = '<p class="text-center text-danger">Erro ao carregar produtos.</p>';
    });
});
