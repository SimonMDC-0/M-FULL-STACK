/**
 * tema.js - Control de modo oscuro/claro para The World Is Yours (TWY)
 * Permite alternar entre tema claro y oscuro, persistiendo la preferencia en localStorage.
 */
(function () {
    'use strict';

    const STORAGE_KEY = 'twy_theme';
    const THEME_DARK = 'dark';
    const THEME_LIGHT = 'light';

    // Obtener tema preferido (guardado en localStorage o preferencia del sistema)
    function getPreferredTheme() {
        const storedTheme = localStorage.getItem(STORAGE_KEY);
        if (storedTheme === THEME_DARK || storedTheme === THEME_LIGHT) {
            return storedTheme;
        }
        return (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)
            ? THEME_DARK
            : THEME_LIGHT;
    }

    // Aplicar tema en el elemento raíz (html) y actualizar botón
    function applyTheme(theme) {
        document.documentElement.setAttribute('data-bs-theme', theme);
        updateToggleButton(theme);
    }

    // Actualizar accesibilidad, título y texto del botón según el tema activo
    function updateToggleButton(theme) {
        const toggleBtn = document.getElementById('themeToggleBtn');
        if (!toggleBtn) return;

        const isDark = theme === THEME_DARK;
        const actionText = isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro';
        const buttonText = isDark ? 'Claro' : 'Oscuro';

        toggleBtn.setAttribute('aria-label', actionText);
        toggleBtn.setAttribute('title', actionText);

        const textSpan = toggleBtn.querySelector('.theme-toggle-text');
        if (textSpan) {
            textSpan.textContent = buttonText;
        }
    }

    // Aplicar inmediatamente para evitar parpadeos visuales (FOUC)
    const initialTheme = getPreferredTheme();
    applyTheme(initialTheme);

    // Conectar el evento click cuando el DOM esté listo
    document.addEventListener('DOMContentLoaded', function () {
        const toggleBtn = document.getElementById('themeToggleBtn');
        if (!toggleBtn) return;

        // Asegurar que el estado del botón refleje el tema actual
        const currentTheme = document.documentElement.getAttribute('data-bs-theme') || initialTheme;
        updateToggleButton(currentTheme);

        toggleBtn.addEventListener('click', function () {
            const activeTheme = document.documentElement.getAttribute('data-bs-theme');
            const newTheme = activeTheme === THEME_DARK ? THEME_LIGHT : THEME_DARK;

            try {
                localStorage.setItem(STORAGE_KEY, newTheme);
            } catch (e) {
                console.warn('No se pudo guardar la preferencia en localStorage:', e);
            }

            applyTheme(newTheme);
        });
    });
})();
