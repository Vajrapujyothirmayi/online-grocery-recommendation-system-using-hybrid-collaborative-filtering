package com.grocery.payload.response;

import lombok.Data;
import lombok.NoArgsConstructor;
import com.grocery.models.Cart;

import java.util.List;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
public class CartResponse {
    private Long id;
    private List<CartItemResponse> items;
    private Double totalAmount;

    public CartResponse(Cart cart) {
        this.id = cart.getId();
        this.items = cart.getItems().stream()
                .map(CartItemResponse::new)
                .collect(Collectors.toList());
        this.totalAmount = cart.getItems().stream()
                .mapToDouble(item -> item.getProduct().getPrice() * item.getQuantity())
                .sum();
    }
}
