package com.grocery.payload.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Data;

@Data
public class ProductRequest {
    @NotBlank
    private String name;

    private String description;

    @NotNull
    @PositiveOrZero
    private Double price;

    @NotBlank
    private String category;

    private String imageUrl;

    @NotNull
    @PositiveOrZero
    private Integer availableQuantity;
}
