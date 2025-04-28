document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');
    let products = [];
  
    // Carrega o banco de dados de produtos
    fetch('db/products-database.json')
      .then(response => response.json())
      .then(data => {
        products = data;
      })
      .catch(error => console.error('Erro ao carregar produtos para busca:', error));
  
    // Quando o usuário digita
    if (searchInput) {
      searchInput.addEventListener('input', function () {
        const query = this.value.trim().toLowerCase();
        searchResults.innerHTML = '';
  
        if (query.length === 0) {
          searchResults.classList.remove('show');
          return;
        }
  
        const filtered = products.filter(product =>
          product.name.toLowerCase().includes(query)
        );
  
        if (filtered.length > 0) {
          filtered.slice(0, 5).forEach(product => {
            const a = document.createElement('a');
            a.href = `product-page.html?id=${product.id}`;
            a.innerHTML = `<img src="${product.imgMain}" alt="${product.name}"> ${product.name}`;
            searchResults.appendChild(a);
          });
          searchResults.classList.add('show');
        } else {
          const noResult = document.createElement('div');
          noResult.textContent = 'Nenhum produto encontrado.';
          noResult.style.padding = '10px';
          searchResults.appendChild(noResult);
          searchResults.classList.add('show');
        }
      });
  
      // Se clicar fora, fecha o dropdown
      document.addEventListener('click', function (e) {
        if (!searchResults.contains(e.target) && e.target !== searchInput) {
          searchResults.classList.remove('show');
        }
      });
  
      // Quando apertar ENTER
      searchInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          const query = searchInput.value.trim().toLowerCase();
          if (query.length > 0) {
            window.location.href = `product.html?search=${encodeURIComponent(query)}`;
          }
        }
      });
    }
  });
  