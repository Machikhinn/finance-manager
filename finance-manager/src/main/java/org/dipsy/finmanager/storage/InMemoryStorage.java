package org.dipsy.finmanager.storage;

import org.dipsy.finmanager.model.Category;
import org.dipsy.finmanager.model.Transaction;
import org.dipsy.finmanager.model.TransactionType;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicLong;

public class InMemoryStorage {

    private final List<Transaction> transactions = new ArrayList<>();
    private final AtomicLong transactionIdCounter = new AtomicLong(1);
    private final AtomicLong categoryIdCounter = new AtomicLong(1);

    public void addTransaction(double amount, TransactionType type, String categoryName, String description) {
        long id = transactionIdCounter.getAndIncrement();
        Category category = new Category(categoryIdCounter.getAndIncrement(), categoryName);
        Transaction transaction = new Transaction(id, amount, type, category, LocalDateTime.now(), description);
        transactions.add(transaction);
    }

    public List<Transaction> getAllTransactions() {
        return new ArrayList<>(transactions);
    }

    public void resetTransactions() {
        transactions.clear();
        transactionIdCounter.set(1);
        categoryIdCounter.set(1);
    }
}