function simulate_press_alt(e) {
    let event = new KeyboardEvent('keydown', {
        key: 'Alt', // Нажата клавиша Alt
        altKey: true, // Устанавливаем, что нажата именно клавиша Alt
    });
    e.target.dispatchEvent(event);
}

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
                console.log(x)
                if (x) {
                    e.target.value = '+7 ' + (x[2] ? '(' + x[2] : '') + (x[3] ? ') ' + x[3] : '') + (x[4] ? '-' + x[4] : '') + (x[5] ? '-' + x[5] : '');
                }
            }
        }
    }, 0);
}

function toggleTooltip() {
    /*docstrings:
     функция для отображения и скрытия подсказки
    */
    const tooltip = document.getElementById('tooltip');
    tooltip.style.display = tooltip.style.display === 'none' ? 'block' : 'none';
}

const togglePasswordVisibility = (event) => {
    /*docstrings:
     функция для отображения и скрытия пароля
    */  
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

document.querySelectorAll(' .password_eye').forEach(img => {
    /*docstrings:
     функция для отображения и скрытия пароля
    */
    img.addEventListener('click', togglePasswordVisibility);
});

// document.querySelector('input[name="phone"]').addEventListener('keydown', phone_input);

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
        // Получаем значения из полей имени и фамилии
        const firstName = document.querySelector('input[name="first_name"]').value;
        const lastName = document.querySelector('input[name="last_name"]').value;
        // Присваиваем значение полю username
        const usernameInput = document.querySelector('input[name="username"]');
        usernameInput.value = `${firstName} ${lastName}`;
        this.submit();
    }
});

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

    if (input.name === 'phone' && !isValidPhone(input.value)) {
        showError(input, 'Введите корректный номер телефона');
        return false;
    }

    if (input.classList.contains('password-input')) {
        if (input.name === 'password' && input.value.length < 8) {
            showError(input, 'Пароль должен содержать минимум 8 символов');
            return false;
        }
        if (input.name === 'password2') {
            const password1 = document.querySelector('input[name="password"]').value;
            if (password1 && input.value && input.value !== password1) {
                showError(input, 'Пароли не совпадают');
                return false;
            }
        }
    }

    return true;
}

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function isValidPhone(phone) {
    const re = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/;
    return re.test(phone);
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

document.querySelectorAll('.form_item').forEach(input => {
    input.addEventListener('blur', () => {
        // Для второго пароля проверяем совпадение только если оба пароля введены
        if (input.name === 'password2') {
            const password1 = document.querySelector('input[name="password"]').value;
            if (password1 && input.value) {
                validateField(input);
            }
        } else {
            validateField(input);
        }
    });

    input.addEventListener('input', () => {
        removeError(input);
        // Если это первый пароль и второй уже введен, проверяем их совпадение
        if (input.name === 'password') {
            const password2 = document.querySelector('input[name="password2"]');
            if (password2.value) {
                validateField(password2);
            }
        }
    });
});