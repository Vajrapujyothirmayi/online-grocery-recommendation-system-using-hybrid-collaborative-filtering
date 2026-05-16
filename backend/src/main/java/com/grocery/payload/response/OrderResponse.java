package com.grocery.payload.response;

import lombok.Data;
import lombok.NoArgsConstructor;
import com.grocery.models.Order;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
public class OrderResponse {
    private Long id;
    private LocalDateTime orderDate;
    private Double totalAmount;
    private List<OrderItemResponse> items;

    public OrderResponse(Order order) {
        this.id = order.getId();
        this.orderDate = order.getOrderDate();
        this.totalAmount = order.getTotalAmount();
        this.items = order.getItems().stream()
                .map(OrderItemResponse::new)
                .collect(Collectors.toList());
    }
}
