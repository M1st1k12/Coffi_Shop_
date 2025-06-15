document.addEventListener('DOMContentLoaded', () => {
    const coffeeBoxes = document.querySelectorAll('.coffee-box');
    const cartCountDisplay = document.getElementById('cart-count-display');

    // --- Функції для кошика (ваш існуючий код) ---
    function getCart() {
        const cartString = localStorage.getItem('coffeeCart');
        return cartString ? JSON.parse(cartString) : [];
    }

    function updateCartCountDisplay() {
        const cart = getCart();
        let totalItems = 0;
        cart.forEach(item => {
            totalItems += item.quantity;
        });
        cartCountDisplay.textContent = totalItems;
    }

    // --- Логіка для слайдерів у картках ---
    coffeeBoxes.forEach(box => {
        const slides = box.querySelectorAll('.card-slide');
        const prevButton = box.querySelector('.card-slide-prev');
        const nextButton = box.querySelector('.card-slide-next');
        let currentSlideIndex = 0; // Початковий індекс слайда для поточної картки

        // Функція для відображення певного слайда в цій картці
        const showCardSlide = (index) => {
            // Перевіряємо межі індексу
            if (index >= slides.length) {
                currentSlideIndex = 0; // Якщо дійшли до кінця, починаємо з початку
            } else if (index < 0) {
                currentSlideIndex = slides.length - 1; // Якщо пішли за початок, переходимо до кінця
            } else {
                currentSlideIndex = index; // Інакше, встановлюємо вказаний індекс
            }

            // Приховуємо всі слайди в цій картці
            slides.forEach(slide => slide.classList.remove('active'));

            // Показуємо (робимо активним) поточний слайд
            slides[currentSlideIndex].classList.add('active');
        };

        // Обробник натискання на кнопку "назад"
        if (prevButton) {
            prevButton.addEventListener('click', (e) => {
                e.stopPropagation(); // Зупиняємо розповсюдження події, щоб клік по кнопці не перенаправляв на сторінку налаштувань
                showCardSlide(currentSlideIndex - 1);
            });
        }

        // Обробник натискання на кнопку "вперед"
        if (nextButton) {
            nextButton.addEventListener('click', (e) => {
                e.stopPropagation(); // Зупиняємо розповсюдження події
                showCardSlide(currentSlideIndex + 1);
            });
        }

        // Ініціалізуємо слайдер для кожної картки, показуючи перший слайд
        showCardSlide(0);

        // --- Логіка переходу на сторінку налаштувань при кліку на картку ---
        // Цей обробник подій залишається, але з перевіркою,
        // щоб клік по кнопках слайдера не викликав перехід на іншу сторінку.
        box.addEventListener('click', (event) => {
            // Перевіряємо, чи цільовий елемент кліку або його батьківський елемент
            // не є кнопками слайдера.
            if (!event.target.closest('.card-slide-prev') && !event.target.closest('.card-slide-next')) {
                const settingsPage = box.dataset.settingsPage;
                if (settingsPage) {
                    window.location.href = settingsPage;
                }
            }
        });
    });

    // Оновлюємо лічильник кошика при завантаженні сторінки
    updateCartCountDisplay();
});