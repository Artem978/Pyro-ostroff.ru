 document.addEventListener('DOMContentLoaded', () => {
        const buttons = document.querySelectorAll('.portfolio-btn');
        const items = document.querySelectorAll('.portfolio-item');
        const loadMoreBtn = document.getElementById('load-more-btn');
        
        let currentFilter = 'all';
        const ITEMS_PER_PAGE = 6; // Ровно 2 заполненных десктопных ряда по умолчанию
        let visibleCount = ITEMS_PER_PAGE;

        // Инициализация GLightbox для портфолио
        let portfolioLightbox = GLightbox({
            selector: '.glightbox[data-gallery="portfolio-gallery"]',
            type: 'image'
        });

        function updatePortfolio() {
            let filteredItems = [];
            
            // 1. Сортировка по активной категории
            items.forEach(item => {
                const itemCategory = item.getAttribute('data-category');
                const linkElement = item.querySelector('a');
                
                if (currentFilter === 'all' || itemCategory === currentFilter) {
                    filteredItems.push(item);
                    linkElement.setAttribute('data-gallery', 'portfolio-gallery');
                } else {
                    item.style.display = 'none';
                    linkElement.removeAttribute('data-gallery');
                }
            });

            // 2. Ограничение по лимитам пагинации
            filteredItems.forEach((item, index) => {
                const linkElement = item.querySelector('a');
                if (index < visibleCount) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                    linkElement.removeAttribute('data-gallery'); // Исключаем скрытые из карусели слайдера
                }
            });

            // 3. Контроль видимости кнопки
            if (filteredItems.length > visibleCount) {
                loadMoreBtn.style.display = 'inline-block';
            } else {
                loadMoreBtn.style.display = 'none';
            }

            // Мягкая перезагрузка слайдера для пересчета только видимых на экране карточек
            portfolioLightbox.reload();
        }

        // Логика кликов по табам категорий
        // Логика кликов по табам категорий
        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Очищаем старый активный лазурный цвет со всех кнопок
                buttons.forEach(b => {
                    b.classList.remove('text-brand-400', 'bg-brand-500/10', 'border-brand-500/20', 'active');
                    b.classList.add('text-gray-400', 'border-transparent');
                });
                
                // Добавляем новый лазурный цвет на ту кнопку, которую нажали
                btn.classList.add('text-brand-400', 'bg-brand-500/10', 'border-brand-500/20', 'active');
                btn.classList.remove('text-gray-400', 'border-transparent');

                currentFilter = btn.getAttribute('data-filter');
                visibleCount = ITEMS_PER_PAGE; 
                updatePortfolio();
            });
        });

        // Логика клика по кнопке "Показать еще"
        loadMoreBtn.addEventListener('click', () => {
            visibleCount += ITEMS_PER_PAGE; // Добавляем следующую порцию (9 карточек)
            updatePortfolio();
        });

        // Первичный запуск фильтра при загрузке страницы
        updatePortfolio();
    });
// 1. Инициализация для карточек услуг (модальные окна)
const lightbox = GLightbox({
        selector: '.glightbox-inline',
        type: 'inline',
        width: 'auto',
    });
// 2. Инициализация для грамот и картинок (стандартная галерея)
const imageLightbox = GLightbox({
    selector: '.glightbox',
    type: 'image',
});
// Скрипт формы
 document.querySelector('form').addEventListener('submit', async (e) => {
        e.preventDefault(); // Блокируем стандартную перезагрузку страницы
        
        const form = e.target;
        const button = form.querySelector('button[type="submit"]');
        const originalButtonText = button.textContent;
        
        // Визуальный фидбек: меняем текст на кнопке во время отправки
        button.textContent = 'Отправка...';
        button.disabled = true;

        const formData = new FormData(form);

        try {
            const response = await fetch('send.php', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (result.status === 'success') {
                alert('Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.');
                form.reset(); // Очищаем форму после успешной отправки
            } else {
                alert('Ошибка сервера: ' + result.message);
            }
        } catch (error) {
            alert('Не удалось отправить заявку. Проверьте соединение с интернетом.');
        } finally {
            // Возвращаем кнопку в исходное состояние
            button.textContent = originalButtonText;
            button.disabled = false;
        }
    });
//Мультиязычность
const btnRu = document.getElementById('lang-ru');
const btnTt = document.getElementById('lang-tt');

if (btnRu && btnTt) {
    function switchLanguage(lang) {
        // Сохраняем выбор в кэш браузера
        localStorage.setItem('site_lang', lang);

        // Пробегаемся по всем элементам с атрибутом data-i18n
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (translations[lang] && translations[lang][key]) {
                element.innerHTML = translations[lang][key];
            }
        });

        // Корректируем активные стили кнопок переключателя
        if (lang === 'tt') {
            btnTt.classList.add('text-brand-400');
            btnTt.classList.remove('text-gray-500');
            btnRu.classList.add('text-gray-500');
            btnRu.classList.remove('text-brand-400');
        } else {
            btnRu.classList.add('text-brand-400');
            btnRu.classList.remove('text-gray-500');
            btnTt.classList.add('text-gray-500');
            btnTt.classList.remove('text-brand-400');
        }
    }

    // Вешаем слушатели на клики
    btnRu.addEventListener('click', () => switchLanguage('ru'));
    btnTt.addEventListener('click', () => switchLanguage('tt'));

    // Проверяем, был ли сохранен язык ранее, иначе ставим по умолчанию русский
    const currentLang = localStorage.getItem('site_lang') || 'ru';
    switchLanguage(currentLang);
}

