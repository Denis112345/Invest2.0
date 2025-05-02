const formSignUp = document.getElementsByClassName('form_signup')[0]

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

function toggleTooltip() {
    /*docstrings:
     функция для отображения и скрытия подсказки
    */
    const tooltip = document.getElementById('tooltip');
    if (tooltip.style.display === 'none' || tooltip.style.display === '') {
        tooltip.style.display = 'block';
    } else {
        tooltip.style.display = 'none';
    }
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
        img.style.top = '9px';
    } else {
        img.src = '/static/img/eye.svg';
        img.style.top = '13px';
    }
    input.setAttribute('type', type);
};

document.querySelectorAll(' .password_eye').forEach(img => {
    img.addEventListener('click', togglePasswordVisibility);
});

/* ERROR MESSAGES */
function createErrorDiv(errorMessage){
    let errorDiv = document.createElement('div')
    errorDiv.classList.add('error-message')
    errorDiv.innerHTML = errorMessage
    return errorDiv
}

function insertErrorDiv(nameInput, errorDiv) {
    if (nameInput == 'username'){ return }
    console.log(nameInput)
    input = document.getElementsByName(nameInput)[0]
    inputContainer = input.parentNode
    inputContainer.insertBefore(errorDiv, input.nextSibling)
}

function clearingErrorDivs() {
    let errorDivs = document.querySelectorAll('.error-message')
    errorDivs.forEach(errorDiv => {
        errorDiv.remove()
    })
}

function createAndInsertErrorDivs(errors) {
    clearingErrorDivs()
    Object.keys(errors).forEach(key => {
        if (key == 'username'){ return }
        let errorDiv = createErrorDiv(errors[key])
        insertErrorDiv(key, errorDiv)
    })
}

function conertObjToFormData(obj) {
    const formData = new FormData()
    Object.keys(obj).forEach(key => {
        formData.append(key, obj[key])
    })
    return formData
}

function gerFormData(form) {
    let formData = new FormData(form)
    let data = {}
    formData.forEach((value, key) => {
        data[key] = value
    })
    return data
}

async function fetchSignup(request_body) {
    const reponse = await fetch(window.location.href, {
        method: 'POST',
        headers: {
            'X-CSRFToken': request_body['csrfmiddlewaretoken']
        },
        body: conertObjToFormData(request_body),
    })
    const result = await reponse.json()
    return result
}

function changeInputsColorByErrors(errors) {
    Object.keys(errors).forEach(key => {
        if (key == 'username'){ return }
        input = document.getElementsByName(key)[0]
        input.style.borderColor = 'red'
    })
}

function handleSignupResponse(result) {
    if (result.status == 200) {
        window.location.href = '/account/signup_link_sent/'
    }
    else {
        createAndInsertErrorDivs(result.errors)
        changeInputsColorByErrors(result.errors)
    }
}

formSignUp.addEventListener('submit', async function(event) {
    event.preventDefault()

    let data = gerFormData(formSignUp)
    data['username'] = `${data['first_name']} ${data['last_name']}`

    try{
        let result = await fetchSignup(data)
        handleSignupResponse(result)
    }
    catch (error) {
        console.log('Ошибка отправки формы: ', error)
    }
})