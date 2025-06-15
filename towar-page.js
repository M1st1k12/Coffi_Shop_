document.addEventListener('DOMContentLoaded', () => {
    const coffeeBoxes = document.querySelectorAll('.coffee-box');
    const cartCountDisplay = document.getElementById('cart-count-display');

    // Функція для отримання кошика з localStorage
    function getCart() {
        const cartString = localStorage.getItem('coffeeCart');
        return cartString ? JSON.parse(cartString) : [];
    }

    // Функція для оновлення лічильника товарів у верхньому меню
    function updateCartCountDisplay() {
        const cart = getCart();
        let totalItems = 0;
        cart.forEach(item => {
            totalItems += item.quantity;
        });
        cartCountDisplay.textContent = totalItems;
    }

    // Додаємо обробник подій для кожної картки кави
    coffeeBoxes.forEach(box => {
        box.addEventListener('click', () => {
            // Отримуємо шлях до сторінки налаштувань з атрибута data
            const settingsPage = box.dataset.settingsPage;
            if (settingsPage) {
                // Перенаправляємо користувача, додаючи відносний шлях, якщо потрібно
                // Припускаємо, що Dopseting_*.html та cart.html знаходяться в HTML/ або поруч з towar.html
                // Якщо dopseting файли в HTML/, а towar.html в корені, то '../HTML/' + settingsPage
                window.location.href = settingsPage;
            }
        });
    });

    // Оновлюємо лічильник при завантаженні сторінки
    updateCartCountDisplay();
});