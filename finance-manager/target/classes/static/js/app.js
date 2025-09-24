// js/app.js
import { FinanceApp } from './finance-app.js';
import { initParticles } from './particles-config.js';
import { ThreeDEffects } from './3d-effects.js';

let threeDEffects;

document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Запускаем финансовое приложение...');

    // Инициализируем частицы
    initParticles();

    // Инициализируем 3D эффекты
    threeDEffects = new ThreeDEffects();
    console.log('🎮 3D эффекты инициализированы');

    // Настройка слайдера чувствительности
    const slider = document.getElementById('sensitivitySlider');
    const sensitivityValue = document.getElementById('sensitivityValue');
    const reset3DBtn = document.getElementById('reset3DSettings');

    if (slider && sensitivityValue) {
        // Обновляем значение при изменении
        slider.addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            sensitivityValue.textContent = value.toFixed(1);
            threeDEffects.setSensitivity(value);
        });

        // Кнопка сброса
        if (reset3DBtn) {
            reset3DBtn.addEventListener('click', () => {
                slider.value = 0.5;
                sensitivityValue.textContent = '0.5';
                threeDEffects.setSensitivity(0.5);
            });
        }
    }

    // Запускаем основное приложение
    new FinanceApp();
});