package org.dipsy.finmanager.service;

import org.dipsy.finmanager.model.Transaction;
import org.dipsy.finmanager.model.TransactionType;
import org.dipsy.finmanager.storage.InMemoryStorage;

import java.util.List;

public class FinanceService {

    private final InMemoryStorage storage = new InMemoryStorage();

    public void addTransaction(double amount, TransactionType type, String categoryName, String description) {
        storage.addTransaction(amount, type, categoryName, description);
    }

    public List<Transaction> getAllTransactions() {
        return storage.getAllTransactions();
    }

    public double getCurrentBalance() {
        return storage.getAllTransactions().stream()
                .mapToDouble(transaction ->
                        transaction.getType() == TransactionType.INCOME
                                ? transaction.getAmount()
                                : -transaction.getAmount())
                .sum();
    }

    public void resetTransactions() {
        storage.resetTransactions();
    }
}