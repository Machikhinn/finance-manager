// js/theme-manager.js - переключение светлой/тёмной темы
export class ThemeManager {
    constructor() {
        this.currentTheme = this.getSavedTheme();
        this.themeIcon = document.getElementById('themeIcon');
    }

    getSavedTheme() {
        return localStorage.getItem('theme') || 'light';
    }

    applySavedTheme() {
        this.applyTheme(this.currentTheme);
    }

    applyTheme(theme) {
        document.documentElement.setAttribute('data-bs-theme', theme);
        this.themeIcon.className = theme === 'dark' ? 'bi bi-moon-fill' : 'bi bi-sun-fill';
        localStorage.setItem('theme', theme);
        this.currentTheme = theme;
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(newTheme);
    }

    isDarkTheme() {
        return this.currentTheme === 'dark';
    }
}