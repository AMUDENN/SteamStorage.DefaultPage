let menu = document.querySelectorAll('.menu a');
menu.forEach(item => {
    item.addEventListener('click', event => {
        menu.forEach(menu_item => menu_item.classList.remove('active'));
        item.classList.add('active');
    })
});