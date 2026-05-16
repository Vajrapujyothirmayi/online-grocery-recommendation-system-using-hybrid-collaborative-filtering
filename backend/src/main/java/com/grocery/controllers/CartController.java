package com.grocery.controllers;

import com.grocery.payload.request.CartItemRequest;
import com.grocery.payload.response.CartResponse;
import com.grocery.payload.response.MessageResponse;
import com.grocery.security.services.UserDetailsImpl;
import com.grocery.services.CartService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RestController
@RequestMapping("/api/cart")
public class CartController {
    @Autowired
    private CartService cartService;

    @GetMapping
    @PreAuthorize("hasRole('CONSUMER') or hasRole('PRODUCER')")
    public ResponseEntity<CartResponse> getCart() {
        Long userId = getUserId();
        return ResponseEntity.ok(cartService.getCartByUserId(userId));
    }

    @PostMapping({"/items", "/add"})
    @PreAuthorize("hasRole('CONSUMER') or hasRole('PRODUCER')")
    public ResponseEntity<CartResponse> addItemToCart(@Valid @RequestBody CartItemRequest request) {
        Long userId = getUserId();
        return ResponseEntity.ok(cartService.addItemToCart(userId, request));
    }

    @PutMapping("/items/{itemId}")
    @PreAuthorize("hasRole('CONSUMER') or hasRole('PRODUCER')")
    public ResponseEntity<CartResponse> updateItemQuantity(@PathVariable Long itemId, @RequestParam Integer quantity) {
        Long userId = getUserId();
        return ResponseEntity.ok(cartService.updateItemQuantity(userId, itemId, quantity));
    }

    @DeleteMapping("/items/{itemId}")
    @PreAuthorize("hasRole('CONSUMER') or hasRole('PRODUCER')")
    public ResponseEntity<CartResponse> removeItemFromCart(@PathVariable Long itemId) {
        Long userId = getUserId();
        return ResponseEntity.ok(cartService.removeItemFromCart(userId, itemId));
    }

    @DeleteMapping
    @PreAuthorize("hasRole('CONSUMER') or hasRole('PRODUCER')")
    public ResponseEntity<MessageResponse> clearCart() {
        Long userId = getUserId();
        cartService.clearCart(userId);
        return ResponseEntity.ok(new MessageResponse("Cart cleared successfully!"));
    }

    private Long getUserId() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication()
                .getPrincipal();
        return userDetails.getId();
    }
}
