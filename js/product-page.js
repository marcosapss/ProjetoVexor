document.addEventListener("DOMContentLoaded", () => {
  const productId = new URLSearchParams(window.location.search).get("id");

  fetch("db/products-database.json")
    .then((response) => response.json())
    .then((data) => {
      const product = data.find((p) => p.id == productId);

      if (!product) return alert("Produto não encontrado.");

      // Preenche as informações
      document.getElementById("product-name").textContent = product.name;
      document.getElementById("main-product-image").src = product.imgMain;
      document.getElementById("price-original").textContent = `R$ ${parseFloat(
        product.priceOriginal
      ).toFixed(2)}`;
      document.getElementById("price-promo").textContent = `R$ ${parseFloat(
        product.pricePromo
      ).toFixed(2)}`;
      document.getElementById(
        "pix-discount"
      ).innerHTML = `À vista no PIX ou Boleto com <strong>15% OFF</strong>`;

      const parcelPrice = product.pricePromo * 1.15;
      const parcelInstallment = (parcelPrice / 12).toFixed(2);
      document.getElementById("installments").innerHTML = `
        <p>R$ ${parcelPrice.toFixed(2)} à prazo</p>
        <p>Em até 12x de R$ ${parcelInstallment} sem juros no cartão</p>
        <p>Ou em 1x com <strong>10% OFF</strong></p>
      `;

      document.getElementById("product-brand").textContent = product.brand;
      document.getElementById("product-model").textContent = product.model;
      document.getElementById("product-dpi").textContent = product.dpi;
      document.getElementById("product-sensor").textContent = product.sensor;
      document.getElementById("product-lighting").textContent =
        product.lighting;
      document.getElementById("product-connectivity").textContent =
        product.connectivity;

      // Thumbnails
      const thumbnailsContainer = document.getElementById("product-thumbnails");
      thumbnailsContainer.innerHTML = "";
      product.thumbnails.forEach((thumb, index) => {
        const img = document.createElement("img");
        img.src = thumb;
        img.alt = `Thumbnail ${index + 1}`;
        img.classList.add("thumbnail");
        if (index === 0) img.classList.add("active");

        img.addEventListener("click", () => {
          document.getElementById("main-product-image").src = thumb;
          document
            .querySelectorAll(".thumbnail")
            .forEach((t) => t.classList.remove("active"));
          img.classList.add("active");
        });

        thumbnailsContainer.appendChild(img);
      });

      // Likes
      const heartIcon = document.getElementById("heart-icon");
      const popularityStars = document.getElementById("popularity-stars");
      const likes = JSON.parse(localStorage.getItem("likes")) || {};
      let likeCount = likes[productId] || 0;
      updatePopularity(likeCount);

      if (likes[productId + "-liked"]) {
        heartIcon.classList.replace("bi-heart", "bi-heart-fill");
      }

      heartIcon.addEventListener("click", () => {
        if (likes[productId + "-liked"]) {
          likes[productId]--;
          likes[productId + "-liked"] = false;
          heartIcon.classList.replace("bi-heart-fill", "bi-heart");
        } else {
          likes[productId] = (likes[productId] || 0) + 1;
          likes[productId + "-liked"] = true;
          heartIcon.classList.replace("bi-heart", "bi-heart-fill");
        }
        localStorage.setItem("likes", JSON.stringify(likes));
        updatePopularity(likes[productId]);
      });

      function updatePopularity(likes) {
        const stars = popularityStars.querySelectorAll("i");
        stars.forEach((star) => star.classList.remove("filled"));

        let numStars = 0;
        if (likes >= 80) numStars = 5;
        else if (likes >= 60) numStars = 4;
        else if (likes >= 40) numStars = 3;
        else if (likes >= 20) numStars = 2;
        else if (likes > 0) numStars = 1;

        for (let i = 0; i < numStars; i++) {
          stars[i].classList.add("filled");
        }
      }

      // Share
      document
        .getElementById("share-icon")
        .addEventListener("click", (event) => {
          navigator.clipboard.writeText(window.location.href).then(() => {
            const toast = document.getElementById("toast");
            toast.textContent = "Link copiado!";
            toast.style.display = "block";
            setTimeout(() => {
              toast.style.display = "none";
            }, 1500);
          });
        });

      // Botão pequeno "Adicionar ao carrinho"
      document.getElementById("add-to-cart").addEventListener("click", () => {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        const found = cart.find((item) => item.id === product.id);

        if (found) found.quantity++;
        else cart.push({ ...product, quantity: 1 });

        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartNavbar();

        const toast = document.getElementById("toast");
        toast.textContent = "Produto adicionado ao carrinho!";
        toast.style.display = "block";
        setTimeout(() => {
          toast.style.display = "none";
        }, 1500);
      });

      // Botão grande "Comprar" com loading animado
      const buyButton = document.getElementById("buy-button-big");

      buyButton.addEventListener("click", () => {
        buyButton.disabled = true;
        const originalText = buyButton.innerHTML;
        buyButton.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Processando...`;

        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        const found = cart.find((item) => item.id === product.id);

        if (found) {
          found.quantity++;
        } else {
          cart.push({ ...product, quantity: 1 });
        }

        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartNavbar();

        setTimeout(() => {
          window.location.href = "cart.html";
        }, 1000);
      });
    })
    .catch((error) => console.error("Erro ao carregar produto:", error));
});
