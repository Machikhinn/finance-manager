// js/api-client.js
export class ApiClient {
    constructor() {
        this.baseURL = window.location.origin;
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                ...options.headers
            },
            ...options
        };

        try {
            const response = await fetch(url, config);
            console.log(`📡 Response status: ${response.status} for ${endpoint}`);

            // Сначала получаем текст ответа
            const responseText = await response.text();
            console.log(`📡 Response text: ${responseText}`);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${responseText}`);
            }

            // Пытаемся распарсить как JSON, если не получается - возвращаем текст
            try {
                return JSON.parse(responseText);
            } catch (e) {
                return responseText; // Возвращаем текст если это не JSON
            }
        } catch (error) {
            console.error(`API Error [${endpoint}]:`, error);
            throw error;
        }
    }

    async getTransactions() {
        const result = await this.request('/transactions');
        // Для GET /transactions всегда ожидаем JSON с транзакциями
        if (typeof result === 'string') {
            throw new Error('Сервер вернул текст вместо JSON');
        }
        return result;
    }

    async addTransaction(data) {
        const params = new URLSearchParams(data);
        const result = await this.request('/transactions', {
            method: 'POST',
            body: params
        });

        // Для POST можем получить как JSON, так и текст
        return result;
    }

    async resetTransactions() {
        const result = await this.request('/reset', {
            method: 'DELETE'
        });

        // Для DELETE можем получить как JSON, так и текст
        return result;
    }
}