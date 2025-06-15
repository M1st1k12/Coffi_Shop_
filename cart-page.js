document.addEventListener('DOMContentLoaded', () => {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    const clearCartButton = document.getElementById('clear-cart');
    const checkoutButton = document.querySelector('.checkout-btn'); // Отримуємо кнопку "Заплатити"

    // Функція для отримання кошика з localStorage
    function getCart() {
        const cartString = localStorage.getItem('coffeeCart');
        // Завжди повертаємо масив, якщо localStorage порожній або некоректний
        return cartString ? JSON.parse(cartString) : [];
    }

    // Функція для збереження кошика в localStorage
    function saveCart(cart) {
        localStorage.setItem('coffeeCart', JSON.stringify(cart));
        renderCart(); // Оновлюємо відображення кошика після збереження
        // Якщо потрібно оновити лічильник на інших сторінках,
        // це повинно бути викликано там при завантаженні або через подію.
    }

    // Функція для відображення кошика на сторінці
    function renderCart() {
        const cart = getCart();
        cartItemsContainer.innerHTML = ''; // Очищаємо контейнер перед відображенням
        let total = 0;

        // Приховуємо/показуємо повідомлення про порожній кошик та кнопки дій
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart-message">Ваш кошик порожній.</p>';
            cartTotalElement.textContent = '0.00 грн';
            clearCartButton.style.display = 'none'; // Ховаємо кнопку "Очистити кошик"
            checkoutButton.disabled = true; // Вимикаємо кнопку "Заплатити"
            checkoutButton.classList.add('disabled-btn'); // Додаємо клас для стилів
            return;
        } else {
            // Показуємо кнопки та вмикаємо оплату, якщо кошик не порожній
            clearCartButton.style.display = 'block';
            checkoutButton.disabled = false;
            checkoutButton.classList.remove('disabled-btn');
        }

        cart.forEach((item, index) => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('cart-item');

            // Форматуємо додаткові опції та цукор. Додаємо перевірку на існування властивостей.
            const extrasText = (item.extras && item.extras.length > 0)
                ? `<span class="item-option">Додатково: ${item.extras.join(', ')}</span>`
                : '';
            const sugarText = item.sugarOption
                ? `<span class="item-option">Цукор: ${item.sugarOption}</span>`
                : '';
            const sizeText = item.size
                ? `<span class="item-option">Розмір: ${item.size}</span>`
                : '';

            // Перевіряємо, чи item.price є числом. Якщо ні, спробуйте конвертувати.
            // Припускаємо, що item.price вже число для коректних розрахунків.
            const itemPriceValue = typeof item.price === 'number' ? item.price : parseFloat(String(item.price).replace('грн', '').replace(',', '.'));
            
            // Якщо itemPriceValue не є числом після конвертації, встановіть 0, щоб уникнути помилок
            const validatedItemPrice = isNaN(itemPriceValue) ? 0 : itemPriceValue;

            const itemTotalPrice = validatedItemPrice * item.quantity;
            total += itemTotalPrice;

            itemElement.innerHTML = `
                <div class="item-details">
                    <span class="item-name">${item.name}</span>
                    ${sizeText}
                    ${sugarText}
                    ${extrasText}
                    <span class="item-price">Ціна: ${validatedItemPrice.toFixed(2)} грн / шт.</span>
                </div>
                <div class="item-quantity-controls">
                    <button class="quantity-btn decrease-quantity" data-index="${index}">-</button>
                    <span class="item-quantity">${item.quantity}</span>
                    <button class="quantity-btn increase-quantity" data-index="${index}">+</button>
                    <button class="remove-item-btn" data-index="${index}">Видалити</button>
                </div>
            `;
            cartItemsContainer.appendChild(itemElement);
        });

        cartTotalElement.textContent = total.toFixed(2) + ' грн'; // Форматуємо загальну суму
    }

    // Збільшення/зменшення кількості товару
    function updateCartItemQuantity(index, change) {
        const cart = getCart();
        if (cart[index]) {
            cart[index].quantity += change;
            if (cart[index].quantity <= 0) {
                // Якщо кількість стала 0 або менше, видаляємо товар
                cart.splice(index, 1);
            }
            saveCart(cart); // Зберігаємо та перерендеримо
        }
    }

    // Видалення товару з кошика
    function removeItemFromCart(index) {
        const cart = getCart();
        if (cart[index]) {
            // Запитуємо підтвердження перед видаленням
            if (confirm(`Ви впевнені, що хочете видалити "${cart[index].name}" з кошика?`)) {
                cart.splice(index, 1);
                saveCart(cart); // Зберігаємо та перерендеримо
            }
        }
    }

    // Очищення всього кошика
    function clearCart() {
        if (confirm('Ви впевнені, що хочете очистити весь кошик?')) {
            localStorage.removeItem('coffeeCart');
            renderCart(); // Перерендеримо кошик після очищення
        }
    }

    // Обробники подій для кнопок кошика (делегування подій)
    cartItemsContainer.addEventListener('click', (event) => {
        const target = event.target;
        const index = parseInt(target.dataset.index); // Отримуємо індекс елемента

        if (!isNaN(index)) { // Перевіряємо, чи індекс є числом
            if (target.classList.contains('increase-quantity')) {
                updateCartItemQuantity(index, 1);
            } else if (target.classList.contains('decrease-quantity')) {
                updateCartItemQuantity(index, -1);
            } else if (target.classList.contains('remove-item-btn')) {
                removeItemFromCart(index);
            }
        }
    });

    // Обробник для кнопки "Очистити кошик"
    clearCartButton.addEventListener('click', clearCart);

    // Ініціалізуємо відображення кошика при завантаженні сторінки
    renderCart();
});