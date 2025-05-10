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

      if (id === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        valido = false;
        input.classList.add('is-invalid');
        mostrarMensagem('Campo E-mail é inválido.', 'danger');
        if (!primeiroInvalido) primeiroInvalido = input;
      }
    });

    return { valido, primeiroInvalido };
  };

  const maskCPF = () => {
    let value = cpfInput.value.replace(/\D/g, '').slice(0, 11);
    value = value.replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    cpfInput.value = value;
    if (value.replace(/\D/g, '').length === 11) validarCPFInstant(value);
    else {
      cpfIcon.innerHTML = '';
      cpfInput.classList.remove('is-valid', 'is-invalid');
    }
  };

  const validarCPF = (cpf) => {
    const num = cpf.replace(/\D/g, '');
    if (num.length !== 11 || /^([0-9])\1{10}$/.test(num)) return false;
    let soma = 0;
    for (let i = 0; i < 9; i++) soma += Number.parseInt(num[i]) * (10 - i);
    let resto = 11 - (soma % 11);
    if (resto >= 10) resto = 0;
    if (resto !== Number.parseInt(num[9])) return false;
    soma = 0;
    for (let i = 0; i < 10; i++) soma += Number.parseInt(num[i]) * (11 - i);
    resto = 11 - (soma % 11);
    if (resto >= 10) resto = 0;
    return resto === Number.parseInt(num[10]);
  };

  const validarCPFInstant = (cpf) => {
    if (validarCPF(cpf)) {
      cpfIcon.innerHTML = '<i class="bi bi-check-circle-fill text-success"></i>';
      cpfInput.classList.add('is-valid');
      cpfInput.classList.remove('is-invalid');
    } else {
      cpfIcon.innerHTML = '<i class="bi bi-x-circle-fill text-danger"></i>';
      cpfInput.classList.add('is-invalid');
      cpfInput.classList.remove('is-valid');
    }
  };

  const maskCEP = () => {
    let value = cepInput.value.replace(/\D/g, '').slice(0, 8);
    if (value.length > 5) value = value.replace(/(\d{5})(\d{1,3})/, '$1-$2');
    cepInput.value = value;
    if (value.replace(/\D/g, '').length === 8) buscarCEP(value.replace(/\D/g, ''));
    else {
      limparCamposEndereco();
      cepIcon.innerHTML = '';
      cepInput.classList.remove('is-valid', 'is-invalid');
    }
  };

  const buscarCEP = async (cep) => {
    cepError.textContent = 'Consultando CEP...';
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await res.json();
      if (!data.erro) preencherEndereco(data);
      else mostrarCepInvalido();
    } catch {
      mostrarCepInvalido();
    }
  };

  const preencherEndereco = (data) => {
    logradouroInput.value = data.logradouro;
    bairroInput.value = data.bairro;
    cidadeInput.value = data.localidade;
    estadoInput.value = data.uf;
    cepIcon.innerHTML = '<i class="bi bi-check-circle-fill text-success"></i>';
    cepInput.classList.add('is-valid');
    cepInput.classList.remove('is-invalid');
    cepError.textContent = '';
  };

  const mostrarCepInvalido = () => {
    limparCamposEndereco();
    cepIcon.innerHTML = '<i class="bi bi-x-circle-fill text-danger"></i>';
    cepInput.classList.add('is-invalid');
    cepInput.classList.remove('is-valid');
    cepError.textContent = 'CEP não encontrado. Preencha manualmente.';
  };

  const limparCamposEndereco = () => {
    logradouroInput.value = '';
    bairroInput.value = '';
    cidadeInput.value = '';
    estadoInput.value = '';
    cepError.textContent = '';
  };

  const maskCellPhone = () => {
    let value = cellPhoneInput.value.replace(/\D/g, '').slice(0, 11);
    if (value.length > 2) value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
    if (value.length > 9) value = value.replace(/(\(\d{2}\) \d{5})(\d{4})/, '$1-$2');
    cellPhoneInput.value = value;
  };

  const maskHomePhone = () => {
    let value = homePhoneInput.value.replace(/\D/g, '').slice(0, 10);
    if (value.length > 2) value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
    if (value.length > 8) value = value.replace(/(\(\d{2}\) \d{4,5})(\d{4})/, '$1-$2');
    homePhoneInput.value = value;
  };

  const limitarSenha = (event) => {
    event.target.value = event.target.value.replace(/[^a-zA-Z]/g, '').slice(0, 8);
    validarForcaSenha();
  };

  const validarForcaSenha = () => {
    const senha = passwordInput.value;
    if (senha.length <= 3) {
      passwordStrength.textContent = 'Senha Fraca';
      passwordStrength.className = 'text-danger small';
    } else if (senha.length <= 5) {
      passwordStrength.textContent = 'Senha Média';
      passwordStrength.className = 'text-warning small';
    } else {
      passwordStrength.textContent = 'Senha Forte';
      passwordStrength.className = 'text-success small';
    }
  };

  const verificarSenhasIguais = () => {
    const senha = passwordInput.value.trim();
    const confirmar = confirmPasswordInput.value.trim();
    if (confirmar && senha !== confirmar) {
      passwordMatchError.textContent = 'As senhas não coincidem.';
      confirmPasswordInput.classList.add('is-invalid');
    } else {
      passwordMatchError.textContent = '';
      confirmPasswordInput.classList.remove('is-invalid');
      confirmPasswordInput.classList.add('is-valid');
    }
  };

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
