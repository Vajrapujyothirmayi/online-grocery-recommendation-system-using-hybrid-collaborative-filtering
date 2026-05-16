package com.grocery.repository;

import com.grocery.models.ProductSimilarity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProductSimilarityRepository extends JpaRepository<ProductSimilarity, Long> {

    @Query("SELECT p FROM ProductSimilarity p WHERE p.productA.id = :productId OR p.productB.id = :productId ORDER BY p.similarityScore DESC")
    List<ProductSimilarity> findHighlySimilarProducts(@Param("productId") Long productId);

    @Query("SELECT p FROM ProductSimilarity p WHERE (p.productA.id = :productId OR p.productB.id = :productId) AND p.similarityScore >= :minSimilarity ORDER BY p.similarityScore DESC")
    List<ProductSimilarity> findHighlySimilarProductsWithMinSimilarity(@Param("productId") Long productId, @Param("minSimilarity") Double minSimilarity);

    ProductSimilarity findByProductAIdAndProductBId(Long productAId, Long productBId);
}
