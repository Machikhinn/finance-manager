// js/3d-effects.js
export class ThreeDEffects {
    constructor() {
        this.cards = document.querySelectorAll('.card');
        this.sensitivity = 0.5; // 👈 Увеличил чувствительность по умолчанию
        this.maxRotation = 5;
        this.init();
    }

    init() {
        console.log('🎮 Инициализируем 3D эффекты для', this.cards.length, 'карточек');

        this.cards.forEach(card => {
            this.add3DEffect(card);
        });

        this.observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1 && node.classList.contains('card')) {
                        this.add3DEffect(node);
                    }
                });
            });
        });

        this.observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    add3DEffect(card) {
        console.log('➕ Добавляем 3D эффект к карточке');

        card.addEventListener('mousemove', (e) => {
            if (window.innerWidth < 768) return;

            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateY = ((x - centerX) / centerX) * this.maxRotation * this.sensitivity;
            const rotateX = ((centerY - y) / centerY) * this.maxRotation * this.sensitivity;

            card.style.transform = `
                perspective(1000px)
                rotateX(${rotateX}deg)
                rotateY(${rotateY}deg)
                translateZ(5px)
            `;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transition = 'transform 0.5s ease';
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';

            setTimeout(() => {
                card.style.transition = '';
            }, 500);
        });
    }

    setSensitivity(value) {
        this.sensitivity = Math.max(0.1, Math.min(1.0, value));
        console.log('🎮 Чувствительность изменена на:', this.sensitivity);
    }

    destroy() {
        if (this.observer) {
            this.observer.disconnect();
        }
    }
}