document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const loginMessage = document.getElementById('login-message');

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

        try {
            const response = await fetch('db/users-database.json');
            const users = await response.json();

            const userFound = users.find(user =>
                user.username.toLowerCase() === usernameInput.toLowerCase() &&
                user.password === passwordInput
            );

            if (userFound) {
                mostrarMensagem(`Bem-Vindo, ${userFound.username}! Espero que aproveite as compras!`, 'success');
                // Se quiser redirecionar depois de alguns segundos:
                // setTimeout(() => window.location.href = 'index.html', 2000);
            } else {
                mostrarMensagem('Usuário ou senha incorretos. Por favor, tente novamente.', 'danger');
            }

        } catch (error) {
            console.error('Erro ao tentar fazer login:', error);
            mostrarMensagem('Não foi possível acessar o banco de dados de usuários.', 'danger');
        }
    }

    function mostrarMensagem(texto, tipo) {
        let corFundo, corTexto, icone;

        if (tipo === 'success') {
            corFundo = 'rgba(40, 167, 69, 0.1)'; // Verde suave
            corTexto = '#28a745'; // Verde principal
            icone = '✅';
        } else {
            corFundo = 'rgba(220, 53, 69, 0.1)'; // Vermelho suave
            corTexto = '#ff0000'; // Vermelho principal
            icone = '❌';
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
                <span style="font-size: 1.5rem; margin-right: 8px;">${icone}</span> ${texto}
            </div>
        `;

        // Criar animação fadeIn se ainda não existir
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
