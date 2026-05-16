package com.grocery.recommendation;

import com.grocery.models.*;
import com.grocery.repository.OrderItemRepository;
import com.grocery.repository.RatingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MatrixService {
    @Autowired
    private RatingRepository ratingRepository;
    
    @Autowired
    private OrderItemRepository orderItemRepository;

    public List<Rating> getUserRatings(Long userId) {
        return ratingRepository.findByUserId(userId);
    }
    
    public List<OrderItem> getUserPurchaseHistory(Long userId) {
        return orderItemRepository.findByUserId(userId);
    }
    
    public double getUserProductRatingScore(Long userId, Long productId) {
        Optional<Rating> rating = ratingRepository.findByUserIdAndProductId(userId, productId);
        return rating.map(Rating::getScore).orElse(0);
    }
}
