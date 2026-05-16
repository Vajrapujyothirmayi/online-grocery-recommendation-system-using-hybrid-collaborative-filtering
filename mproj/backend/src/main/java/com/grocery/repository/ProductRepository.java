package com.grocery.repository;

import com.grocery.models.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByCategory(String category);

    List<Product> findByProducerId(Long producerId);

    @Query("SELECT p FROM Product p " +
           "LEFT JOIN Rating r ON p.id = r.product.id " +
           "LEFT JOIN OrderItem oi ON p.id = oi.product.id " +
           "GROUP BY p.id " +
           "ORDER BY AVG(COALESCE(r.score, 0)) DESC, SUM(COALESCE(oi.quantity, 0)) DESC")
    List<Product> findTopRecommendedProducts(Pageable pageable);
}
