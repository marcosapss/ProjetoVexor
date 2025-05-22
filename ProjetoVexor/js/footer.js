// RODAPÉ DO SITE
document.addEventListener("DOMContentLoaded", function () {
  const footerHTML = `
<footer id="footer">
  <div class="footer-top-line"></div>
  <div class="container footer-main">
    <div class="row gy-4 justify-content-between align-items-start">
      <!-- Coluna 1: Sobre a Vexor (esquerda) -->
      <div class="col-12 col-md-3 d-flex flex-column align-items-md-start text-md-start text-center footer-about mb-3 mb-md-0">
        <h5 class="footer-title footer-title-about">Sobre a Vexor</h5>
        <p class="footer-about-text mb-2">
          Fundada em 2025, a Vexor nasceu da paixão por games e tecnologia.<br>
          Produtos de qualidade e experiência única para gamers de todos os níveis.
        </p>
        <span class="footer-about-mini">#GameOn</span>
      </div>
      <!-- Coluna 2: Informações (meio-esquerda) -->
      <div class="col-12 col-sm-6 col-md-2 d-flex flex-column align-items-md-start text-md-start text-center mb-3 mb-md-0">
        <h5 class="footer-title">Informações</h5>
        <ul class="footer-links mb-2">
          <li><i class="bi bi-caret-right-fill"></i> <a href="#">Política de Privacidade</a></li>
          <li><i class="bi bi-caret-right-fill"></i> <a href="#">Política de Entregas</a></li>
          <li><i class="bi bi-caret-right-fill"></i> <a href="#">Rastreie seu pedido</a></li>
        </ul>
        <div class="footer-desc mt-2">

        </div>
      </div>
      <!-- Coluna 3: Newsletter + Redes Sociais (centralizada) -->
      <div class="col-12 col-md-3 d-flex flex-column align-items-center text-center mb-3 mb-md-0 footer-vexor-central">
        <h5 class="footer-title footer-title-vexor">Receba novidades</h5>
        <form class="d-flex flex-column flex-sm-row justify-content-center align-items-center gap-2 mb-2 newsletter">
          <input type="email" class="form-control" placeholder="Seu e-mail" required style="max-width:300px;min-width:180px;width:100%;">
          <button type="submit" class="btn secondary-bg-color btn-sm">Cadastrar</button>
        </form>
        <div class="footer-social mb-2">
          <a href="#" aria-label="Facebook"><i class="bi bi-facebook"></i></a>
          <a href="#" aria-label="Instagram"><i class="bi bi-instagram"></i></a>
          <a href="#" aria-label="YouTube"><i class="bi bi-youtube"></i></a>
          <a href="#" aria-label="Twitter"><i class="bi bi-twitter"></i></a>
        </div>
        <blockquote class="footer-quote mt-2 mb-0">
          "A tecnologia move o mundo."<br>
          <cite>— Steve Jobs.</cite>
        </blockquote>
      </div>
      <!-- Coluna 4: Páginas + Contato (direita) -->
      <div class="col-12 col-sm-6 col-md-2 d-flex flex-column align-items-md-end text-md-end text-center mb-3 mb-md-0">
        <h5 class="footer-title">Páginas</h5>
        <ul class="footer-links mb-2">
          <li><i class="bi bi-caret-right-fill"></i> <a href="index.html">Home</a></li>
          <li><i class="bi bi-caret-right-fill"></i> <a href="product.html">Produtos</a></li>
          <li><i class="bi bi-caret-right-fill"></i> <a href="index.html#promotion-grid">Promoções</a></li>
          <li><i class="bi bi-caret-right-fill"></i> <a href="#">Contato</a></li>
          <li><i class="bi bi-caret-right-fill"></i> <a href="#">Novidades</a></li>
        </ul>
        <div class="footer-desc mt-2">
          <strong>Atendimento:</strong><br>
          Seg a Sex, 9h às 18h<br>
          <i class="bi bi-telephone"></i> (21) 99999-9999
        </div>
      </div>
    </div>
    <!-- Copyright -->
    <div class="row mt-3">
      <div class="col-12 text-center footer-bottom">
        <p class="mb-0">© 2025 <span class="primary-color">Vexor</span> - Todos os direitos reservados</p>
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
  margin-top: 40px;
  padding-top: 32px;
  padding-bottom: 20px;
  width: 100%;
  overflow-x: hidden;
  font-size: 1rem;
}

/* Se o tema for dark, a variável já traz gradiente! */
.footer-top-line {
  height: 2px;
  background: var(--secondary-bg-color);
  margin-bottom: 24px;
}
.footer-title,
.footer-title-about,
.footer-title-vexor {
  font-size: 1.3rem;
  font-weight: 800;
  letter-spacing: 0.5px;
  margin-bottom: 14px;
  text-align: left;
}
.footer-title::after,
.footer-title-about::after,
.footer-title-vexor::after {
  content: "";
  display: block;
  width: 28px;
  height: 2px;
  background: var(--secondary-bg-color);
  margin: 8px 0 0 0;
}
.footer-links {
  list-style: none;
  padding: 0;
  margin: 0 0 10px 0;
}
.footer-links li {
  margin-bottom: 7px;
  font-size: 0.97em;
}
.footer-links li:last-child {
  margin-bottom: 0;
}
.footer-links a {
  color: var(--text-color);
  text-decoration: none;
  transition: color 0.2s;
}
.footer-links a:hover {
  color: var(--secondary-bg-color);
  text-decoration: underline;
}
.footer-desc {
  margin-top: 12px;
  color: var(--text-color);
  font-size: 0.92em;
}
.footer-desc img {
  display: block;
  margin: 0 auto 6px auto;
}
.footer-about {
  min-width: 180px;
}
.footer-about-text {
  font-size: 0.97em;
  color: var(--text-color);
  margin-bottom: 8px;
}
.footer-about-mini {
  font-size: 0.93em;
  color: var(--secondary-bg-color);
  font-weight: 600;
  letter-spacing: 1px;
}
.footer-social {
  margin-top: 8px;
}
.footer-social a {
  color: var(--secondary-bg-color);
  font-size: 1.1rem;
  margin: 0 7px;
  transition: color 0.2s;
}
.footer-social a:hover {
  color: var(--text-color);
}
.footer-quote {
  font-style: italic;
  font-size: 0.93em;
  color: var(--text-color);
  margin-top: 12px;
}
.footer-quote cite {
  font-size: 0.92em;
  color: var(--secondary-bg-color);
}
.newsletter input[type="email"] {
  max-width: 180px;
  font-size: 0.95em;
  padding: 5px 10px;
  height: 30px;
}
.newsletter button {
  font-size: 0.95em;
  padding: 5px 16px;
  height: 30px;
}
.footer-bottom {
  margin-top: 14px;
  font-size: 0.93rem;
  color: var(--text-color);
}
.container.footer-main {
  max-width: 1100px;
}
@media (max-width: 991px) {
  .footer-about {
    margin-bottom: 18px;
  }
  .footer-vexor-central {
    margin-top: 24px;
    margin-bottom: 24px;
  }
}
@media (max-width: 767px) {
  .footer-main .row > div {
    align-items: center !important;
    text-align: center !important;
    padding-left: 0 !important;
    padding-right: 0 !important;
    margin-bottom: 18px;
  }
  .footer-title,
  .footer-title-about,
  .footer-title-vexor {
    text-align: center;
  }
  .footer-title::after,
  .footer-title-about::after,
  .footer-title-vexor::after {
    margin-left: auto;
    margin-right: auto;
  }
  .footer-title-about {
    text-align: center;
  }
  .footer-title-vexor {
    text-align: center;
  }
  .footer-title::after {
    margin-left: auto;
    margin-right: auto;
  }
  .footer-desc {
    margin-bottom: 10px;
  }
}
`;

  document.head.appendChild(style);

  const footerContainer = document.getElementById("footer-container");
  if (footerContainer) {
    footerContainer.innerHTML = footerHTML;
  }
})