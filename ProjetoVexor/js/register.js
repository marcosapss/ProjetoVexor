document.addEventListener('DOMContentLoaded', function () {
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
  const cellPhoneInput = document.getElementById('cellPhone');
  const homePhoneInput = document.getElementById('homePhone');
  const passwordStrength = document.getElementById('password-strength');

  // Troca de abas
  document.querySelectorAll('.next-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      const currentPane = document.querySelector('.tab-pane.active');
      const requiredFields = currentPane.querySelectorAll('input[required], select[required]');
      let valid = true;
  
      requiredFields.forEach(input => {
        if (!input.value.trim()) {
          valid = false;
          animarErro(input);
        }
      });
  
      // Validação CPF (se existir nessa aba)
      const cpfField = currentPane.querySelector('#cpf');
      if (cpfField) {
        const cpfIconCheck = document.querySelector('#cpf-valid-icon i.text-success');
        if (!cpfIconCheck) {
          valid = false;
          animarErro(cpfField);
        }
      }
  
      // Validação CEP (se existir nessa aba)
      const cepField = currentPane.querySelector('#cep');
      if (cepField) {
        const cepIconCheck = document.querySelector('#cep-valid-icon i.text-success');
        if (!cepIconCheck) {
          valid = false;
          animarErro(cepField);
        }
      }
  
      if (valid) {
        const nextTab = document.querySelector('.nav-link.active').parentElement.nextElementSibling?.querySelector('.nav-link');
        if (nextTab) {
          new bootstrap.Tab(nextTab).show();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      } else {
        mostrarMensagem('Preencha corretamente todos os campos obrigatórios.', 'danger');
      }
    });
  });
  
  

  // Máscaras de entrada
  cpfInput.addEventListener('input', maskCPF);
  cepInput.addEventListener('input', maskCEP);
  loginInput.addEventListener('input', () => loginInput.value = loginInput.value.replace(/[^a-zA-Z]/g, '').slice(0, 6));
  passwordInput.addEventListener('input', limitarSenha);
  confirmPasswordInput.addEventListener('input', limitarSenha);
  passwordInput.addEventListener('input', verificarSenhasIguais);
  confirmPasswordInput.addEventListener('input', verificarSenhasIguais);

  cellPhoneInput.addEventListener('input', maskCellPhone);
  homePhoneInput.addEventListener('input', maskHomePhone);

  function maskCPF() {
    let value = cpfInput.value.replace(/\D/g, '').slice(0, 11);
    value = value.replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    cpfInput.value = value;
    if (value.replace(/\D/g, '').length === 11) validarCPFInstant(value);
    else { cpfIcon.innerHTML = ''; cpfInput.classList.remove('is-valid', 'is-invalid'); }
  }

  function validarCPFInstant(cpf) {
    if (validarCPF(cpf)) {
      cpfIcon.innerHTML = '<i class="bi bi-check-circle-fill text-success"></i>';
      cpfInput.classList.add('is-valid');
      cpfInput.classList.remove('is-invalid');
    } else {
      cpfIcon.innerHTML = '<i class="bi bi-x-circle-fill text-danger"></i>';
      cpfInput.classList.add('is-invalid');
      cpfInput.classList.remove('is-valid');
    }
  }

  function validarCPF(cpf) {
    cpf = cpf.replace(/\D/g, '');
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
    let soma = 0;
    for (let i = 0; i < 9; i++) soma += parseInt(cpf[i]) * (10 - i);
    let resto = 11 - (soma % 11);
    if (resto >= 10) resto = 0;
    if (resto !== parseInt(cpf[9])) return false;
    soma = 0;
    for (let i = 0; i < 10; i++) soma += parseInt(cpf[i]) * (11 - i);
    resto = 11 - (soma % 11);
    if (resto >= 10) resto = 0;
    return resto === parseInt(cpf[10]);
  }

  function maskCEP() {
    let value = cepInput.value.replace(/\D/g, '').slice(0, 8);
    if (value.length > 5) value = value.replace(/(\d{5})(\d{1,3})/, '$1-$2');
    cepInput.value = value;
    if (value.replace(/\D/g, '').length === 8) buscarCEP(value.replace(/\D/g, ''));
    else { limparCamposEndereco(); cepIcon.innerHTML = ''; cepInput.classList.remove('is-valid', 'is-invalid'); }
  }

  function buscarCEP(cep) {
    cepError.textContent = 'Consultando CEP...';
    fetch(`https://viacep.com.br/ws/${cep}/json/`)
      .then(res => res.json())
      .then(data => {
        if (!data.erro) preencherEndereco(data);
        else mostrarCepInvalido();
      })
      .catch(() => mostrarCepInvalido());
  }

  function preencherEndereco(data) {
    logradouroInput.value = data.logradouro;
    bairroInput.value = data.bairro;
    cidadeInput.value = data.localidade;
    estadoInput.value = data.uf;
    cepIcon.innerHTML = '<i class="bi bi-check-circle-fill text-success"></i>';
    cepInput.classList.add('is-valid');
    cepInput.classList.remove('is-invalid');
    cepError.textContent = '';
  }

  function mostrarCepInvalido() {
    limparCamposEndereco();
    cepIcon.innerHTML = '<i class="bi bi-x-circle-fill text-danger"></i>';
    cepInput.classList.add('is-invalid');
    cepInput.classList.remove('is-valid');
    cepError.textContent = 'CEP não encontrado. Preencha manualmente.';
  }

  function limparCamposEndereco() {
    logradouroInput.value = '';
    bairroInput.value = '';
    cidadeInput.value = '';
    estadoInput.value = '';
    cepError.textContent = '';
  }

  function maskCellPhone() {
    let value = cellPhoneInput.value.replace(/\D/g, '').slice(0, 11);
    if (value.length > 2) value = `(${value.slice(0,2)}) ${value.slice(2)}`;
    if (value.length > 9) value = value.replace(/(\(\d{2}\) \d{5})(\d{4})/, '$1-$2');
    cellPhoneInput.value = value;
  }

  function maskHomePhone() {
    let value = homePhoneInput.value.replace(/\D/g, '').slice(0, 10);
    if (value.length > 2) value = `(${value.slice(0,2)}) ${value.slice(2)}`;
    if (value.length > 8) value = value.replace(/(\(\d{2}\) \d{4,5})(\d{4})/, '$1-$2');
    homePhoneInput.value = value;
  }

  function limitarSenha(event) {
    event.target.value = event.target.value.replace(/[^a-zA-Z]/g, '').slice(0, 8);
    validarForcaSenha();
  }

  function validarForcaSenha() {
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
  }

  function verificarSenhasIguais() {
    const senha = passwordInput.value.trim();
    const confirmarSenha = confirmPasswordInput.value.trim();
  
    if (confirmarSenha && senha !== confirmarSenha) {
      passwordMatchError.textContent = 'As senhas não coincidem.';
      confirmPasswordInput.classList.add('is-invalid');
    } else {
      passwordMatchError.textContent = '';
      confirmPasswordInput.classList.remove('is-invalid');
      confirmPasswordInput.classList.add('is-valid');
    }
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const submitBtn = form.querySelector('[type=submit]');
    
    const username = loginInput.value.trim().toLowerCase();
    const password = passwordInput.value.trim();
    const confirmPassword = confirmPasswordInput.value.trim();

    const campos = [...form.querySelectorAll('input[required], select[required]')];
    let campoComErro = campos.find(campo => !campo.value.trim());

    if (campoComErro) {
      mostrarMensagem(`Preencha o campo: ${campoComErro.previousElementSibling?.innerText || 'Campo obrigatório'}`, 'danger');
      animarErro(campoComErro);
      irParaAba(campoComErro);
      return;
    }

    if (password !== confirmPassword) {
      mostrarMensagem('As senhas não coincidem.', 'danger');
      animarErro(passwordInput);
      animarErro(confirmPasswordInput);
      irParaAba(confirmPasswordInput);
      return;
    }

    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span class="spinner-border spinner-border-sm"></span> Cadastrando...`;

    fetch('db/users-database.json')
      .then(response => response.json())
      .then(users => {
        const userExistsInDB = users.some(user => user.username.toLowerCase() === username);
        const usuariosLocais = JSON.parse(localStorage.getItem('usuariosLocais')) || [];
        const userExistsInLocal = usuariosLocais.some(user => user.username.toLowerCase() === username);

        if (userExistsInDB || userExistsInLocal) {
          mostrarMensagem('Usuário já existe.', 'danger');
          submitBtn.disabled = false;
          submitBtn.innerHTML = 'Cadastrar';
        } else {
          salvarUsuarioLocal(username, password);
          setTimeout(() => {
            form.reset();
            limparCamposEndereco();
            passwordStrength.textContent = '';
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Cadastrar';
            mostrarMensagem('Cadastro realizado com sucesso!', 'success');
          }, 1500);
        }
      })
      .catch(() => {
        mostrarMensagem('Erro ao validar cadastro.', 'danger');
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Cadastrar';
      });
  });

  function animarErro(campo) {
    campo.classList.add('is-invalid', 'shake');
    
    setTimeout(() => {
      campo.classList.remove('shake');
      campo.classList.remove('is-invalid'); // Depois de 2 segundos, limpa o vermelho
    }, 2000);
  }

  function irParaAba(campo) {
    const tabPane = campo.closest('.tab-pane');
    if (tabPane) {
      const id = tabPane.id;
      const aba = document.querySelector(`a[href="#${id}"]`);
      if (aba) new bootstrap.Tab(aba).show();
    }
  }

  function salvarUsuarioLocal(username, password) {
    const usuariosLocais = JSON.parse(localStorage.getItem('usuariosLocais')) || [];
    usuariosLocais.push({ username, password });
    localStorage.setItem('usuariosLocais', JSON.stringify(usuariosLocais));
  }

  function mostrarMensagem(texto, tipo) {
    const toastContainer = document.getElementById('toast-container');
  
    const corFundo = tipo === 'success' ? 'bg-success' : 'bg-danger';
    const icone = tipo === 'success' ? '✅' : '❌';
  
    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-white ${corFundo} border-0 show mb-2`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');
  
    toast.innerHTML = `
      <div class="d-flex">
        <div class="toast-body">
          <strong style="font-size: 1.2rem;">${icone}</strong> ${texto}
        </div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Fechar"></button>
      </div>
    `;
  
    toastContainer.appendChild(toast);
  
    // Remover o toast depois de 4 segundos
    setTimeout(() => {
      toast.remove();
    }, 4000);
  }
  
  
});
