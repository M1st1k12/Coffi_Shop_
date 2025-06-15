document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const messageDiv = document.getElementById('message');

    // Функція для відображення повідомлень
    function displayMessage(text, isError = false) {
        messageDiv.textContent = text;
        messageDiv.style.color = isError ? 'red' : 'green';
        messageDiv.style.marginTop = '15px';
        messageDiv.style.fontWeight = 'bold';
    }

    loginForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Зупиняємо стандартну відправку форми

        const email = emailInput.value.trim();
        const password = passwordInput.value;

        // Отримуємо зареєстрованих користувачів з localStorage
        const existingUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];

        // Шукаємо користувача за email та паролем
        const foundUser = existingUsers.find(user => user.email === email && user.password === password);

        if (foundUser) {
            // Зберігаємо дані поточного залогіненого користувача
            localStorage.setItem('currentUser', JSON.stringify(foundUser));
            displayMessage('Вхід успішний! Перенаправляємо на сторінку профілю...', false);
            
            setTimeout(() => {
                window.location.href = 'towar.html'; // Перенаправлення на сторінку профілю
            }, 1500);
        } else {
            displayMessage('Невірний Email або пароль. Спробуйте ще раз.', true);
        }
    });
});