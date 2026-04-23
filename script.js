/*
    =========================================================
    script.js
    Здесь находится вся интерактивность сайта:
    1. Мобильное меню
    2. Закрытие меню при клике по ссылке
    3. Анимация появления блоков при прокрутке
    4. Дополнительное улучшение плавного UX
    =========================================================
*/

// Ждём полной загрузки DOM, чтобы все элементы уже существовали в документе
document.addEventListener('DOMContentLoaded', function () {
    // =====================================================
    // МОБИЛЬНОЕ МЕНЮ
    // =====================================================

    // Получаем элементы кнопки и самой навигации
    const menuToggle = document.getElementById('menuToggle');
    const siteNav = document.getElementById('siteNav');
    const navLinks = document.querySelectorAll('.nav-link');

    // Проверяем наличие элементов, чтобы код не ломался,
    // если структура сайта будет изменена в будущем.
    if (menuToggle && siteNav) {
        menuToggle.addEventListener('click', function () {
            // Проверяем текущее состояние меню
            const isOpen = siteNav.classList.toggle('is-open');

            // Обновляем aria-атрибут для доступности
            menuToggle.setAttribute('aria-expanded', String(isOpen));

            // Добавляем/убираем визуальное состояние кнопки
            menuToggle.classList.toggle('is-active', isOpen);
        });
    }

    // При клике по пункту меню на мобильном устройстве
    // закрываем меню, чтобы не мешало просмотру контента.
    navLinks.forEach(function (link) {
        link.addEventListener('click', function () {
            if (siteNav && siteNav.classList.contains('is-open')) {
                siteNav.classList.remove('is-open');
            }

            if (menuToggle) {
                menuToggle.setAttribute('aria-expanded', 'false');
                menuToggle.classList.remove('is-active');
            }
        });
    });

    // =====================================================
    // АНИМАЦИЯ ПОЯВЛЕНИЯ ЭЛЕМЕНТОВ ПРИ СКРОЛЛЕ
    // =====================================================

    // Находим все элементы, которые должны плавно появляться
    const revealElements = document.querySelectorAll('.reveal');

    // Используем IntersectionObserver — современный и производительный
    // способ отслеживать появление элементов в зоне видимости.
    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver(function (entries, observer) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');

                    // После появления элемента перестаём за ним следить,
                    // чтобы не выполнять лишние операции.
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15
        });

        revealElements.forEach(function (element) {
            revealObserver.observe(element);
        });
    } else {
        // Резервный сценарий для очень старых браузеров:
        // просто показываем все элементы без анимации.
        revealElements.forEach(function (element) {
            element.classList.add('is-visible');
        });
    }

    // =====================================================
    // ДОПОЛНИТЕЛЬНЫЙ UX: ЗАКРЫТИЕ МЕНЮ ПО КЛИКУ ВНЕ ЕГО
    // =====================================================

    document.addEventListener('click', function (event) {
        if (!siteNav || !menuToggle) {
            return;
        }

        const clickInsideNav = siteNav.contains(event.target);
        const clickOnButton = menuToggle.contains(event.target);

        // Если меню открыто и клик был не по меню и не по кнопке,
        // закрываем меню.
        if (siteNav.classList.contains('is-open') && !clickInsideNav && !clickOnButton) {
            siteNav.classList.remove('is-open');
            menuToggle.setAttribute('aria-expanded', 'false');
            menuToggle.classList.remove('is-active');
        }
    });

    // =====================================================
    // ЗАКРЫТИЕ МЕНЮ ПРИ ИЗМЕНЕНИИ РАЗМЕРА ОКНА
    // =====================================================

    // Если пользователь открыл мобильное меню, а затем расширил окно,
    // лучше сбросить состояние меню, чтобы избежать визуальных багов.
    window.addEventListener('resize', function () {
        if (window.innerWidth > 820 && siteNav && menuToggle) {
            siteNav.classList.remove('is-open');
            menuToggle.setAttribute('aria-expanded', 'false');
            menuToggle.classList.remove('is-active');
        }
    });
});
