package com.grocery.controllers;

import com.grocery.payload.response.OrderResponse;
import com.grocery.security.services.UserDetailsImpl;
import com.grocery.services.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RestController
@RequestMapping("/api/orders")
public class OrderController {
    @Autowired
    private OrderService orderService;

    @GetMapping
    @PreAuthorize("hasRole('CONSUMER') or hasRole('PRODUCER')")
    public ResponseEntity<List<OrderResponse>> getOrders() {
        Long userId = getUserId();
        return ResponseEntity.ok(orderService.getOrdersByUserId(userId));
    }

    @PostMapping("/checkout")
    @PreAuthorize("hasRole('CONSUMER') or hasRole('PRODUCER')")
    public ResponseEntity<OrderResponse> checkout() {
        Long userId = getUserId();
        return ResponseEntity.ok(orderService.checkout(userId));
    }

    private Long getUserId() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication()
                .getPrincipal();
        return userDetails.getId();
    }
}
