// js/app.js
console.log('💰 Модуль app.js загружен!');

import { FinanceApp } from './finance-app.js';

document.addEventListener('DOMContentLoaded', () => {
    console.log('💰 DOM готов, запускаем FinanceApp...');
    new FinanceApp();
});