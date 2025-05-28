document.addEventListener('DOMContentLoaded', () => {
  const favoritesContainer = document.getElementById('favorites-container');
  const noFavorites = document.getElementById('no-favorites');
  const toast = document.getElementById('toast');

  const favorites = JSON.parse(localStorage.getItem('likes')) || {};
  const productIds = Object.keys(favorites).filter(id => !id.includes('-liked') && favorites[id] > 0);

  if (productIds.length === 0) {
    noFavorites.style.display = 'block';
    return;
  }

  fetch('db/products-database.json')
    .then(response => response.json())
    .then(products => {
      let foundAny = false;

      productIds.forEach(id => {
        const product = products.find(p => p.id == id);

        if (product) {
          foundAny = true;

          const col = document.createElement('div');
          col.className = 'col-md-3 col-10';

          col.innerHTML = `
              <div class="favorite-card">
                <img src="${product.imgMain}" alt="${product.name}">
                <h5>${product.name}</h5>
                <p>R$ ${parseFloat(product.pricePromo).toFixed(2)}</p>
                <div class="favorite-buttons">
                  <a href="product.html?id=${product.id}" class="btn btn-primary btn-sm"><i class="bi bi-eye-fill me-1"></i>Ver Produto</a>
                  <button class="btn btn-remove btn-sm" data-id="${product.id}"><i class="bi bi-trash-fill me-1"></i>Remover</button>
                </div>
              </div>
            `;

          favoritesContainer.appendChild(col);
        }
      });

      if (!foundAny) {
        noFavorites.style.display = 'block';
      }

      // Evento remover favoritos
      document.querySelectorAll('.btn-remove').forEach(button => {
        button.addEventListener('click', (e) => {
          const id = e.currentTarget.dataset.id;
          const likes = JSON.parse(localStorage.getItem('likes')) || {};

          delete likes[id];
          delete likes[id + '-liked'];
          localStorage.setItem('likes', JSON.stringify(likes));

          showToast("Produto removido dos favoritos!");
          setTimeout(() => location.reload(), 1000);
        });
      });
    })
    .catch(error => {
      console.error('Erro ao carregar produtos favoritos:', error);
      noFavorites.style.display = 'block';
    });

  function showToast(message) {
    toast.textContent = message;
    toast.style.display = 'block';
    setTimeout(() => {
      toast.style.display = 'none';
    }, 1500);
  }
});
