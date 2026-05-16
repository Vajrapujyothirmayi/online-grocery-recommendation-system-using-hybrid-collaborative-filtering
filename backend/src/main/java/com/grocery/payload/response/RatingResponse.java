package com.grocery.payload.response;

import lombok.Data;
import lombok.NoArgsConstructor;
import com.grocery.models.Rating;

@Data
@NoArgsConstructor
public class RatingResponse {
    private Long id;
    private Long productId;
    private Long userId;
    private String producerName;
    private Integer score;

    public RatingResponse(Rating rating) {
        this.id = rating.getId();
        this.productId = rating.getProduct().getId();
        this.userId = rating.getUser().getId();
        this.producerName = rating.getProducerName();
        this.score = rating.getScore();
    }
}
