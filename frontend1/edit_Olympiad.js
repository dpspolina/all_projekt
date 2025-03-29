// Получаем элементы формы по их идентификаторам
const title = document.getElementById("title"); // Поле ввода названия
const direction = document.getElementById("direction"); // Поле выбора направления
const level = document.getElementById("Participation-level"); // Поле выбора уровня участия
const participation = document.getElementById("Result-of-participation"); // Поле выбора результата участия
const photo = document.getElementById("photo"); // Поле выбора фото
const photoPreview = document.getElementById("photoPreview"); // Контейнер для превью фото
const uploadBox = document.getElementById("uploadBox"); // Блок для загрузки фото
const submit = document.getElementById("submit"); // Кнопка сохранения

// Создаём массив для хранения загруженных фотографий
let photos = [];
const maxPhotos = 3; // Максимальное количество фотографий

// Загружаем список олимпиад из локального хранилища (если есть)
const olympiads = JSON.parse(localStorage.getItem("olympiads")) || [];
const editIndex = localStorage.getItem("editOlympiadIndex"); // Индекс редактируемой олимпиады
const currentOlympiad = olympiads[editIndex]; // Получаем данные текущей олимпиады

// Заполняем поля формы текущими данными олимпиады
title.value = currentOlympiad.title;
direction.value = currentOlympiad.direction;
level.value = currentOlympiad.level;
participation.value = currentOlympiad.participation;
photos = [...currentOlympiad.photos]; // Копируем фотографии

// Отображаем загруженные ранее фотографии
photos.forEach(photoUrl => displayPhoto(photoUrl));

// Функция для отображения фотографии в интерфейсе
function displayPhoto(photoUrl) {
    const photoItem = document.createElement("div"); // Создаём контейнер для фото
    photoItem.classList.add("photo-item"); // Добавляем класс стилей

    const img = document.createElement("img"); // Создаём элемент изображения
    img.src = photoUrl; // Устанавливаем ссылку на фото

    const delButton = document.createElement("button"); // Создаём кнопку удаления
    delButton.textContent = "×"; // Устанавливаем текст кнопки
    delButton.onclick = () => { // Обработчик удаления фото
        photos = photos.filter(src => src !== photoUrl); // Удаляем фото из массива
        photoPreview.removeChild(photoItem); // Удаляем фото из интерфейса
        if (photos.length < maxPhotos) uploadBox.style.display = "flex"; // Показываем кнопку загрузки, если фото меньше лимита
        validateForm(); // Проверяем, можно ли активировать кнопку сохранения
    };

    photoItem.appendChild(img); // Добавляем изображение в контейнер
    photoItem.appendChild(delButton); // Добавляем кнопку удаления
    photoPreview.insertBefore(photoItem, uploadBox); // Добавляем контейнер перед кнопкой загрузки
}

function editCompetition(competitionId, updatedCompetition) {
    fetch(`${API_URL}/edit-competition/${competitionId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(updatedCompetition)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("Олимпиада обновлена успешно!");
            location.reload();
        } else {
            alert("Ошибка при обновлении олимпиады: " + data.error);
        }
    })
    .catch(error => alert("Ошибка при обновлении олимпиады: " + error));
}

// Функция проверки, можно ли сохранить изменения
function validateForm() {
    const hasChanges = // Проверяем, изменились ли данные
        title.value !== currentOlympiad.title ||
        direction.value !== currentOlympiad.direction ||
        level.value !== currentOlympiad.level ||
        participation.value !== currentOlympiad.result ||
        JSON.stringify(photos) !== JSON.stringify(currentOlympiad.photos);

    // Делаем кнопку "Сохранить" активной только при наличии изменений и заполненных данных
    submit.disabled = !hasChanges || !title.value || !direction.value || !level.value || !participation.value || photos.length === 0;
}

// Добавляем слушатели событий для полей формы, чтобы отслеживать изменения
[title, direction, level, participation].forEach(field =>
    field.addEventListener("input", validateForm)
);

// Обработчик загрузки фото
photo.addEventListener("change", event => {
    const files = Array.from(event.target.files); // Получаем загруженные файлы
    if (photos.length + files.length > maxPhotos) { // Проверяем, не превышает ли лимит
        alert(`Можно загрузить не более ${maxPhotos} фотографий.`);
        return;
    }

    files.forEach(file => {
        const reader = new FileReader(); // Создаём объект для чтения файлов
        reader.onload = () => { // Когда файл загружен
            photos.push(reader.result); // Добавляем фото в массив
            displayPhoto(reader.result); // Отображаем фото
            if (photos.length >= maxPhotos) uploadBox.style.display = "none"; // Скрываем кнопку загрузки, если лимит достигнут
            validateForm(); // Проверяем возможность сохранения
        };
        reader.readAsDataURL(file); // Читаем файл как Data URL
    });
});

// Обработчик кнопки "Сохранить"
submit.addEventListener("click", () => {
    olympiads[editIndex] = { // Обновляем данные олимпиады
        title: title.value,
        direction: direction.value,
        level: level.value,
        participation: participation.value,
        photos,
    };
    localStorage.setItem("olympiads", JSON.stringify(olympiads)); // Сохраняем в локальное хранилище
    localStorage.removeItem("editOlympiadIndex"); // Удаляем индекс редактирования
    window.location.href = "watch_Olympiad.html"; // Перенаправляем на страницу просмотра
});