package com.grocery.payload.response;

import lombok.Data;
import lombok.NoArgsConstructor;
import com.grocery.models.CartItem;

@Data
@NoArgsConstructor
public class CartItemResponse {
    private Long id;
    private Long productId;
    private String productName;
    private Double price;
    private Integer quantity;

    public CartItemResponse(CartItem cartItem) {
        this.id = cartItem.getId();
        this.productId = cartItem.getProduct().getId();
        this.productName = cartItem.getProductName();
        this.price = cartItem.getUnitPrice();
        this.quantity = cartItem.getQuantity();
    }
}
