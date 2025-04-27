document.addEventListener('DOMContentLoaded', function () {
  
  const passwordInput = document.getElementById('passwordUser');
  const passwordStrength = document.getElementById('password-strength');

  passwordInput.addEventListener('input', function () {
    const value = passwordInput.value;
    
    if (value.length === 0) {
      passwordStrength.style.width = '0';
      passwordStrength.className = '';
      return;
    }
    
    if (value.length < 8) {
      passwordStrength.className = 'strength-weak';
      passwordStrength.style.width = (value.length / 8) * 100 + '%';
    } else if (value.length === 8) {
      passwordStrength.className = 'strength-strong';
      passwordStrength.style.width = '100%';
    }
  });

});
