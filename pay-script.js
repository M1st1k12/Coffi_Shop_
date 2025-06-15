document.addEventListener('DOMContentLoaded', () => {
    const cartItemsSummary = document.getElementById('cart-items-summary');
    const summaryTotalPrice = document.getElementById('summary-total-price');
    const cardNumberInput = document.getElementById('card-number');
    const expiryMonthInput = document.getElementById('expiry-month');
    const expiryYearInput = document.getElementById('expiry-year');
    const paymentForm = document.querySelector('.payment-form');
    const cardIcons = document.querySelectorAll('.card-icons i');
    const payButton = document.querySelector('.pay-button');

    // --- 1. Отримання даних з LocalStorage ---
    function getCart() {
        const cartString = localStorage.getItem('coffeeCart');
        return cartString ? JSON.parse(cartString) : [];
    }

    // --- 2. Відображення деталей замовлення ---
    function displayOrderSummary() {
        const cart = getCart();
        let totalSum = 0;

        cartItemsSummary.innerHTML = ''; // Очищаємо попередній вміст

        if (cart.length === 0) {
            cartItemsSummary.innerHTML = '<p>Ваш кошик порожній. Будь ласка, <a href="towar.html">оберіть напої</a>.</p>';
            payButton.disabled = true; // Вимкнути кнопку оплати
            payButton.style.backgroundColor = '#ccc'; // Зробити її сірою
            payButton.style.cursor = 'not-allowed';
            summaryTotalPrice.textContent = '0.00 грн';
            return;
        } else {
            payButton.disabled = false; // Увімкнути кнопку оплати
            payButton.style.backgroundColor = '#8B4513'; // Повернути оригінальний колір
            payButton.style.cursor = 'pointer';
        }

        cart.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('cart-item-summary');

            // Форматуємо деталі товару
            const extrasText = (item.extras && item.extras.length > 0)
                ? `<span class="item-details-line">Додатково: ${item.extras.join(', ')}</span>`
                : '';
            const sugarText = item.sugarOption
                ? `<span class="item-details-line">Цукор: ${item.sugarOption}</span>`
                : '';
            const sizeText = item.size
                ? `<span class="item-details-line">Розмір: ${item.size}</span>`
                : '';
            const quantityText = item.quantity ? ` (${item.quantity} шт.)` : '';

            // Перевіряємо, чи item.price є числом. Якщо ні, спробуйте конвертувати.
            const itemPriceValue = typeof item.price === 'number' ? item.price : parseFloat(String(item.price).replace('грн', '').replace(',', '.'));
            const validatedItemPrice = isNaN(itemPriceValue) ? 0 : itemPriceValue;

            const itemTotalPrice = validatedItemPrice * item.quantity;
            totalSum += itemTotalPrice;

            itemElement.innerHTML = `
                <div class="item-info">
                    <span class="item-name">${item.name}</span>
                    ${sizeText}
                    ${sugarText}
                    ${extrasText}
                </div>
                <span class="item-price">${itemTotalPrice.toFixed(2)} грн</span>
            `;
            cartItemsSummary.appendChild(itemElement);
        });

        summaryTotalPrice.textContent = `${totalSum.toFixed(2)} грн`;
    }

    // --- 3. Форматування номера картки та визначення типу ---
    cardNumberInput.addEventListener('input', () => {
        let cardNumber = cardNumberInput.value.replace(/\s/g, ''); // Видаляємо всі пробіли
        // Додаємо пробіли кожні 4 цифри
        cardNumber = cardNumber.replace(/(\d{4})/g, '$1 ').trim();
        cardNumberInput.value = cardNumber;

        // Валідація довжини (можна додати більш точну, залежно від типу картки)
        if (cardNumber.length > 23) { // Максимум для 19-цифрових карт + 3 пробіли
            cardNumberInput.value = cardNumber.substring(0, 23);
        }

        // --- Визначення типу картки ---
        // Приховуємо всі іконки (робимо їх напівпрозорими)
        cardIcons.forEach(icon => icon.classList.remove('active'));

        // Визначаємо тип за першими цифрами (BIN-номери). Це спрощений варіант.
        const firstDigit = cardNumber.charAt(0);
        const firstTwoDigits = cardNumber.substring(0, 2);
        const firstFourDigits = cardNumber.substring(0, 4);

        if (firstDigit === '4') { // Visa
            document.querySelector('[data-card-type="visa"]').classList.add('active');
        } else if (firstDigit === '5' && parseInt(firstTwoDigits) >= 51 && parseInt(firstTwoDigits) <= 55) { // Mastercard (51-55)
            document.querySelector('[data-card-type="mastercard"]').classList.add('active');
        } else if (firstTwoDigits === '34' || firstTwoDigits === '37') { // Amex
            document.querySelector('[data-card-type="amex"]').classList.add('active');
        } else if (firstFourDigits === '6011' || firstTwoDigits === '65' || (parseInt(firstFourDigits) >= 6440 && parseInt(firstFourDigits) <= 6499)) { // Discover
             document.querySelector('[data-card-type="discover"]').classList.add('active');
        } else if (parseInt(firstFourDigits) >= 3528 && parseInt(firstFourDigits) <= 3589) { // JCB
             document.querySelector('[data-card-type="jcb"]').classList.add('active');
        }
    });

    // --- 4. Валідація терміну дії картки ---
    const validateExpiryDate = () => {
        const currentYear = new Date().getFullYear() % 100; // Останні 2 цифри поточного року (наприклад, 25 для 2025)
        const currentMonth = new Date().getMonth() + 1; // Поточний місяць (1-12)

        const inputMonth = parseInt(expiryMonthInput.value, 10);
        const inputYear = parseInt(expiryYearInput.value, 10);

        if (isNaN(inputMonth) || isNaN(inputYear) || inputMonth < 1 || inputMonth > 12) {
            expiryMonthInput.setCustomValidity('Некоректний місяць (MM)');
            return false;
        } else if (inputYear < currentYear || (inputYear === currentYear && inputMonth < currentMonth)) {
            expiryYearInput.setCustomValidity('Термін дії картки минув');
            return false;
        } else {
            expiryMonthInput.setCustomValidity('');
            expiryYearInput.setCustomValidity('');
            return true;
        }
    };

    // Обробники для полів терміну дії
    expiryMonthInput.addEventListener('input', () => {
        // Додаємо 0 перед місяцем, якщо введено одну цифру і вона більша за 1 (для MM формату)
        if (expiryMonthInput.value.length === 1 && parseInt(expiryMonthInput.value, 10) > 1) {
            expiryMonthInput.value = '0' + expiryMonthInput.value;
        }
        validateExpiryDate();
    });
    expiryYearInput.addEventListener('input', validateExpiryDate);

    // --- 5. Обробка відправки форми ---
    paymentForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Запобігаємо стандартній відправці форми

        // Проводимо фінальну валідацію всіх полів форми
        if (!paymentForm.checkValidity() || !validateExpiryDate()) {
            alert('Будь ласка, заповніть усі обов\'язкові поля коректно.');
            return;
        }

        // Отримання даних з форми
        const cardNumber = cardNumberInput.value.replace(/\s/g, '');
        const cardHolder = document.getElementById('card-holder').value;
        const expiryMonth = expiryMonthInput.value;
        const expiryYear = expiryYearInput.value;
        const cvv = document.getElementById('cvv').value;
        const email = document.getElementById('email').value;

        // --- У РЕАЛЬНОМУ ПРОЕКТІ ТУТ БУЛА Б ІНТЕГРАЦІЯ З ПЛАТІЖНИМ ШЛЮЗОМ ---
        // Це лише імітація успішної оплати для демонстраційних цілей.
        // НІКОЛИ не відправляйте дані картки (номер, CVV) на ваш власний сервер без токенізації
        // через платіжний шлюз (наприклад, Stripe, LiqPay, Portmone тощо).
        console.log('Дані для оплати (демо):', {
            cardNumber: '************' + cardNumber.slice(-4), // Не виводимо повний номер
            cardHolder,
            expiryMonth,
            expiryYear,
            cvv: '***', // Ніколи не виводимо CVV
            email,
            totalPrice: summaryTotalPrice.textContent
        });

        alert('Оплата успішна!');

        // Після успішної оплати:
        localStorage.removeItem('coffeeCart'); // Очистити кошик
        window.location.href = 'order-confirmation.html'; // Перенаправити на сторінку підтвердження
    });

    // --- Ініціалізація при завантаженні сторінки ---
    displayOrderSummary(); // Заповнюємо зведення замовлення
});