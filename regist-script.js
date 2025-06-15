document.addEventListener('DOMContentLoaded', () => {
    const registrationForm = document.getElementById('registrationForm');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const messageDiv = document.getElementById('message');

    // Функція для відображення повідомлень
    function displayMessage(text, isError = false) {
        messageDiv.textContent = text;
        messageDiv.style.color = isError ? 'red' : 'green';
        messageDiv.style.marginTop = '15px';
        messageDiv.style.fontWeight = 'bold';
    }

    registrationForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Зупиняємо стандартну відправку форми

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        // --- Валідація форми ---
        if (password.length < 6) {
            displayMessage('Пароль має бути не менше 6 символів.', true);
            return;
        }

        if (password !== confirmPassword) {
            displayMessage('Паролі не співпадають.', true);
            return;
        }

        // Перевіряємо, чи користувач з таким email вже зареєстрований
        const existingUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];
        const emailExists = existingUsers.some(user => user.email === email);

        if (emailExists) {
            displayMessage('Користувач з таким Email вже зареєстрований.', true);
            return;
        }

        // --- Зберігання даних користувача ---
        const user = {
            name: name,
            email: email,
            password: password 
        };

        existingUsers.push(user);
        localStorage.setItem('registeredUsers', JSON.stringify(existingUsers));
        
        // Зберігаємо дані поточного (залогіненого) користувача.
        localStorage.setItem('currentUser', JSON.stringify(user));

        displayMessage('Реєстрація успішна! Перенаправляємо на сторінку профілю...', false);

        // Перенаправлення на сторінку профілю після невеликої затримки
        setTimeout(() => {
            window.location.href = 'towar.html'; // Змінено з 'towar.html' на 'profile.html'
        }, 1500); 
    });
});