// js/finance-app.js
import { ApiClient } from './api-client.js';
import { UIManager } from './ui-manager.js';

export class FinanceApp {
    constructor() {
        console.log('💰 FinanceApp создан!');
        this.apiClient = new ApiClient();
        this.uiManager = new UIManager();
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.applyTheme(this.currentTheme);
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadTransactions();
        console.log('💰 Приложение инициализировано!');
    }

    setupEventListeners() {
        // Переключатель темы
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });
            console.log('✅ Переключатель темы настроен');
        }

        // Форма добавления транзакции
        const form = document.getElementById('transactionForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleAddTransaction();
            });
            console.log('✅ Форма транзакции настроена');
        }

        // Кнопка сброса
        const resetBtn = document.getElementById('resetButton');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                this.handleReset();
            });
            console.log('✅ Кнопка сброса настроена');
        }

        // Подтверждение сброса
        const confirmReset = document.getElementById('confirmReset');
        if (confirmReset) {
            confirmReset.addEventListener('click', () => {
                this.confirmReset();
            });
        }

        // Фильтры
        document.querySelectorAll('[data-filter]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleFilter(e.target.dataset.filter);
            });
        });
        console.log('✅ Фильтры настроены');
    }

    applyTheme(theme) {
        document.documentElement.setAttribute('data-bs-theme', theme);
        const icon = document.getElementById('themeIcon');
        if (icon) {
            icon.className = theme === 'dark' ? 'bi bi-moon-fill' : 'bi bi-sun-fill';
        }
        localStorage.setItem('theme', theme);
        this.currentTheme = theme;
        console.log('🎨 Тема применена:', theme);
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.applyTheme(newTheme);
        console.log('🎨 Тема изменена на:', newTheme);
    }

    async loadTransactions() {
        try {
            console.log('📡 Загружаем транзакции...');
            const transactions = await this.apiClient.getTransactions();
            this.updateUI(transactions);
        } catch (error) {
            console.error('Ошибка загрузки транзакций:', error);
            this.uiManager.showAlert('Ошибка загрузки транзакций', 'danger');
        }
    }

    async handleAddTransaction() {
        const amount = document.getElementById('amount').value;
        const type = document.getElementById('type').value;
        const category = document.getElementById('category').value;
        const description = document.getElementById('description').value;

        console.log('➕ Добавляем транзакцию:', { amount, type, category, description });

        if (!amount || !category || !description) {
            this.uiManager.showAlert('Заполните все поля!', 'warning');
            return;
        }

        try {
            const result = await this.apiClient.addTransaction({
                amount,
                type,
                category,
                description
            });

            // Обрабатываем и текст, и JSON ответы
            const message = typeof result === 'string' ? result : (result.message || 'Транзакция добавлена!');

            document.getElementById('transactionForm').reset();
            this.uiManager.showAlert(message, 'success');

            // Перезагружаем список транзакций
            await this.loadTransactions();
        } catch (error) {
            console.error('Ошибка добавления транзакции:', error);
            this.uiManager.showAlert('Ошибка при добавлении транзакции: ' + error.message, 'danger');
        }
    }

    handleReset() {
        console.log('🗑️ Запрос на сброс транзакций');
        this.uiManager.showResetModal();
    }

    async confirmReset() {
        try {
            const result = await this.apiClient.resetTransactions();

            // Обрабатываем и текст, и JSON ответы
            const message = typeof result === 'string' ? result : (result.message || 'Транзакции сброшены!');

            this.uiManager.hideResetModal();
            this.uiManager.showAlert(message, 'success');
            await this.loadTransactions();
        } catch (error) {
            console.error('Ошибка сброса транзакций:', error);
            this.uiManager.showAlert('Ошибка при сбросе транзакций: ' + error.message, 'danger');
        }
    }

    handleFilter(filter) {
        console.log('🔍 Фильтр изменён на:', filter);
        document.querySelectorAll('[data-filter]').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.filter === filter) {
                btn.classList.add('active');
            }
        });

        this.loadTransactions();
    }

    updateUI(transactions) {
        console.log('🔄 Обновляем интерфейс, транзакций:', transactions.length);
        this.uiManager.displayTransactions(transactions);
        this.uiManager.updateBalance(transactions);
        this.uiManager.updateTransactionsCount(transactions.length);
        this.uiManager.updateLastUpdateTime();
    }
}