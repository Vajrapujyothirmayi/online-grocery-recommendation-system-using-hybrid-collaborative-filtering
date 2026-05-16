package com.grocery.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "product_similarity")
@Data
@NoArgsConstructor
public class ProductSimilarity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_a_id")
    private Product productA;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_b_id")
    private Product productB;

    private String productAName;
    private String productBName;

    private Double similarityScore;

    private LocalDateTime lastUpdated;
}
