package com.grocery.controllers;

import com.grocery.payload.request.RatingRequest;
import com.grocery.payload.response.MessageResponse;
import com.grocery.payload.response.ProductResponse;
import com.grocery.payload.response.RatingResponse;
import com.grocery.security.services.UserDetailsImpl;
import com.grocery.recommendation.HybridRecommendationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RestController
@RequestMapping("/api/recommendations")
public class RecommendationController {

    @Autowired
    private HybridRecommendationService recommendationService;

    @PostMapping("/rate")
    @PreAuthorize("hasRole('CONSUMER') or hasRole('PRODUCER')")
    public ResponseEntity<RatingResponse> rateProduct(@Valid @RequestBody RatingRequest request) {
        Long userId = getUserId();
        return ResponseEntity.ok(recommendationService.addOrUpdateRating(userId, request));
    }

    @GetMapping
    @PreAuthorize("hasRole('CONSUMER') or hasRole('PRODUCER')")
    public ResponseEntity<List<ProductResponse>> getRecommendations() {
        Long userId = getUserId();
        return ResponseEntity.ok(recommendationService.getRecommendationsForUser(userId));
    }

    @PostMapping("/calculate-similarities")
    @PreAuthorize("hasRole('PRODUCER')") // In real app, only ADMIN should trigger this
    public ResponseEntity<MessageResponse> calculateSimilarities() {
        recommendationService.calculateProductSimilarities();
        return ResponseEntity.ok(new MessageResponse("Similarities calculation triggered successfully"));
    }

    private Long getUserId() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication()
                .getPrincipal();
        return userDetails.getId();
    }
}
