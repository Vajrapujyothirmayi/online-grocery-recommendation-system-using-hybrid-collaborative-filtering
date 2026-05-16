package com.grocery.recommendation;

import com.grocery.models.*;
import com.grocery.payload.request.RatingRequest;
import com.grocery.payload.response.ProductResponse;
import com.grocery.payload.response.RatingResponse;
import com.grocery.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class HybridRecommendationService {

    @Autowired private SimilarityService similarityService;
    @Autowired private MatrixService matrixService;
    @Autowired private ProductRepository productRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private RatingRepository ratingRepository;
    @Autowired private ProductSimilarityRepository similarityRepository;

    private static final double ALPHA = 0.7; // Collaborative weight
    
    public RatingResponse addOrUpdateRating(Long userId, RatingRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Rating rating = ratingRepository.findByUserIdAndProductId(userId, request.getProductId())
                .orElse(new Rating());

        rating.setUser(user);
        rating.setProduct(product);
        rating.setScore(request.getScore());
        
        if (product.getProducer() != null) {
            rating.setProducerName(product.getProducer().getUsername());
        } else {
            rating.setProducerName("Unknown");
        }

        Rating savedRating = ratingRepository.save(rating);
        return new RatingResponse(savedRating);
    }

    public List<ProductResponse> getRecommendationsForUser(Long userId) {
        List<Rating> userRatings = matrixService.getUserRatings(userId);
        List<OrderItem> userPurchases = matrixService.getUserPurchaseHistory(userId);

        if (userRatings.isEmpty() && userPurchases.isEmpty()) {
            return getPopularProductsFallback();
        }

        Set<Long> interactedProductIds = new HashSet<>();
        userRatings.forEach(rating -> interactedProductIds.add(rating.getProduct().getId()));
        userPurchases.forEach(purchase -> interactedProductIds.add(purchase.getProduct().getId()));

        Map<Long, Double> finalScores = new HashMap<>();

        for (Rating rating : userRatings) {
            Long productId = rating.getProduct().getId();
            List<ProductSimilarity> similarities = similarityRepository.findHighlySimilarProducts(productId);
            
            for (ProductSimilarity sim : similarities) {
                Long similarProductId = sim.getProductA().getId().equals(productId) ?
                    sim.getProductB().getId() : sim.getProductA().getId();

                if (!interactedProductIds.contains(similarProductId)) {
                    double collaborativeScore = sim.getSimilarityScore() * rating.getScore();
                    double contentScore = similarityService.calculateContentSimilarity(
                            rating.getProduct(), productRepository.findById(similarProductId).orElse(null));

                    double finalScore = (ALPHA * collaborativeScore) + ((1 - ALPHA) * contentScore);

                    finalScores.put(similarProductId, 
                        finalScores.getOrDefault(similarProductId, 0.0) + finalScore);
                }
            }
        }

        // Padding with popular items if few recommendations
        List<Long> recommendedIds = finalScores.entrySet().stream()
                .sorted(Map.Entry.<Long, Double>comparingByValue().reversed())
                .map(Map.Entry::getKey)
                .collect(Collectors.toList());

        List<Product> topPopular = productRepository.findTopRecommendedProducts(PageRequest.of(0, 10));
        for (Product p : topPopular) {
            if (recommendedIds.size() >= 5) break; 
            if (!interactedProductIds.contains(p.getId()) && !recommendedIds.contains(p.getId())) {
                recommendedIds.add(p.getId());
            }
        }
        
        if (recommendedIds.size() > 5) {
            recommendedIds = recommendedIds.subList(0, 5);
        }

        List<Product> products = productRepository.findAllById(recommendedIds);
        return products.stream().map(ProductResponse::new).collect(Collectors.toList());
    }

    public void calculateProductSimilarities() {
        List<Product> allProducts = productRepository.findAll();
        List<User> allUsers = userRepository.findAll();

        for (int i = 0; i < allProducts.size(); i++) {
            for (int j = i + 1; j < allProducts.size(); j++) {
                Product pA = allProducts.get(i);
                Product pB = allProducts.get(j);

                double collabSim = similarityService.calculateCollaborativeSimilarity(pA, pB, allUsers, matrixService);
                double contentSim = similarityService.calculateContentSimilarity(pA, pB);
                
                double hybridSim = (ALPHA * collabSim) + ((1 - ALPHA) * contentSim);

                if (hybridSim > 0) {
                    ProductSimilarity simEntity = similarityRepository.findByProductAIdAndProductBId(pA.getId(), pB.getId());
                    if (simEntity == null) simEntity = similarityRepository.findByProductAIdAndProductBId(pB.getId(), pA.getId());
                    if (simEntity == null) {
                        simEntity = new ProductSimilarity();
                        simEntity.setProductA(pA);
                        simEntity.setProductB(pB);
                    }
                    simEntity.setProductAName(pA.getName());
                    simEntity.setProductBName(pB.getName());
                    simEntity.setSimilarityScore(hybridSim);
                    simEntity.setLastUpdated(LocalDateTime.now());
                    similarityRepository.save(simEntity);
                }
            }
        }
    }
    
    private List<ProductResponse> getPopularProductsFallback() {
        return productRepository.findTopRecommendedProducts(PageRequest.of(0, 5)).stream()
                .map(ProductResponse::new)
                .collect(Collectors.toList());
    }
}
