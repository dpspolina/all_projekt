// Получаем список олимпиад из localStorage или создаём пустой массив, если данных нет
const olympiads = JSON.parse(localStorage.getItem('olympiads')) || [];
const olympiadsContainer = document.getElementById('olympiadsContainer'); // Получаем элемент контейнера для олимпиад
const photoItem = document.querySelectorAll(".photo-item"); // Получаем все элементы с классом photo-item
document.getElementById('userName').innerText = localStorage.getItem('name'); // Устанавливаем имя пользователя из localStorage
console.log(photoItem); // Выводим в консоль элементы photoItem

// Проверяем, есть ли олимпиады, если их нет - выводим сообщение
if (olympiads.length === 0) {
    olympiadsContainer.innerHTML = '<p style="text-align: center;"> Олимпиады отсутствуют </p>'; // Выводим сообщение об отсутствии олимпиад
} else {
    // Если олимпиады есть, выводим их на страницу
    console.log(olympiads)
    olympiads.forEach((olympiad, index) => {
        console.log(olympiad)
        console.log(index)
        const container = document.createElement('div'); // Создаём контейнер для олимпиады
        container.classList.add('container'); // Добавляем класс контейнеру

        const fields = document.createElement('div'); // Создаём блок для полей олимпиады
        fields.classList.add('fields'); // Добавляем класс блоку

        // Создаём и заполняем поля олимпиады
        fields.innerHTML = `
            <div class="field"><span>Название:</span><span>${olympiad.name}</span></div>
            <div class="field"><span>Направление:</span><span>${olympiad.direction}</span></div>
            <div class="field"><span>Уровень участия:</span><span>${olympiad.level}</span></div>
            <div class="field"><span>Результат участия:</span><span>${olympiad.result}</span></div>
        `;

        const photoContainer = document.createElement('div'); // Создаём контейнер для фото
        photoContainer.classList.add('photo-container'); // Добавляем класс контейнеру

        // Создаём фото для олимпиады, если они есть
        olympiad.photos.forEach(photo => {
            const photoItem = document.createElement('div'); // Создаём элемент для фото
            photoItem.classList.add('photo-item'); // Добавляем класс элементу

            const img = document.createElement('img'); // Создаём элемент изображения
            img.src = photo; // Устанавливаем источник изображения

            photoItem.appendChild(img); // Добавляем изображение в элемент
            photoContainer.appendChild(photoItem); // Добавляем элемент в контейнер фотографий
        });

        // Блок для действий (кнопки редактирования и удаления)
        const actions = document.createElement('div'); // Создаём блок для действий
        actions.classList.add('actions'); // Добавляем класс блоку

        // Кнопка редактирования
        const editButton = document.createElement('div'); // Создаём кнопку редактирования
        editButton.classList.add('action-icon'); // Добавляем класс кнопке
        editButton.innerHTML = `<img src="img/ред.svg" alt="Редактировать">`; // Устанавливаем иконку кнопки
        editButton.onclick = () => {
            localStorage.setItem('editOlympiadIndex', index); // Сохраняем индекс олимпиады для редактирования
            window.location.href = 'edit_Olympiad.html'; // Перенаправляем на страницу редактирования
        };

        // Кнопка удаления
        const deleteButton = document.createElement('div'); // Создаём кнопку удаления
        deleteButton.classList.add('action-icon'); // Добавляем класс кнопке
        deleteButton.innerHTML = `<img src="img/удалить.svg" alt="Удалить">`; // Устанавливаем иконку кнопки
        deleteButton.onclick = () => {
            deleteIndex = index; // Сохраняем индекс
            deleteModal.style.display = 'flex'; // Показываем модальное окно удаления
        };

        // Добавляем кнопки в блок с действиями
        actions.appendChild(editButton); // Добавляем кнопку редактирования в блок действий
        actions.appendChild(deleteButton); // Добавляем кнопку удаления в блок действий

        // Добавляем поля, фото и действия в контейнер олимпиады
        container.appendChild(fields); // Добавляем блок полей в контейнер
        container.appendChild(photoContainer); // Добавляем контейнер фотографий в контейнер
        container.appendChild(actions); // Добавляем блок действий в контейнер

        // Добавляем контейнер олимпиады на страницу
        olympiadsContainer.appendChild(container); // Добавляем контейнер на страницу
    });
}

// Логика подтверждения удаления
confirmDelete.addEventListener('click', () => {
    if (deleteIndex !== null) {
        olympiads.splice(deleteIndex, 1); // Удаляем олимпиаду из массива
        localStorage.setItem('olympiads', JSON.stringify(olympiads)); // Сохраняем изменения в localStorage
        location.reload(); // Перезагружаем страницу
    }
});

// Закрытие модального окна удаления
function closeDeleteModal() {
    deleteModal.style.display = 'none'; // Скрываем модальное окно
}

// Логика модального окна выхода
const logoutButton = document.getElementById('logoutButton'); // Получаем кнопку выхода
const logoutModal = document.getElementById('logoutModal'); // Получаем модальное окно выхода

logoutButton.addEventListener('click', () => {
    logoutModal.style.display = 'flex'; // Показываем модальное окно выхода
});

function closeModal() {
    logoutModal.style.display = 'none'; // Скрываем модальное окно
}

const photoItems = document.querySelectorAll(".photo-item"); // Получаем все элементы с классом photo-item
const photoContainer = document.querySelector(".photo-container"); // Получаем контейнер для фото
const fields = document.querySelector(".fields"); // Получаем блок полей
const imagePlace = document.querySelector(".image-place"); // Получаем место для изображения
const backgroundImage = document.querySelector(".background__image"); // Получаем фон для изображения
const closeBtn = document.querySelector(".close-btn"); // Получаем кнопку закрытия
const images = document.querySelectorAll(".photo-item img"); // Получаем все изображения внутри элементов photo-item

// Добавляем обработчики кликов на элементы фотографий
photoItems.forEach((el) => {
    el.addEventListener("click", () => {
        backgroundImage.style.display = "flex"; // Показываем фон для изображения
        backgroundImage.style.justifyContent = "center"; // Устанавливаем выравнивание по центру
        backgroundImage.style.alignItems = "center"; // Устанавливаем выравнивание по центру
        backgroundImage.style.position = "fixed"; // Устанавливаем позиционирование
        backgroundImage.style.top = "0"; // Устанавливаем отступ сверху
        backgroundImage.style.left = "0"; // Устанавливаем отступ слева
        backgroundImage.style.width = "100vw"; // Устанавливаем ширину
        backgroundImage.style.height = "100vh"; // Устанавливаем высоту
        backgroundImage.style.backgroundColor = "rgba(0, 0, 0, 0.8)"; // Устанавливаем цвет фона
        
        imagePlace.innerHTML = ""; // Очищаем место для изображения
        const img = el.querySelector("img").cloneNode(true); // Клонируем изображение
        img.style.maxWidth = "90vw"; // Устанавливаем максимальную ширину
        img.style.maxHeight = "90vh"; // Устанавливаем максимальную высоту
        img.style.objectFit = "contain"; // Устанавливаем свойство object-fit
        imagePlace.appendChild(img); // Добавляем изображение в место для изображения
    });
});

// Добавляем обработчик клика на кнопку закрытия
closeBtn.addEventListener("click", () => {
    backgroundImage.style.display = "none"; // Скрываем фон для изображения
});
console.log(olympiads); // Выводим в консоль список олимпиад