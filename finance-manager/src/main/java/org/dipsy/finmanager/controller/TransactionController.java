package org.dipsy.finmanager.controller;

import org.dipsy.finmanager.model.Transaction;
import org.dipsy.finmanager.model.TransactionType;
import org.dipsy.finmanager.service.FinanceService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class TransactionController {

    private final FinanceService financeService;

    public TransactionController() {
        this.financeService = new FinanceService();
        addTestData();
    }

    private void addTestData() {
        financeService.addTransaction(50000.0, TransactionType.INCOME, "Зарплата", "Зарплата за октябрь");
        financeService.addTransaction(1500.5, TransactionType.EXPENSE, "Еда", "Обед в кафе");
        financeService.addTransaction(3000.0, TransactionType.EXPENSE, "Развлечения", "Поход в кино");
    }


    @GetMapping("/transactions")
    public List<Transaction> getTransactions() {
        return financeService.getAllTransactions();
    }

    @GetMapping("/balance")
    public String getBalance() {
        double balance = financeService.getCurrentBalance();
        return "💰 Текущий баланс: " + balance + " руб.";
    }

    @PostMapping("/transactions")
    public ResponseEntity<String> addTransaction(@RequestParam("amount") double amount,
                                                 @RequestParam("type") String typeStr,
                                                 @RequestParam("category") String category,
                                                 @RequestParam("description") String description) {
        try {
            System.out.println("Получены параметры: " + amount + ", " + typeStr + ", " + category + ", " + description);

            // Преобразуем строку в TransactionType
            TransactionType type;
            try {
                type = TransactionType.valueOf(typeStr.toUpperCase());
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest().body("❌ Неверный тип транзакции. Используйте: INCOME или EXPENSE");
            }

            financeService.addTransaction(amount, type, category, description);
            return ResponseEntity.ok("✅ Транзакция добавлена!");
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body("❌ Неверный формат суммы: " + amount);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("❌ Ошибка: " + e.getMessage());
        }
    }

    @DeleteMapping("/reset")
    public ResponseEntity<String> resetTransactions() {
        try {
            // Здесь нужно добавить метод reset в FinanceService
            financeService.resetTransactions();
            return ResponseEntity.ok("✅ Все транзакции сброшены!");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("❌ Ошибка при сбросе транзакций: " + e.getMessage());
        }
    }
}