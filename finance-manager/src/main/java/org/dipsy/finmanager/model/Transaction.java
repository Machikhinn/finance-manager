package org.dipsy.finmanager.model;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Transaction {
    private Long id;
    private double amount;
    private TransactionType type;
    private Category category;
    private LocalDateTime date;
    private String description;
}