// js/finance-app.js
import { ApiClient } from './api-client.js';
import { UIManager } from './ui-manager.js';

export class FinanceApp {
    constructor() {
        console.log('💰 FinanceApp создан!');
        this.apiClient = new ApiClient();
        this.uiManager = new UIManager();
        this.currentTransactions = [];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadTransactions();
        console.log('💰 Приложение инициализировано!');
    }

    setupEventListeners() {
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

            const message = typeof result === 'string' ? result : (result.message || 'Транзакция добавлена!');
            document.getElementById('transactionForm').reset();
            this.uiManager.showAlert(message, 'success');
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

        this.applyFilter(filter);
    }

    applyFilter(filter) {
        let filteredTransactions = this.currentTransactions;

        if (filter !== 'all') {
            filteredTransactions = this.currentTransactions.filter(tx => tx.type === filter);
        }

        this.uiManager.displayTransactions(filteredTransactions);
        this.uiManager.updateBalance(filteredTransactions);
        this.uiManager.updateTransactionsCount(filteredTransactions.length);
    }

    updateUI(transactions) {
        console.log('🔄 Обновляем интерфейс, транзакций:', transactions.length);
        this.currentTransactions = transactions;

        const activeFilter = document.querySelector('[data-filter].active')?.dataset.filter || 'all';
        this.applyFilter(activeFilter);
        this.uiManager.updateLastUpdateTime();
    }
}