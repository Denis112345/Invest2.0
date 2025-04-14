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

document.getElementsByClassName('form_signup')[0]   .addEventListener('submit', function(event) {
    /*docstrings:
     функция для отправки формы
    */
    event.preventDefault(); // Предотвращаем стандартное поведение отправки формы

    // Получаем значения из полей имени и фамилии
    const firstName = document.querySelector('input[name="first_name"]').value;
    const lastName = document.querySelector('input[name="last_name"]').value;

    // Присваиваем значение полю username
    const usernameInput = document.querySelector('input[name="username"]');
    usernameInput.value = `${firstName} ${lastName}`; // Объединяем имя и фамилию

    // Теперь можно отправить форму
    this.submit(); // Отправляем форму
});