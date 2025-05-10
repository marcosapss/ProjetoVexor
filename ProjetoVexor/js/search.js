console.log("✅ search.js carregado");

const waitForSearchForm = setInterval(() => {
  const searchForm = document.getElementById("search-form");
  const searchInput = document.getElementById("search-input");
  const searchResults = document.getElementById("search-results");

  if (searchForm && searchInput && searchResults) {
    console.log("🔧 Elementos de busca carregados!");
    clearInterval(waitForSearchForm);

    let productsCache = [];

    // Carrega os produtos uma vez só
    fetch("db/products-database.json")
      .then(response => {
        if (!response.ok) throw new Error("Arquivo JSON não encontrado");
        return response.json();
      })
      .then(products => {
        productsCache = products;
        console.log("📦 Produtos carregados e cacheados:", productsCache);
      })
      .catch((err) => {
        console.error("❌ Erro ao carregar produtos:", err);
      });

    // Evento ao digitar (ao vivo!)
    searchInput.addEventListener("input", () => {
      const query = searchInput.value.trim().toLowerCase();

      if (!query) {
        searchResults.classList.remove("show");
        return;
      }

      const results = productsCache.filter(product =>
        product.name.toLowerCase().includes(query)
      );

      if (results.length > 0) {
        searchResults.innerHTML = results.map(product => `
          <a href="product-page.html?id=${product.id}">
            <img src="${product.imgMain}" alt="${product.name}">
            <span>${product.name}</span>
          </a>
        `).join("");
      } else {
        searchResults.innerHTML = `<div class="p-2 text-muted">Nenhum produto encontrado.</div>`;
      }

      searchResults.classList.remove("d-none");
      searchResults.classList.add("show");
    });

    // Oculta ao clicar fora
    document.addEventListener("click", function (e) {
      if (!searchForm.contains(e.target)) {
        searchResults.classList.remove("show");
      }
    });
  }
}, 100);
