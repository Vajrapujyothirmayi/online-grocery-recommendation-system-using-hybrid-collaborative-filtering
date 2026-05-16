package com.grocery.payload.response;

import lombok.Data;
import lombok.NoArgsConstructor;
import com.grocery.models.Product;

@Data
@NoArgsConstructor
public class ProductResponse {
    private Long id;
    private String name;
    private String description;
    private Double price;
    private String category;
    private String imageUrl;
    private Integer availableQuantity;
    private Long producerId;
    private String producerName;

    public ProductResponse(Product product) {
        this.id = product.getId();
        this.name = product.getName();
        this.description = product.getDescription();
        this.price = product.getPrice();
        this.category = product.getCategory();
        this.imageUrl = product.getImageUrl();
        this.availableQuantity = product.getAvailableQuantity();
        if (product.getProducer() != null) {
            this.producerId = product.getProducer().getId();
            this.producerName = product.getProducer().getUsername();
        }
    }
}
