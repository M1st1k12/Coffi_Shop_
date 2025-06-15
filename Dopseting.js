document.addEventListener('DOMContentLoaded', () => {
    const coffeeNameElement = document.getElementById('coffeeName');
    const baseCoffeePriceElement = document.getElementById('baseCoffeePrice');
    const totalCoffeePriceElement = document.getElementById('totalCoffeePrice');
    const addToCartButton = document.getElementById('addToCartWithSettings');

    // Отримуємо базові дані про каву безпосередньо з HTML
    const coffeeName = coffeeNameElement.dataset.baseName || coffeeNameElement.textContent; // Використовуємо data-base-name, якщо є
    const basePrice = parseFloat(baseCoffeePriceElement.textContent);

    let currentPrice = basePrice;

    // Функція для оновлення загальної ціни
    function updateTotalPrice() {
        let newPrice = basePrice;

        // Розмір
        const selectedSizeInput = document.querySelector('input[name="size"]:checked');
        if (selectedSizeInput) {
            newPrice += parseFloat(selectedSizeInput.dataset.priceMod || 0);
        }

        // Додатково (чекбокси)
        document.querySelectorAll('input[name="extra"]:checked').forEach(checkbox => {
            newPrice += parseFloat(checkbox.dataset.priceMod || 0);
        });

        totalCoffeePriceElement.textContent = newPrice.toFixed(2);
        currentPrice = newPrice;
    }

    // Ініціалізуємо загальну ціну при завантаженні сторінки
    updateTotalPrice();

    // Додаємо слухачів подій для зміни ціни
    document.querySelectorAll('input[name="size"], input[name="extra"]').forEach(input => {
        input.addEventListener('change', updateTotalPrice);
    });

    // Функція для отримання кошика з localStorage
    function getCart() {
        const cartString = localStorage.getItem('coffeeCart');
        return cartString ? JSON.parse(cartString) : [];
    }

    // Функція для збереження кошика в localStorage
    function saveCart(cart) {
        localStorage.setItem('coffeeCart', JSON.stringify(cart));
    }

    // Обробник для кнопки "Додати до кошика" на сторінці налаштувань
    addToCartButton.addEventListener('click', () => {
        let cart = getCart();

        const selectedSize = document.querySelector('input[name="size"]:checked').value;
        const selectedSugar = document.querySelector('input[name="sugar"]:checked').value;
        const selectedExtras = Array.from(document.querySelectorAll('input[name="extra"]:checked'))
                                     .map(checkbox => checkbox.value);

        // Формуємо повне ім'я товару з опціями
        let itemFullName = `${coffeeName} (${selectedSize}, ${selectedSugar}`;
        if (selectedExtras.length > 0) {
            itemFullName += `, ${selectedExtras.join(', ')}`;
        }
        itemFullName += `)`;

        const itemToAdd = {
            name: itemFullName,
            baseName: coffeeName, // Для зручності, якщо треба буде групувати за базовим іменем
            price: currentPrice,
            quantity: 1,
            options: {
                size: selectedSize,
                sugar: selectedSugar,
                extras: selectedExtras
            }
        };

        // Перевіряємо, чи є вже ідентичний товар (з тими ж опціями) у кошику
        const existingItem = cart.find(item =>
            item.baseName === itemToAdd.baseName &&
            item.options.size === itemToAdd.options.size &&
            item.options.sugar === itemToAdd.options.sugar &&
            // Важливо: порівнюємо відсортовані масиви extras, щоб порядок не мав значення
            JSON.stringify(item.options.extras.sort()) === JSON.stringify(itemToAdd.options.extras.sort())
        );

        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push(itemToAdd);
        }

        saveCart(cart); // Зберігаємо оновлений кошик
        alert(`"${itemFullName}" додано до кошика за ${currentPrice.toFixed(2)} грн!`);
        window.location.href = 'towar.html'; // Повертаємося на сторінку товарів
    });
});