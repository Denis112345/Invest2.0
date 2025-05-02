function validateField(input) {
    const container = input.closest('.form_item_container') || input.parentNode;
    const errorDiv = container.querySelector('.error-message');
    if (errorDiv) {
        errorDiv.remove();
    }

    if (!input.value.trim()) {
        showError(input, 'Это поле обязательно для заполнения');
        return false;
    }

    if (input.type === 'email' && !isValidEmail(input.value)) {
        showError(input, 'Введите корректный email');
        return false;
    }

    if (input.classList.contains('password-input')) {
        if (input.value.length < 8) {
            showError(input, 'Пароль должен содержать минимум 8 символов');
            return false;
        }
    }

    return true;
}

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function showError(input, message) {
    input.classList.add('error');
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    const container = input.closest('.form_item_container') || input.parentNode;
    container.appendChild(errorDiv);
}

function removeError(input) {
    input.classList.remove('error');
    const container = input.closest('.form_item_container') || input.parentNode;
    const errorDiv = container.querySelector('.error-message');
    if (errorDiv) {
        errorDiv.remove();
    }
}

// Добавляем обработчики событий для валидации
document.querySelectorAll('.form_item').forEach(input => {
    input.addEventListener('blur', () => {
        validateField(input);
    });

    input.addEventListener('input', () => {
        removeError(input);
    });
});

// Обработчик отправки формы
document.getElementsByClassName('form_signup')[0].addEventListener('submit', function(event) {
    event.preventDefault();
    
    let isValid = true;
    const inputs = document.querySelectorAll('.form_item');
    
    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });

    if (isValid) {
        this.submit();
    }
});

// Функция для показа/скрытия пароля
const togglePasswordVisibility = (event) => {
    const input = event.target.previousElementSibling;
    const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
    const img = event.target;
    if (type === 'password') {
        img.src = '/static/img/closed_eye.svg';
        img.style.top = 'calc(50% - 25px)';
    } else {
        img.src = '/static/img/eye.svg';
        img.style.top = 'calc(50% - 19.5px)';
    }
    input.setAttribute('type', type);
};

// Добавляем обработчик для кнопки показа пароля
document.querySelectorAll('.password_eye').forEach(img => {
    img.addEventListener('click', togglePasswordVisibility);
});

function phone_input(e) {
    // docstrings:
    // функция для ввода номера телефона
    setTimeout(function () {
        // Игнорируем нажатия клавиш, которые не являются цифрами или Backspace
        if (!/\d/.test(e.key) && e.key !== 'Backspace') {
            return;
        }

        let input = e.target.value.replace(/\D/g, ''); // Удаляем все нецифровые символы

        // Если вводим первую цифру, добавляем +7
        if (input.length === 1 && e.key !== 'Backspace') {
            input = '7' + e.key; // Добавляем 7 перед первой цифрой
        } 
        let x = input.match(/(\d{1})(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})/);
        if (x) {
            e.target.value = '+7 ' + (x[2] ? '(' + x[2] : '') + (x[3] ? ') ' + x[3] : '') + (x[4] ? '-' + x[4] : '') + (x[5] ? '-' + x[5] : '');
        }

        // Обработка Backspace
        if (e.key === 'Backspace') {
            if (input.length > 0) {
                let x = input.match(/(\d{1})(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})/);
                if (x) {
                    e.target.value = '+7 ' + (x[2] ? '(' + x[2] : '') + (x[3] ? ') ' + x[3] : '') + (x[4] ? '-' + x[4] : '') + (x[5] ? '-' + x[5] : '');
                }
            }
        }
    }, 0);
}