
document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const loginMessage = document.getElementById('login-message');
  const menuToggleBtn = document.getElementById('menuToggleBtn');
  const offcanvasMenu = new bootstrap.Offcanvas(document.getElementById('offcanvasMenu'));
  const verCadastrosBtn = document.getElementById('verCadastros');
  const resetLocalStorageBtn = document.getElementById('resetLocalStorage');
  const listaCadastros = document.getElementById('listaCadastros');

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      await realizarLogin();
    });
  }

  async function realizarLogin() {
    const usernameInput = document.getElementById('login').value.trim();
    const passwordInput = document.getElementById('password').value.trim();

    if (!usernameInput || !passwordInput) {
      mostrarMensagem('Por favor, preencha todos os campos.', 'danger');
      return;
    }

    // Verificação direta para admin
    if (usernameInput === "admin" && passwordInput === "admin") {
      localStorage.setItem("loggedUser", "admin");
      mostrarMensagem('✅ Bem-vindo, administrador! Redirecionando...', 'success');
      setTimeout(() => {
        window.location.href = "usuario.html";
      }, 1500);
      return;
    }

    try {
      const response = await fetch('db/users-database.json');
      const users = await response.json();

      const userFound = users.find(user =>
        user.username.toLowerCase() === usernameInput.toLowerCase() &&
        user.password === passwordInput
      );

      if (userFound) {
        localStorage.setItem("loggedUser", userFound.username);
        mostrarMensagem(`✅ Bem-vindo, ${userFound.username}! Redirecionando...`, 'success');
        setTimeout(() => {
          window.location.href = "usuario.html";
        }, 1500);
      } else {
        const usuariosLocais = JSON.parse(localStorage.getItem('usuariosLocais')) || [];
        const userLocal = usuariosLocais.find(user =>
          user.username.toLowerCase() === usernameInput.toLowerCase() &&
          user.password === passwordInput
        );

        if (userLocal) {
          localStorage.setItem("loggedUser", userLocal.username);
          mostrarMensagem(`✅ Bem-vindo, ${userLocal.username}! Cadastro Local encontrado!`, 'success');
          setTimeout(() => {
            window.location.href = "usuario.html";
          }, 1500);
        } else {
          mostrarMensagem('❌ Usuário ou senha incorretos. Por favor, tente novamente.', 'danger');
        }
      }
    } catch (error) {
      console.error('Erro ao tentar fazer login:', error);
      mostrarMensagem('Não foi possível acessar o banco de dados de usuários.', 'danger');
    }
  }

  if (menuToggleBtn) {
    menuToggleBtn.addEventListener('click', () => {
      offcanvasMenu.show();
    });
  }

  if (verCadastrosBtn) {
    verCadastrosBtn.addEventListener('click', () => {
      listaCadastros.innerHTML = '';
      const usuariosLocais = JSON.parse(localStorage.getItem('usuariosLocais')) || [];

      if (usuariosLocais.length === 0) {
        listaCadastros.innerHTML = '<p class="text-muted">Nenhum cadastro local encontrado.</p>';
        return;
      }

      const ul = document.createElement('ul');
      ul.className = 'list-group';

      usuariosLocais.forEach(user => {
        const li = document.createElement('li');
        li.className = 'list-group-item';
        li.innerHTML = `<strong>Usuário:</strong> ${user.username}<br><strong>Senha:</strong> ${user.password}`;
        ul.appendChild(li);
      });

      listaCadastros.appendChild(ul);
    });
  }

  if (resetLocalStorageBtn) {
    resetLocalStorageBtn.addEventListener('click', () => {
      if (confirm('Tem certeza que deseja apagar todos os cadastros locais?')) {
        localStorage.removeItem('usuariosLocais');
        listaCadastros.innerHTML = '';
        mostrarMensagem('Todos os cadastros locais foram apagados.', 'success');
      }
    });
  }

  function mostrarMensagem(texto, tipo) {
    let corFundo, corTexto;

    if (tipo === 'success') {
      corFundo = 'rgba(40, 167, 69, 0.1)';
      corTexto = '#28a745';
    } else {
      corFundo = 'rgba(220, 53, 69, 0.1)';
      corTexto = '#ff0000';
    }

    loginMessage.innerHTML = `
      <div style="
        display: inline-block;
        padding: 12px 20px;
        border: 1px solid ${corTexto};
        border-radius: 8px;
        background-color: ${corFundo};
        color: ${corTexto};
        font-weight: 500;
        animation: fadeIn 0.5s ease;
      ">
        ${texto}
      </div>
    `;

    if (!document.getElementById('fadeIn-style')) {
      const style = document.createElement('style');
      style.id = 'fadeIn-style';
      style.innerHTML = `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `;
      document.head.appendChild(style);
    }
  }
});
