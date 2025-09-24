// js/ui-manager.js
export class UIManager {
    // В метод displayTransactions добавь анимацию
    displayTransactions(transactions) {
        const container = document.getElementById('transactionsList');

        if (transactions.length === 0) {
            container.innerHTML = '<p class="text-muted text-center fade-in-up">Нет транзакций</p>';
            return;
        }

        const html = `
            <table class="table table-hover">
                <thead>
                    <tr>
                        <th>Дата</th>
                        <th>Тип</th>
                        <th>Категория</th>
                        <th>Описание</th>
                        <th class="text-end">Сумма</th>
                    </tr>
                </thead>
                <tbody>
                    ${transactions.map((tx, index) => `
                        <tr class="${tx.type === 'INCOME' ? 'transaction-income' : 'transaction-expense'} fade-in-up"
                             style="animation-delay: ${index * 0.1}s">
                            <td data-depth="0.5">${new Date(tx.date).toLocaleDateString('ru-RU')}<br>
                                <small class="text-muted">${new Date(tx.date).toLocaleTimeString('ru-RU')}</small>
                            </td>
                            <td data-depth="1">
                                <span class="badge ${tx.type === 'INCOME' ? 'bg-success' : 'bg-danger'}">
                                    ${tx.type === 'INCOME' ? '📈 Доход' : '📉 Расход'}
                                </span>
                            </td>
                            <td data-depth="1.5">${tx.category.name}</td>
                            <td data-depth="2">${tx.description}</td>
                            <td class="text-end ${tx.type === 'INCOME' ? 'text-success' : 'text-danger'} fw-bold" data-depth="2.5">
                                ${tx.type === 'INCOME' ? '+' : '-'}${tx.amount} руб.
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;

        container.innerHTML = html;

        // Добавляем анимацию для таблицы
        setTimeout(() => {
            const rows = container.querySelectorAll('tr');
            rows.forEach((row, index) => {
                row.style.animationDelay = `${index * 0.1}s`;
                row.classList.add('fade-in-up');
            });
        }, 100);
    }

    updateBalance(transactions) {
        const balance = transactions.reduce((total, tx) => {
            return tx.type === 'INCOME' ? total + tx.amount : total - tx.amount;
        }, 0);

        const balanceElement = document.getElementById('balance');
        balanceElement.textContent = `${balance.toFixed(2)} руб.`;
        balanceElement.className = `fw-bold ${balance >= 0 ? 'balance-positive' : 'balance-negative'}`;
    }

    updateTransactionsCount(count) {
        document.getElementById('transactionsCount').textContent =
            `${count} ${this.declension(count, ['транзакция', 'транзакции', 'транзакций'])}`;
    }

    updateLastUpdateTime() {
        document.getElementById('lastUpdate').textContent =
            new Date().toLocaleTimeString('ru-RU');
    }

    declension(number, titles) {
        const cases = [2, 0, 1, 1, 1, 2];
        return titles[
            (number % 100 > 4 && number % 100 < 20)
                ? 2
                : cases[(number % 10 < 5) ? number % 10 : 5]
        ];
    }

    showAlert(message, type) {
        // Временное решение - обычный alert
        alert(message);
    }

    showResetModal() {
        const modal = new bootstrap.Modal(document.getElementById('resetModal'));
        modal.show();
    }

    hideResetModal() {
        const modal = bootstrap.Modal.getInstance(document.getElementById('resetModal'));
        if (modal) modal.hide();
    }
}