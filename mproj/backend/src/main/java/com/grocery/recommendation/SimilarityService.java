package com.grocery.recommendation;

import com.grocery.models.*;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class SimilarityService {

    public double calculateCollaborativeSimilarity(Product pA, Product pB, List<User> allUsers, MatrixService matrixService) {
        double dotProduct = 0.0;
        double normA = 0.0;
        double normB = 0.0;

        for (User user : allUsers) {
            double scoreA = matrixService.getUserProductRatingScore(user.getId(), pA.getId());
            double scoreB = matrixService.getUserProductRatingScore(user.getId(), pB.getId());

            dotProduct += scoreA * scoreB;
            normA += Math.pow(scoreA, 2);
            normB += Math.pow(scoreB, 2);
        }

        if (normA == 0.0 || normB == 0.0) return 0.0;
        return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
    }

    public double calculateContentSimilarity(Product pA, Product pB) {
        if (pA == null || pB == null) return 0.0;

        double similarity = 0.0;
        int features = 0;

        // Category similarity
        if (pA.getCategory() != null && pB.getCategory() != null) {
            similarity += pA.getCategory().equals(pB.getCategory()) ? 1.0 : 0.0;
            features++;
        }

        // Price similarity
        if (pA.getPrice() != null && pB.getPrice() != null && pA.getPrice() > 0 && pB.getPrice() > 0) {
            double priceDiff = Math.abs(pA.getPrice() - pB.getPrice());
            double avgPrice = (pA.getPrice() + pB.getPrice()) / 2.0;
            double priceSimilarity = avgPrice > 0 ? Math.max(0.0, 1.0 - (priceDiff / avgPrice)) : 0.0;
            similarity += priceSimilarity;
            features++;
        }

        // Description similarity
        if (pA.getDescription() != null && pB.getDescription() != null) {
            String descA = pA.getDescription().toLowerCase();
            String descB = pB.getDescription().toLowerCase();
            Set<String> wordsA = new HashSet<>(Arrays.asList(descA.split("\\s+")));
            Set<String> wordsB = new HashSet<>(Arrays.asList(descB.split("\\s+")));
            Set<String> intersection = new HashSet<>(wordsA);
            intersection.retainAll(wordsB);
            Set<String> union = new HashSet<>(wordsA);
            union.addAll(wordsB);
            double descSimilarity = union.isEmpty() ? 0.0 : (double) intersection.size() / union.size();
            similarity += descSimilarity;
            features++;
        }

        return features > 0 ? similarity / features : 0.0;
    }
}
