document.addEventListener("DOMContentLoaded", function () {
  const footerHTML = `
<footer id="footer">
  <div class="footer-top-line"></div>

  <div class="container-fluid footer-main">
    <div class="row gy-4">
      <div class="col-12 col-md-4 d-flex flex-column align-items-center text-center h-100">
        <h5 class="footer-title">Páginas</h5>
        <ul class="footer-links">
          <li><i class="bi bi-caret-right-fill"></i> <a href="index.html">Home</a></li>
          <li><i class="bi bi-caret-right-fill"></i> <a href="product.html">Produtos</a></li>
          <li><i class="bi bi-caret-right-fill"></i> <a href="index.html#promotion-grid">Promoções</a></li>
          <li><i class="bi bi-caret-right-fill"></i> <a href="#">Contato</a></li>
        </ul>
      </div>

      <div class="col-12 col-md-4 d-flex flex-column align-items-center text-center h-100">
        <h5 class="footer-title">Vexor</h5>
        <p class="footer-text">Alguma dúvida? Fale com a gente:</p>
        <p class="store-phone"><i class="bi bi-telephone"></i> (21) 99999-9999</p>
      </div>

      <div class="col-12 col-md-4 d-flex flex-column align-items-center text-center h-100">
        <h5 class="footer-title">Informações</h5>
        <ul class="footer-links">
          <li><i class="bi bi-caret-right-fill"></i> <a href="#">Política de Privacidade</a></li>
          <li><i class="bi bi-caret-right-fill"></i> <a href="#">Política de Entregas</a></li>
          <li><i class="bi bi-caret-right-fill"></i> <a href="#">Rastreie seu pedido</a></li>
        </ul>
      </div>
    </div>

    <div class="row mt-5">
      <div class="col-12 newsletter text-center">
        <h6 class="mb-3">Inscreva-se para receber novidades:</h6>
        <form class="d-flex flex-column flex-sm-row justify-content-center align-items-center gap-2">
          <input type="email" class="form-control" placeholder="Seu e-mail" required>
          <button type="submit" class="btn secondary-bg-color">Cadastrar</button>
        </form>
      </div>
    </div>

    <div class="row mt-4">
      <div class="col-12 social-icons text-center">
        <a href="#"><i class="bi bi-facebook"></i></a>
        <a href="#"><i class="bi bi-instagram"></i></a>
        <a href="#"><i class="bi bi-youtube"></i></a>
        <a href="#"><i class="bi bi-twitter"></i></a>
      </div>
    </div>

    <div class="row mt-5">
      <div class="col-12 text-center footer-quote">
        <blockquote>
          "Com grandes mouses, vêm grandes responsabilidades."<br>
          <cite>— Marcelle M.</cite>
        </blockquote>
      </div>
    </div>

    <div class="row mt-4">
      <div class="col-12 text-center footer-bottom">
        <p>© 2025 <span class="primary-color">Vexor</span> - Todos os direitos reservados</p>
      </div>
    </div>
  </div>
</footer>
`;

  const style = document.createElement("style");
  style.textContent = `
#footer {
  background: var(--primary-bg-color);
  color: var(--text-color);
  margin-top: 80px;
  padding-top: 40px;
  padding-bottom: 30px;
  width: 100%;
  overflow-x: hidden;
}

/* Se o tema for dark, a variável já traz gradiente! */
.footer-top-line {
  height: 3px;
  background: var(--secondary-bg-color);
  margin-bottom: 40px;
}

/* Títulos */
.footer-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 20px;
  position: relative;
}

.footer-title::after {
  content: "";
  display: block;
  width: 40px;
  height: 3px;
  background: var(--secondary-bg-color);
  margin: 8px auto 0;
}

/* Outros estilos como já mandei antes para links, social icons, frases, etc. */
`;

  document.head.appendChild(style);

  const footerContainer = document.getElementById("footer-container");
  if (footerContainer) {
    footerContainer.innerHTML = footerHTML;
  }
});
