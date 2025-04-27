document.addEventListener('DOMContentLoaded', function () {

    const form = document.getElementById('registerForm');
    const cpfInput = document.getElementById('cpf');
    const cpfIcon = document.getElementById('cpf-valid-icon');
    const cellPhoneInput = document.getElementById('cellPhone');
    const homePhoneInput = document.getElementById('homePhone');
    const cepInput = document.getElementById('cep');
    const cepError = document.getElementById('cep-error');
    const logradouroInput = document.getElementById('logradouro');
    const bairroInput = document.getElementById('bairro');
    const cidadeInput = document.getElementById('cidade');
    const estadoInput = document.getElementById('estado');
    const loginInput = document.getElementById('loginUser');
    const passwordInput = document.getElementById('passwordUser');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const passwordMatchError = document.getElementById('password-match-error');
    
    // Restringir login para exatamente 6 letras
    loginInput.addEventListener('input', function () {
        let value = loginInput.value.replace(/[^a-zA-Z]/g, ''); // Remove não letras
        if (value.length > 6) {
        value = value.slice(0, 6);
        }
        loginInput.value = value;
    });
    
    // Restringir senha para exatamente 8 letras
    passwordInput.addEventListener('input', function () {
        let value = passwordInput.value.replace(/[^a-zA-Z]/g, ''); // Remove não letras
        if (value.length > 8) {
        value = value.slice(0, 8);
        }
        passwordInput.value = value;
    });

      // Restringir confirmação de senha para exatamente 8 letras
    confirmPasswordInput.addEventListener('input', function () {
    let value = confirmPasswordInput.value.replace(/[^a-zA-Z]/g, '');
    if (value.length > 8) {
      value = value.slice(0, 8);
    }
    confirmPasswordInput.value = value;
  });
  
    // Máscara CPF
    cpfInput.addEventListener('input', function () {
      let value = cpfInput.value.replace(/\D/g, '');
      if (value.length > 11) value = value.slice(0, 11);
      value = value.replace(/(\d{3})(\d)/, '$1.$2');
      value = value.replace(/(\d{3})(\d)/, '$1.$2');
      value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
      cpfInput.value = value;
  
      if (value.replace(/\D/g, '').length === 11) {
        validateCPFInstant(value);
      } else {
        cpfIcon.innerHTML = '';
      }
    });

    // Validação visual de senha e confirmação
    function checkPasswordsMatch() {
    const password = passwordInput.value.trim();
    const confirmPassword = confirmPasswordInput.value.trim();
  
    if (password && confirmPassword && password !== confirmPassword) {
      passwordMatchError.textContent = 'As senhas não coincidem.';
    } else {
      passwordMatchError.textContent = '';
    }
  }
  
  // Escutar digitação nos dois campos
  passwordInput.addEventListener('input', checkPasswordsMatch);
  confirmPasswordInput.addEventListener('input', checkPasswordsMatch);
  
    // Máscara CEP
    cepInput.addEventListener('input', function () {
      let value = cepInput.value.replace(/\D/g, '');
      if (value.length > 8) value = value.slice(0, 8);
      if (value.length > 5) {
        value = value.replace(/(\d{5})(\d{1,3})/, '$1-$2');
      }
      cepInput.value = value;
    });
  
    // Validação instantânea CPF
    function validateCPFInstant(cpfMasked) {
        const cpf = cpfMasked.replace(/\D/g, '');
        if (cpf.length === 11 && validateCPF(cpf)) {
          cpfIcon.innerHTML = '<i class="bi bi-check-circle-fill text-success"></i>';
          cpfInput.classList.remove('shake', 'input-error');
        } else if (cpf.length === 11) {
          cpfIcon.innerHTML = '<i class="bi bi-x-circle-fill text-danger"></i>';
          cpfInput.classList.add('shake', 'input-error');
          setTimeout(() => {
            cpfInput.classList.remove('shake'); // Remove apenas o shake depois
          }, 400);
        } else {
          cpfIcon.innerHTML = '';
          cpfInput.classList.remove('shake', 'input-error');
        }
      }
  
    // Máscara Telefone
    function maskPhone(input) {
      input.addEventListener('input', function () {
        let value = input.value.replace(/\D/g, '');
        if (value.length > 11) value = value.slice(0, 11);
        if (value.length > 2) {
          value = `(${value.slice(0,2)}) ${value.slice(2)}`;
        }
        if (value.length > 9) {
          value = value.replace(/(\(\d{2}\) \d{5})(\d{4})/, '$1-$2');
        } else if (value.length > 8) {
          value = value.replace(/(\(\d{2}\) \d{4})(\d{4})/, '$1-$2');
        }
        input.value = value;
      });
    }
  
    maskPhone(cellPhoneInput);
    maskPhone(homePhoneInput);
  
    // Busca CEP
    cepInput.addEventListener('blur', function () {
      const cep = cepInput.value.replace(/\D/g, '');
      if (cep.length === 8) {
        fetch(`https://viacep.com.br/ws/${cep}/json/`)
          .then(response => response.json())
          .then(data => {
            if (!data.erro) {
              logradouroInput.value = data.logradouro;
              bairroInput.value = data.bairro;
              cidadeInput.value = data.localidade;
              estadoInput.value = data.uf;
              cepError.textContent = '';
              cepError.classList.remove('fade-in');
              cepInput.classList.remove('is-invalid');
            } else {
              showCepError();
            }
          })
          .catch(() => {
            showCepError();
          });
      } else {
        showCepError();
      }
    });
  
    function showCepError() {
      logradouroInput.value = '';
      bairroInput.value = '';
      cidadeInput.value = '';
      estadoInput.value = '';
      cepError.textContent = 'CEP não encontrado, por favor insira as informações manualmente.';
      cepError.classList.add('text-danger', 'mt-2', 'fade-in');
      cepInput.classList.add('is-invalid');
    }
  
    form.addEventListener('submit', function (e) {
      e.preventDefault();
  
      const fullName = document.getElementById('fullName').value.trim();
      const cpf = cpfInput.value.replace(/\D/g, '');
      const loginUser = document.getElementById('loginUser').value.trim();
      const passwordUser = document.getElementById('passwordUser').value.trim();
      const confirmPassword = document.getElementById('confirmPassword').value.trim();
      const submitBtn = form.querySelector('button[type="submit"]');
  
      if (fullName.length < 15 || fullName.length > 80) {
        alert('Nome completo deve ter entre 15 e 80 caracteres.');
        return;
      }
  
      if (!validateCPF(cpf)) {
        alert('CPF inválido.');
        return;
      }
  
      if (!/^[a-zA-Z]{6}$/.test(loginUser)) {
        alert('Login deve conter exatamente 6 letras (somente alfabéticas).');
        return;
      }
  
      if (!/^[a-zA-Z]{8}$/.test(passwordUser)) {
        alert('Senha deve conter exatamente 8 letras (somente alfabéticas).');
        return;
      }
  
      if (passwordUser !== confirmPassword) {
        alert('As senhas não coincidem.');
        return;
      }
  
      // Loading no botão
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Cadastrando...';
  
      setTimeout(() => {
        form.reset();
        cpfIcon.innerHTML = '';
        cepError.textContent = '';
        cepInput.classList.remove('is-invalid');
        cepError.classList.remove('fade-in');
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Cadastrar';
        showSuccessToast();
      }, 2000);
  
    });
  
  });
  
  // Função para validar CPF
  function validateCPF(cpf) {
    cpf = cpf.replace(/\D+/g, '');
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
  
    let soma = 0;
    for (let i = 0; i < 9; i++) soma += parseInt(cpf.charAt(i)) * (10 - i);
    let resto = 11 - (soma % 11);
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.charAt(9))) return false;
  
    soma = 0;
    for (let i = 0; i < 10; i++) soma += parseInt(cpf.charAt(i)) * (11 - i);
    resto = 11 - (soma % 11);
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.charAt(10))) return false;
  
    return true;
  }
  
  // Toast de sucesso
  function showSuccessToast() {
    const toastContainer = document.getElementById('toast-container');
  
    const toast = document.createElement('div');
    toast.className = 'toast align-items-center text-white bg-success border-0 show';
    toast.role = 'alert';
    toast.ariaLive = 'assertive';
    toast.ariaAtomic = 'true';
    toast.innerHTML = `
      <div class="d-flex">
        <div class="toast-body">
          Cadastro realizado com sucesso!
        </div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
    `;
  
    toastContainer.appendChild(toast);
  
    setTimeout(() => {
      toast.remove();
    }, 3000);
  }
  