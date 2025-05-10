document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('registerForm');
  const cpfInput = document.getElementById('cpf');
  const cpfIcon = document.getElementById('cpf-valid-icon');
  const cepInput = document.getElementById('cep');
  const cepIcon = document.getElementById('cep-valid-icon');
  const cepError = document.getElementById('cep-error');
  const logradouroInput = document.getElementById('logradouro');
  const bairroInput = document.getElementById('bairro');
  const cidadeInput = document.getElementById('cidade');
  const estadoInput = document.getElementById('estado');
  const loginInput = document.getElementById('loginUser');
  const passwordInput = document.getElementById('passwordUser');
  const confirmPasswordInput = document.getElementById('confirmPassword');
  const passwordStrength = document.getElementById('password-strength');
  const passwordMatchError = document.getElementById('password-match-error');
  const cellPhoneInput = document.getElementById('cellPhone');
  const homePhoneInput = document.getElementById('homePhone');

  const mostrarMensagem = (texto, tipo) => {
    const toastContainer = document.getElementById('toast-container');
    const corFundo = tipo === 'success' ? 'bg-success' : 'bg-danger';
    const icone = tipo === 'success' ? '✅' : '❌';
    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-white ${corFundo} border-0 show mb-2`;
    toast.innerHTML = `
      <div class="d-flex">
        <div class="toast-body">
          <strong style="font-size: 1.2rem;">${icone}</strong> ${texto}
        </div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Fechar"></button>
      </div>`;
    toastContainer.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
  };

  const validarFormularioCompleto = () => {
    const requiredInputs = form.querySelectorAll('input[required], select[required]');
    let valido = true;
    let primeiroInvalido = null;

    requiredInputs.forEach(input => {
      const id = input.id;
      const value = input.value.trim();

      if (!value) {
        valido = false;
        input.classList.add('is-invalid');
        if (!primeiroInvalido) primeiroInvalido = input;
      } else {
        input.classList.remove('is-invalid');
        input.classList.add('is-valid');
      }

      if (id === 'cpf' && !validarCPF(value)) {
        valido = false;
        input.classList.add('is-invalid');
        mostrarMensagem('Campo CPF é inválido.', 'danger');
        if (!primeiroInvalido) primeiroInvalido = input;
      }

      if (id === 'cep' && cepIcon.innerHTML.includes('x-circle')) {
        valido = false;
        input.classList.add('is-invalid');
        mostrarMensagem('Campo CEP é inválido.', 'danger');
        if (!primeiroInvalido) primeiroInvalido = input;
      }

      if (id === 'email' && !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(value)) {
        valido = false;
        input.classList.add('is-invalid');
        mostrarMensagem('Campo E-mail é inválido.', 'danger');
        if (!primeiroInvalido) primeiroInvalido = input;
      }
    });

    return { valido, primeiroInvalido };
  };

  // ... mantém todas as outras funções de máscara e validação existentes (maskCPF, validarCPF, buscarCEP, etc.)

  // Eventos
  cpfInput.addEventListener('input', maskCPF);
  cepInput.addEventListener('input', maskCEP);
  loginInput.addEventListener('input', () => loginInput.value = loginInput.value.replace(/[^a-zA-Z]/g, '').slice(0, 6));
  passwordInput.addEventListener('input', limitarSenha);
  confirmPasswordInput.addEventListener('input', limitarSenha);
  passwordInput.addEventListener('input', verificarSenhasIguais);
  confirmPasswordInput.addEventListener('input', verificarSenhasIguais);
  cellPhoneInput.addEventListener('input', maskCellPhone);
  homePhoneInput.addEventListener('input', maskHomePhone);

  form.addEventListener('submit', e => {
    e.preventDefault();
    const { valido, primeiroInvalido } = validarFormularioCompleto();
    if (!valido) {
      mostrarMensagem('Preencha todos os campos obrigatórios.', 'danger');
      primeiroInvalido?.focus();
      return;
    }
    mostrarMensagem('Cadastro realizado com sucesso!', 'success');
  });
});
