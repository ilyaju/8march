// Контейнер для лепестков
const container = document.getElementById('petalContainer');

// Настройки
const CONFIG = {
    minPetals: 8,      // Минимум лепестков в начале
    maxPetals: 35,     // Максимум при полном скролле
    baseSize: 20,      // Базовый размер в пикселях
    sizeVariance: 20,  // Разброс размеров (±)
    animationSpeed: {   // Скорость анимации (секунды)
        min: 5,
        max: 12
    }
};

// Текущее количество лепестков
let currentPetalCount = CONFIG.minPetals;
let animationFrame = null;

// Функция создания одного лепестка
function createPetal() {
    const petal = document.createElement('div');
    
    // Случайный тип лепестка (1-3)
    const type = Math.floor(Math.random() * 3) + 1;
    petal.classList.add('petal', `type${type}`);
    
    // Случайный размер
    const size = CONFIG.baseSize + (Math.random() * CONFIG.sizeVariance - CONFIG.sizeVariance/2);
    petal.style.width = size + 'px';
    petal.style.height = size + 'px';
    
    // Случайная позиция слева (0-100%)
    petal.style.left = Math.random() * 100 + '%';
    
    // Случайная длительность падения
    const duration = CONFIG.animationSpeed.min + 
                    Math.random() * (CONFIG.animationSpeed.max - CONFIG.animationSpeed.min);
    petal.style.animationDuration = duration + 's';
    
    // Случайная задержка старта
    petal.style.animationDelay = Math.random() * 5 + 's';
    
    // Добавляем небольшой разброс по начальной позиции Y
    petal.style.top = -Math.random() * 30 + '%';
    
    // Сохраняем длительность для последующего удаления
    petal.dataset.duration = duration;
    
    return petal;
}

// Функция запуска анимации с нужным количеством лепестков
function startPetals(count) {
    // Очищаем контейнер
    container.innerHTML = '';
    
    // Запускаем таймеры для создания лепестков
    for (let i = 0; i < count; i++) {
        // Создаем лепестки с небольшой задержкой между ними
        setTimeout(() => {
            const petal = createPetal();
            container.appendChild(petal);
            
            // Удаляем лепесток после окончания анимации
            setTimeout(() => {
                if (petal.parentNode) {
                    petal.remove();
                }
            }, (parseFloat(petal.dataset.duration) + 1) * 1000);
            
        }, i * 150); // 150мс между созданием лепестков
    }
}

// Функция плавного обновления количества лепестков
function updatePetalCount() {
    const scrollTop = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    
    // Процент прокрутки (0 - 1)
    const scrollPercent = scrollTop / (documentHeight - windowHeight);
    
    // Новое количество лепестков (мин + прогресс * (макс - мин))
    const newCount = Math.floor(
        CONFIG.minPetals + scrollPercent * (CONFIG.maxPetals - CONFIG.minPetals)
    );
    
    // Если количество изменилось, обновляем
    if (newCount !== currentPetalCount && newCount >= CONFIG.minPetals) {
        currentPetalCount = newCount;
        
        // Используем requestAnimationFrame для плавности
        if (animationFrame) {
            cancelAnimationFrame(animationFrame);
        }
        animationFrame = requestAnimationFrame(() => {
            startPetals(currentPetalCount);
        });
    }
}

// Слушаем событие скролла с throttle для производительности
let ticking = false;
window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            updatePetalCount();
            ticking = false;
        });
        ticking = true;
    }
});

// Запускаем начальное состояние
startPetals(CONFIG.minPetals);

// Обновляем при изменении размера окна
window.addEventListener('resize', () => {
    updatePetalCount();
});