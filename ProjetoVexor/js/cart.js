document.addEventListener("DOMContentLoaded", () => {
  const cartItemsContainer = document.getElementById("cart-items");
  const cartSummary = document.getElementById("cart-summary");
  const emptyCart = document.getElementById("empty-cart");
  const cartTotal = document.getElementById("cart-total");

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  function updateCart() {
    cartItemsContainer.innerHTML = "";
    let total = 0;

    if (cart.length === 0) {
      cartSummary.style.display = "none";
      emptyCart.style.display = "block";
      return;
    } else {
      cartSummary.style.display = "block";
      emptyCart.style.display = "none";
    }

    cart.forEach((product, index) => {
      const item = document.createElement("div");
      item.className = "cart-item";
      item.innerHTML = `
          <a href="product-page.html?id=${product.id}" target="_blank">
    <img src="${product.imgMain}" alt="${product.name}">
  </a>
          <div class="cart-item-details">
            <h3>${product.name}</h3>
            <p>Preço Unitário: R$ ${parseFloat(product.pricePromo).toFixed(
              2
            )}</p>
            <div class="cart-item-quantity">
              <button class="decrease" data-index="${index}">-</button>
              <span>${product.quantity}</span>
              <button class="increase" data-index="${index}">+</button>
            </div>
          </div>
          <div class="cart-item-remove" data-index="${index}">
            <i class="bi bi-trash"></i>
          </div>
        `;
      cartItemsContainer.appendChild(item);

      total += product.pricePromo * product.quantity;
    });

    cartTotal.textContent = `R$ ${total.toFixed(2)}`;

    setupEvents();
  }

  function setupEvents() {
    document.querySelectorAll(".increase").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const index = e.target.dataset.index;
        cart[index].quantity++;
        saveAndRender();
      });
    });

    document.querySelectorAll(".decrease").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const index = e.target.dataset.index;
        if (cart[index].quantity > 1) {
          cart[index].quantity--;
          saveAndRender();
        }
      });
    });

    document.querySelectorAll(".cart-item-remove").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const index = e.currentTarget.dataset.index;
        cart.splice(index, 1);
        saveAndRender();
      });
    });
  }

  function saveAndRender() {
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCart();
  }

  updateCart();

  document.getElementById("checkout-btn").addEventListener("click", () => {
    alert("Em breve: Finalizar compra!");
  });
});
