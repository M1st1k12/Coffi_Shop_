document.addEventListener('DOMContentLoaded', () => {
    const profileDetailsDiv = document.getElementById('profile-details');
    const logoutBtn = document.getElementById('logout-btn');

    function getCurrentUser() {
        const userString = localStorage.getItem('currentUser');
        return userString ? JSON.parse(userString) : null;
    }

    function renderProfile() {
        const user = getCurrentUser();

        if (user) {
            profileDetailsDiv.innerHTML = `
                <p><strong>Ім'я:</strong> ${user.name}</p>
                <p><strong>Email:</strong> ${user.email}</p>
                `;
        } else {
            profileDetailsDiv.innerHTML = `
                <p>Будь ласка, <a href="regist.html">зареєструйтесь</a> або <a href="login.html">увійдіть</a>, щоб переглянути ваш профіль.</p>
                `;
            // Приховати кнопку "Вийти", якщо користувач не залогінений
            logoutBtn.style.display = 'none'; 
        }
    }

    function logout() {
        if (confirm('Ви впевнені, що хочете вийти з профілю?')) {
            localStorage.removeItem('currentUser'); // Видаляємо дані поточного користувача
            alert('Ви успішно вийшли.');
            window.location.href = 'login.html'; // Після виходу перенаправляємо на сторінку входу
        }
    }

    logoutBtn.addEventListener('click', logout);

    renderProfile(); // Відображаємо профіль при завантаженні сторінки
});