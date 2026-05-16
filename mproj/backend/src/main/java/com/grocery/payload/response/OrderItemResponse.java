package com.grocery.payload.response;

import lombok.Data;
import lombok.NoArgsConstructor;
import com.grocery.models.OrderItem;

@Data
@NoArgsConstructor
public class OrderItemResponse {
    private Long id;
    private Long productId;
    private String productName;
    private Double priceAtPurchase;
    private Integer quantity;

    public OrderItemResponse(OrderItem orderItem) {
        this.id = orderItem.getId();
        this.productId = orderItem.getProduct().getId();
        this.productName = orderItem.getProductName();
        this.priceAtPurchase = orderItem.getPriceAtPurchase();
        this.quantity = orderItem.getQuantity();
    }
}
