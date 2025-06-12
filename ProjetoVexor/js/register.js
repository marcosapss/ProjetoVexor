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
  const fullNameInput = document.getElementById('fullName');
  const emailInput = document.getElementById('email');
  const birthDateInput = document.getElementById('birthDate');
  const genderSelect = document.getElementById('gender');
  const motherNameInput = document.getElementById('motherName');


  // Função para exibir mensagens de toast
  const mostrarMensagem = (texto, tipo) => {
    const toastContainer = document.getElementById('toast-container');
    const corFundo = tipo === 'success' ? 'bg-success' : 'bg-danger';
    const icone = tipo === 'success' ? '✅' : '❌';
    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-white ${corFundo} border-0 show mb-2`;
    toast.innerHTML = `
      <div class="d-flex">
        <div class="toast-body">
          <strong style="font-size: 19px;">${icone}</strong> ${texto}
        </div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Fechar"></button>
      </div>`;
    toastContainer.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
  };

  // Funções de validação
  const validarCPF = (cpf) => {
    const num = cpf.replace(/\D/g, '');
    if (num.length !== 11 || /^([0-9])\1{10}$/.test(num)) return false;
    let soma = 0;
    for (let i = 0; i < 9; i++) soma += parseInt(num[i]) * (10 - i);
    let resto = 11 - (soma % 11);
    if (resto >= 10) resto = 0;
    if (resto !== parseInt(num[9])) return false;
    soma = 0;
    for (let i = 0; i < 10; i++) soma += parseInt(num[i]) * (11 - i);
    resto = 11 - (soma % 11);
    if (resto >= 10) resto = 0;
    return resto === parseInt(num[10]);
  };

  const aplicarFeedbackCampo = (inputElement, isValid, message = '') => {
    if (isValid) {
      inputElement.classList.add('is-valid');
      inputElement.classList.remove('is-invalid');
      let feedback = inputElement.nextElementSibling;
      if (feedback && feedback.classList.contains('invalid-feedback')) {
        feedback.remove();
      }
    } else {
      inputElement.classList.add('is-invalid');
      inputElement.classList.remove('is-valid');
      let feedback = inputElement.nextElementSibling;
      if (!feedback || !feedback.classList.contains('invalid-feedback')) {
        feedback = document.createElement('div');
        feedback.classList.add('invalid-feedback');
        inputElement.parentNode.insertBefore(feedback, inputElement.nextSibling);
      }
      feedback.textContent = message;
    }
  };


  // Funções de máscara e validação instantânea
  const maskCPF = () => {
    let value = cpfInput.value.replace(/\D/g, '').slice(0, 11);
    value = value.replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    cpfInput.value = value;
    if (value.replace(/\D/g, '').length === 11) {
      const isValid = validarCPF(value);
      aplicarFeedbackCampo(cpfInput, isValid, 'CPF inválido.');
      cpfIcon.innerHTML = isValid ? '<i class="bi bi-check-circle-fill text-success"></i>' : '<i class="bi bi-x-circle-fill text-danger"></i>';
    } else {
      aplicarFeedbackCampo(cpfInput, false, 'O CPF deve ter 11 dígitos.');
      cpfInput.classList.remove('is-valid', 'is-invalid');
      cpfIcon.innerHTML = '';
    }
  };

  const maskCEP = async () => {
    let value = cepInput.value.replace(/\D/g, '').slice(0, 8);
    if (value.length > 5) value = value.replace(/(\d{5})(\d{1,3})/, '$1-$2');
    cepInput.value = value;

    if (value.replace(/\D/g, '').length === 8) {
      cepError.textContent = 'Consultando CEP...';
      cepIcon.innerHTML = '<i class="bi bi-hourglass-split text-info"></i>';

      try {
        const res = await fetch(`https://viacep.com.br/ws/${value.replace(/\D/g, '')}/json/`);
        const data = await res.json();
        if (!data.erro) {
          preencherEndereco(data);
          aplicarFeedbackCampo(cepInput, true);
          cepIcon.innerHTML = '<i class="bi bi-check-circle-fill text-success"></i>';
        } else {
          mostrarCepInvalido();
          aplicarFeedbackCampo(cepInput, false);
          cepIcon.innerHTML = '<i class="bi bi-x-circle-fill text-danger"></i>';
        }
      } catch {
        mostrarCepInvalido();
        aplicarFeedbackCampo(cepInput, false);
        cepIcon.innerHTML = '<i class="bi bi-x-circle-fill text-danger"></i>';
      }
    } else {
      limparCamposEndereco();
      aplicarFeedbackCampo(cepInput, false, 'O CEP deve ter 8 dígitos.');
      cepInput.classList.remove('is-valid', 'is-invalid');
      cepIcon.innerHTML = '';
    }
  };

  const preencherEndereco = (data) => {
    logradouroInput.value = data.logradouro;
    bairroInput.value = data.bairro;
    cidadeInput.value = data.localidade;
    estadoInput.value = data.uf;
    cepError.textContent = '';
  };

  const mostrarCepInvalido = () => {
    limparCamposEndereco();
    cepError.textContent = 'CEP não encontrado. Preencha manualmente.';
  };

  const limparCamposEndereco = () => {
    logradouroInput.value = '';
    bairroInput.value = '';
    cidadeInput.value = '';
    estadoInput.value = '';
    cepError.textContent = '';
    aplicarFeedbackCampo(logradouroInput, false); // Limpa o feedback visual
    aplicarFeedbackCampo(bairroInput, false);
    aplicarFeedbackCampo(cidadeInput, false);
    aplicarFeedbackCampo(estadoInput, false);
    logradouroInput.classList.remove('is-valid', 'is-invalid');
    bairroInput.classList.remove('is-valid', 'is-invalid');
    cidadeInput.classList.remove('is-valid', 'is-invalid');
    estadoInput.classList.remove('is-valid', 'is-invalid');
  };

  const maskPhone = (input) => { // Removed `mobile` parameter as the regex handles both
    let value = input.value.replace(/\D/g, '');
    let formattedValue = '';

    if (value.length > 0) {
      if (value.length <= 2) {
        formattedValue = `(${value}`;
      } else if (value.length <= 6) { // (XX)XXXX
        formattedValue = `(${value.substring(0, 2)})${value.substring(2, 6)}`;
      } else if (value.length <= 10) { // (XX)XXXX-XXXX
        formattedValue = `(${value.substring(0, 2)})${value.substring(2, 6)}-${value.substring(6, 10)}`;
      } else { // (XX)9XXXX-XXXX
        formattedValue = `(${value.substring(0, 2)})${value.substring(2, 7)}-${value.substring(7, 11)}`;
      }
    }
    input.value = formattedValue;
    validarTelefone(input);
  };

  const validarTelefone = (input) => {
    const value = input.value.replace(/\D/g, '');
    // Regex para (XX)XXXX-XXXX ou (XX)9XXXX-XXXX
    const regex = /^\d{10,11}$/;
    const isValid = regex.test(value);
    aplicarFeedbackCampo(input, isValid, 'Formato de telefone inválido (Ex: (21)99999-9999 ou (21)2222-2222).');
  };


  const limitarSenha = (event) => {
    // Permite apenas letras
    event.target.value = event.target.value.replace(/[^a-zA-Z]/g, '').slice(0, 8);
    validarForcaSenha();
    verificarSenhasIguais();
  };

  const validarForcaSenha = () => {
    const senha = passwordInput.value;
    if (senha.length < 8) {
      passwordStrength.textContent = 'Senha deve ter 8 letras.';
      passwordStrength.className = 'text-danger';
      aplicarFeedbackCampo(passwordInput, false, 'Senha deve ter exatamente 8 letras.');
    } else if (senha.length === 8) {
      passwordStrength.textContent = 'Senha Forte!';
      passwordStrength.className = 'text-success';
      aplicarFeedbackCampo(passwordInput, true);
    }
  };

  const verificarSenhasIguais = () => {
    const senha = passwordInput.value.trim();
    const confirmar = confirmPasswordInput.value.trim();
    if (confirmar.length > 0 && senha !== confirmar) {
      passwordMatchError.textContent = 'As senhas não coincidem.';
      aplicarFeedbackCampo(confirmPasswordInput, false, 'As senhas não coincidem.');
    } else if (confirmar.length > 0 && senha === confirmar && senha.length === 8) {
      passwordMatchError.textContent = '';
      aplicarFeedbackCampo(confirmPasswordInput, true);
    } else {
      passwordMatchError.textContent = '';
      confirmPasswordInput.classList.remove('is-valid', 'is-invalid');
    }
  };

  // Nova função para validar campos individualmente
  const validarCampoUnico = (input) => {
    const value = input.value.trim();
    const id = input.id;
    let isValid = true;
    let message = '';

    switch (id) {
      case 'fullName':
        if (!/^[a-zA-ZÀ-ü\s]{15,80}$/.test(value)) {
          isValid = false;
          message = 'Nome completo deve ter entre 15 e 80 caracteres alfabéticos (incluindo espaços e acentos).';
        }
        break;
      case 'birthDate':
        if (!value) {
          isValid = false;
          message = 'Data de nascimento é obrigatória.';
        } else {
          const birthDate = new Date(value);
          const today = new Date();
          let age = today.getFullYear() - birthDate.getFullYear();
          const m = today.getMonth() - birthDate.getMonth();
          if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
          }
          if (age < 18) {
            isValid = false;
            message = 'Você deve ter pelo menos 18 anos.';
          }
        }
        break;
      case 'gender':
        if (!value) { // Verifica se a opção padrão "Selecione seu Sexo" está selecionada
          isValid = false;
          message = 'Selecione seu sexo.';
        }
        break;
      case 'motherName':
        if (!/^[a-zA-ZÀ-ü\s]{15,80}$/.test(value)) {
          isValid = false;
          message = 'Nome materno deve ter entre 15 e 80 caracteres alfabéticos (incluindo espaços e acentos).';
        }
        break;
      case 'email':
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          isValid = false;
          message = 'Formato de e-mail inválido.';
        }
        break;
      case 'loginUser':
        if (!/^[a-zA-Z]{6}$/.test(value)) {
          isValid = false;
          message = 'Login deve conter exatamente 6 letras.';
        }
        break;
      case 'passwordUser':
        if (!/^[a-zA-Z]{8}$/.test(value)) {
          isValid = false;
          message = 'Senha deve conter exatamente 8 letras.';
        }
        break;
      case 'confirmPassword':
        if (value !== passwordInput.value.trim()) {
          isValid = false;
          message = 'As senhas não coincidem.';
        }
        break;
      case 'logradouro':
      case 'bairro':
      case 'cidade':
      case 'estado':
        // A validação de CEP já lida com o preenchimento automático.
        // Se o campo for obrigatório e não preenchido, marca como inválido.
        if (input.required && !value) {
          isValid = false;
          message = 'Campo obrigatório.';
        } else if (!value && cepInput.value.replace(/\D/g, '').length === 8 && !cepInput.classList.contains('is-invalid')) {
          // Se o CEP foi preenchido e é válido, mas o campo de endereço está vazio, não é um erro de validação do campo em si
          isValid = true; // Considera válido se deveria ser preenchido por CEP e não foi manual
        } else if (!value) {
          isValid = false; // Se não é preenchido por CEP e é obrigatório, é inválido
          message = 'Campo obrigatório.';
        }
        break;
    }

    if (input.required && !value) {
      isValid = false;
      message = 'Campo obrigatório.';
    }

    aplicarFeedbackCampo(input, isValid, message);
    return isValid;
  };

  const validarFormularioCompleto = () => {
    let valido = true;
    let primeiroInvalido = null;

    // Seleciona todos os inputs e selects que são form-control (e não styled-input, se ainda existir)
    const formControls = form.querySelectorAll('input.form-control, select.form-select');

    formControls.forEach(input => {
      // Valida cada campo individualmente
      const isValid = validarCampoUnico(input);
      if (!isValid) {
        valido = false;
        if (!primeiroInvalido) primeiroInvalido = input;
      }
    });

    // Validações específicas que dependem de outros campos ou lógicas
    // CPF e CEP já são validados via maskCPF/maskCEP e aplicarFeedbackCampo
    if (!validarCPF(cpfInput.value)) { // Revalida para garantir no submit
      aplicarFeedbackCampo(cpfInput, false, 'CPF inválido.');
      if (!primeiroInvalido) primeiroInvalido = cpfInput;
      valido = false;
    }
    if (cepInput.value.replace(/\D/g, '').length !== 8 || cepInput.classList.contains('is-invalid')) { // Revalida para garantir no submit
      aplicarFeedbackCampo(cepInput, false, 'CEP inválido ou não encontrado.');
      if (!primeiroInvalido) primeiroInvalido = cepInput;
      valido = false;
    }
    if (passwordInput.value.length !== 8) { // Revalida para garantir no submit
      aplicarFeedbackCampo(passwordInput, false, 'Senha deve ter exatamente 8 letras.');
      if (!primeiroInvalido) primeiroInvalido = passwordInput;
      valido = false;
    }
    if (confirmPasswordInput.value.trim() !== passwordInput.value.trim()) { // Revalida para garantir no submit
      aplicarFeedbackCampo(confirmPasswordInput, false, 'As senhas não coincidem.');
      if (!primeiroInvalido) primeiroInvalido = confirmPasswordInput;
      valido = false;
    }
    // Telefone celular já é validado via maskPhone/validarTelefone
    // Telefone fixo já é validado via maskPhone/validarTelefone


    return { valido, primeiroInvalido };
  };

  // Eventos de input e focusout para feedback em tempo real
  form.querySelectorAll('input.form-control, select.form-select').forEach(input => {
    if (input.id === 'cpf') {
      input.addEventListener('input', maskCPF);
      input.addEventListener('focusout', maskCPF);
    } else if (input.id === 'cep') {
      input.addEventListener('input', maskCEP);
      input.addEventListener('focusout', maskCEP);
    } else if (input.id === 'cellPhone' || input.id === 'homePhone') {
      input.addEventListener('input', () => maskPhone(input));
      input.addEventListener('focusout', () => validarTelefone(input));
    } else if (input.id === 'loginUser') {
      input.addEventListener('input', () => {
        input.value = input.value.replace(/[^a-zA-Z]/g, '').slice(0, 6);
        validarCampoUnico(input);
      });
      input.addEventListener('focusout', () => validarCampoUnico(input));
    } else if (input.id === 'passwordUser') {
      input.addEventListener('input', limitarSenha);
      input.addEventListener('focusout', validarForcaSenha);
    } else if (input.id === 'confirmPassword') {
      input.addEventListener('input', limitarSenha);
      input.addEventListener('focusout', verificarSenhasIguais);
    } else { // Para todos os outros campos form-control padrão
      input.addEventListener('input', () => validarCampoUnico(input));
      input.addEventListener('focusout', () => validarCampoUnico(input));
    }
  });

  // Evento de submit do formulário
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const { valido, primeiroInvalido } = validarFormularioCompleto();
    if (!valido) {
      primeiroInvalido?.focus();
      mostrarMensagem('Por favor, corrija os erros no formulário.', 'danger');
      return;
    }

    // Lógica para salvar usuário (pode ser o que já existia ou expandir)
    const newUser = {
      username: loginInput.value,
      password: passwordInput.value,
      // Inclua outros campos aqui conforme necessário
      fullName: fullNameInput.value,
      birthDate: birthDateInput.value,
      gender: genderSelect.value,
      motherName: motherNameInput.value,
      cpf: cpfInput.value,
      email: emailInput.value,
      cellPhone: cellPhoneInput.value,
      homePhone: homePhoneInput.value,
      cep: cepInput.value,
      logradouro: logradouroInput.value,
      bairro: bairroInput.value,
      cidade: cidadeInput.value,
      estado: estadoInput.value
    };

    // Salvar no localStorage (se a simulação for local)
    const usuariosLocais = JSON.parse(localStorage.getItem('usuariosLocais')) || [];
    usuariosLocais.push(newUser);
    localStorage.setItem('usuariosLocais', JSON.stringify(usuariosLocais));


    mostrarMensagem('Cadastro realizado com sucesso!', 'success');
    form.reset(); // Limpa o formulário após o sucesso
    // Limpa feedbacks visuais
    form.querySelectorAll('.is-valid, .is-invalid').forEach(el => {
      el.classList.remove('is-valid', 'is-invalid');
    });
    form.querySelectorAll('.invalid-feedback').forEach(el => el.remove());
    cpfIcon.innerHTML = '';
    cepIcon.innerHTML = '';
    passwordStrength.textContent = '';
    passwordMatchError.textContent = '';

    // Garante que o input de data volte a ser "text" se vazio
    birthDateInput.type = 'text';

  });

  // Ativa a validação inicial para campos preenchidos automaticamente (ex: via navegador)
  form.querySelectorAll('input.form-control, select.form-select').forEach(input => {
    if (input.value.trim() !== '' || input.type === 'date' && input.value !== '') { // Verifica data tbm
      validarCampoUnico(input);
    }
  });

});