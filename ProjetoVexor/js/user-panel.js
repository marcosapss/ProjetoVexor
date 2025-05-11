
document.addEventListener("DOMContentLoaded", async () => {
  const username = localStorage.getItem("loggedUser");

  // Se não houver usuário salvo, redireciona
  if (!username || username === "admin") {
    window.location.href = "login.html";
    return;
  }

  try {
    // Tenta buscar o usuário no arquivo JSON
    const res = await fetch("db/users-database.json");
    const users = await res.json();

    const userData = users.find(u => u.username.toLowerCase() === username.toLowerCase());

    if (!userData) {
      // Se não encontrou, expulsa
      localStorage.removeItem("loggedUser");
      window.location.href = "login.html";
      return;
    }

    // Mostra nome do usuário
    const nome = userData.username.charAt(0).toUpperCase() + userData.username.slice(1);
    const nomeSpan = document.getElementById("userName");
    if (nomeSpan) {
      nomeSpan.textContent = nome;
    }

    // Navegação dinâmica
    const navLinks = document.querySelectorAll("#navLinks .nav-link");
    const mainContent = document.getElementById("mainContent");

    navLinks.forEach(link => {
      link.addEventListener("click", () => {
        navLinks.forEach(l => l.classList.remove("active"));
        link.classList.add("active");

        const page = link.dataset.page;
        if (page === "profile") {
          mainContent.innerHTML = `
            <h2>Bem-vindo, <span id="userName">${nome}</span>!</h2>
            <p>Aqui você poderá visualizar seus dados pessoais, favoritos e carrinho.</p>
          `;
        } else {
          fetch(page)
            .then(res => res.text())
            .then(html => {
              mainContent.innerHTML = html;
            })
            .catch(() => {
              mainContent.innerHTML = "<p class='text-danger'>Erro ao carregar a página.</p>";
            });
        }
      });
    });

    // Botão de logout
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("loggedUser");
        window.location.href = "login.html";
      });
    }

  } catch (error) {
    console.error("Erro ao carregar usuários:", error);
    window.location.href = "login.html";
  }
});
