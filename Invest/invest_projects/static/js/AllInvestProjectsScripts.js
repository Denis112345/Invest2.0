target_categories = []

function handleEnterQuery(ev) {
    if (ev.key == 'Enter'){
        GetAllProjectsAJAX.bind({'ev':'query'})()
    }
}

function GetAllProjectsAJAX() {
    var xhr = new XMLHttpRequest();
    query_url = 'http://127.0.0.1:8000/ajax/get_all_projects/'
    arguments_url = []
    query_text = document.querySelector('.search').getElementsByTagName('input')[0].value
    if (query_text != ''){
        // Для поисковика
        arguments_url.push("query=" + encodeURIComponent(query_text))
    }
    if (target_categories.length != 0) {
        // Для категорий
        arguments_url.push("categories[]=" + encodeURIComponent(target_categories))
    }
    for (let i = 0; i < arguments_url.length; i++) {
        if (i == 0) {
            query_url += '?'+arguments_url[i]
        }
        query_url += '&'+arguments_url[i]

    }
    xhr.open('GET', query_url, true)
    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var response = xhr.responseText;
            var response = JSON.parse(response);
            if (response != undefined){
                old_items_container = document.querySelector('.container_items').innerHTML = ''
                let container = document.getElementsByClassName('container_items')[0]
                for (let i = 0; i < response.length; i++){
                    if (i % 6 == 0 && i != 0) {
                        let itemTempalte = document.getElementById('advertisement_template')
                        let advertisement = document.importNode(itemTempalte.content, true)
                        advertisement.appendChild(advertisement.children[0])
                        container.appendChild(advertisement)
                    }
                    let new_item = CloneTemplateItemHTML(response[i])
                    container.appendChild(new_item)
                    

                }
            }
        }
    };
    xhr.send();
}

function click_category(event){
    let target_element = event.target
    let item_container = document.getElementsByClassName('container_items')[0]
    item_container.innerHTML = ''

    if (target_categories.includes(target_element.textContent.trim()) == false){
        target_categories.push(target_element.textContent.trim())
        target_element.classList.toggle('clicked')
        console.log('Click')
        GetAllProjectsAJAX(target_categories)
    }
    else{
        target_categories = target_categories.filter((word) => word != target_element.textContent.trim())
        target_element.classList.remove('clicked')
        console.log('Remove')
        GetAllProjectsAJAX()
    }
}

function show_categories_menu(event){
    let categories_menu_items = document.querySelector('.categories_menu_items')
    let items_category = document.querySelectorAll('.category')
    let categories_title = document.querySelector('.categories_title')
    let categories_menu = document.querySelector('.categories_menu')

    if (!event.target.classList.contains('category')) {
        if (categories_menu_items.style.display == 'none' || categories_menu_items.style.display == ''){
            for (let i = 0; i < items_category.length; i++) {
                items_category[i].style.display = 'flex'
            }
            categories_title.style.marginBottom = '15px'
            categories_menu_items.style.display = 'flex'
            categories_menu.classList.add('categories_menu_active')
        }
        else {
            for (let i = 0; i < items_category.length; i++) {
                items_category[i].style.display = 'none'
            }
            categories_title.style.marginBottom = '0'
            categories_menu_items.style.display = 'none'
            categories_menu.classList.remove('categories_menu_active')
        }
    }


}

function CloneTemplateItemHTML(item_info) {
    let itemTempalte = document.getElementById('item_template')
    let item_clone = document.importNode(itemTempalte.content, true)

    let item_container = item_clone.children[0]

    item_container.querySelector('.item_image').src = item_info['images_urls'][0]
    item_container.querySelector('.info_title').textContent = item_info['title']
    item_container.querySelector('.item_image_a').href = '/project/'+ String(item_info['id'])
    item_container.querySelector('.item_category_a').textContent = item_info['category']
    if (item_info['profit_parametr'] == 'mouth' || item_info['profit_parametr'] == 'Месяц'){
        profit_parametr = ' в месяц'
    }
    else {
        profit_parametr = ' в год'
    }
    item_container.querySelector('.metric_profitability--info').textContent = item_info['profit_per_month'] + '%' + profit_parametr

    if (item_info['required_investment'] > 999999 && item_info['required_investment'] < 99999999){
        item_info['required_investment'] = String(item_info['required_investment']).slice(0,-6) + 'млн' 
    }

    item_container.querySelector('.metric_attachments--info').textContent = item_info['required_investment'] + ' ₽'
    return item_clone
}

function click_search() {
    words = document.getElementsByClassName('search')[0].getElementsByTagName('input')[0].value
    GetAllProjectsAJAX(words)
}

GetAllProjectsAJAX()

let category_items_blocks = document.querySelectorAll('.category')
for (let i = 0; i < category_items_blocks.length; i+=1){
    category_items_blocks[i].addEventListener('click', click_category)
}

document.querySelector('.categories_menu').addEventListener('click', show_categories_menu)
document.getElementsByClassName('search')[0].getElementsByTagName('img')[0].addEventListener('click', GetAllProjectsAJAX.bind({'ev':'query'}))
document.getElementsByClassName('search')[0].getElementsByTagName('input')[0].addEventListener('keydown', handleEnterQuery)
