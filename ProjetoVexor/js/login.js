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
    const usernameInputElem = document.getElementById('login');
    const passwordInputElem = document.getElementById('password');

    const username = usernameInputElem.value.trim();
    const password = passwordInputElem.value.trim();

    // Limpa feedback visual anterior
    usernameInputElem.classList.remove('is-invalid', 'shake');
    passwordInputElem.classList.remove('is-invalid', 'shake');
    loginMessage.innerHTML = ''; // Limpa mensagens anteriores

    if (!username) {
      usernameInputElem.classList.add('is-invalid', 'shake');
      mostrarMensagem('Por favor, preencha o campo de login.', 'danger', 'login');
      return;
    }
    if (!password) {
      passwordInputElem.classList.add('is-invalid', 'shake');
      mostrarMensagem('Por favor, preencha o campo de senha.', 'danger', 'login');
      return;
    }

    // Verificação direta para admin
    if (username === "admin" && password === "admin") {
      localStorage.setItem("loggedUser", "admin");
      mostrarMensagem('✅ Bem-vindo, administrador! Redirecionando...', 'success', 'login');
      setTimeout(() => {
        window.location.href = "usuario.html";
      }, 1500);
      return;
    }

    try {
      const response = await fetch('db/users-database.json');
      const users = await response.json();

      const userFound = users.find(user =>
        user.username.toLowerCase() === username.toLowerCase() &&
        user.password === password
      );

      if (userFound) {
        localStorage.setItem("loggedUser", userFound.username);
        mostrarMensagem(`✅ Bem-vindo, ${userFound.username}! Redirecionando...`, 'success', 'login');
        setTimeout(() => {
          window.location.href = "usuario.html";
        }, 1500);
      } else {
        const usuariosLocais = JSON.parse(localStorage.getItem('usuariosLocais')) || [];
        const userLocal = usuariosLocais.find(user =>
          user.username.toLowerCase() === username.toLowerCase() &&
          user.password === password
        );

        if (userLocal) {
          localStorage.setItem("loggedUser", userLocal.username);
          mostrarMensagem(`✅ Bem-vindo, ${userLocal.username}! Cadastro Local encontrado!`, 'success', 'login');
          setTimeout(() => {
            window.location.href = "usuario.html";
          }, 1500);
        } else {
          usernameInputElem.classList.add('is-invalid', 'shake');
          passwordInputElem.classList.add('is-invalid', 'shake');
          mostrarMensagem('❌ Usuário ou senha incorretos. Por favor, tente novamente.', 'danger', 'login');
        }
      }
    } catch (error) {
      console.error('Erro ao tentar fazer login:', error);
      mostrarMensagem('Não foi possível acessar o banco de dados de usuários.', 'danger', 'login');
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
        mostrarMensagem('Todos os cadastros locais foram apagados.', 'success', 'offcanvas');
      }
    });
  }

  // Modificada para aceitar um parâmetro 'target' para exibir a mensagem em locais diferentes
  function mostrarMensagem(texto, tipo, target = 'login') {
    let container;
    if (target === 'login') {
      container = loginMessage;
    } else { // Para mensagens dentro do offcanvas, por exemplo
      container = listaCadastros.parentNode; // Ou um elemento específico dentro do offcanvas
    }

    let corFundo, corTexto;

    if (tipo === 'success') {
      corFundo = 'rgba(40, 167, 69, 0.1)';
      corTexto = '#28a745';
    } else {
      corFundo = 'rgba(220, 53, 69, 0.1)';
      corTexto = '#ff0000';
    }

    container.innerHTML = `
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

    // Remove a classe 'shake' após a animação para permitir que ela seja acionada novamente
    if (tipo === 'danger') {
      setTimeout(() => {
        usernameInputElem.classList.remove('shake');
        passwordInputElem.classList.remove('shake');
      }, 500); // Duração da animação shake
    }

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