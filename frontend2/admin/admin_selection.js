// Логика модального окна выхода
const logoutButton = document.getElementById('logoutButton'); // Получаем элемент кнопки выхода по ID
const logoutModal = document.getElementById('logoutModal'); // Получаем элемент модального окна выхода по ID

logoutButton.addEventListener('click', () => { // Добавляем обработчик события клика на кнопку выхода
    logoutModal.style.display = 'flex'; // Отображаем модальное окно выхода, устанавливая стиль display на 'flex'
});

function closeModal() { // Функция для закрытия модального окна выхода
    logoutModal.style.display = 'none'; // Скрываем модальное окно выхода, устанавливая стиль display на 'none'
}