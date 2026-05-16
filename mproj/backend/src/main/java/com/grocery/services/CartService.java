package com.grocery.services;

import com.grocery.models.Cart;
import com.grocery.models.CartItem;
import com.grocery.models.Product;
import com.grocery.models.User;
import com.grocery.payload.request.CartItemRequest;
import com.grocery.payload.response.CartResponse;
import com.grocery.repository.CartRepository;
import com.grocery.repository.ProductRepository;
import com.grocery.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CartService {
    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    public CartResponse getCartByUserId(Long userId) {
        Cart cart = getOrCreateCart(userId);
        return new CartResponse(cart);
    }

    public CartResponse addItemToCart(Long userId, CartItemRequest request) {
        Cart cart = getOrCreateCart(userId);
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (request.getQuantity() > product.getAvailableQuantity()) {
            throw new RuntimeException("Not enough stock for product: " + product.getName());
        }

        Optional<CartItem> existingItem = cart.getItems().stream()
                .filter(item -> item.getProduct().getId().equals(product.getId()))
                .findFirst();

        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            if (item.getQuantity() + request.getQuantity() > product.getAvailableQuantity()) {
                throw new RuntimeException("Adding this quantity exceeds available stock for: " + product.getName());
            }
            item.setQuantity(item.getQuantity() + request.getQuantity());
        } else {
            CartItem newItem = new CartItem();
            newItem.setCart(cart);
            newItem.setProduct(product);
            newItem.setProductName(product.getName());
            newItem.setUnitPrice(product.getPrice());
            newItem.setQuantity(request.getQuantity());
            newItem.setTotalPrice(product.getPrice() * request.getQuantity());
            cart.getItems().add(newItem);
        }

        updateCartTotals(cart);
        Cart updatedCart = cartRepository.save(cart);
        return new CartResponse(updatedCart);
    }

    public CartResponse updateItemQuantity(Long userId, Long itemId, Integer quantity) {
        Cart cart = getOrCreateCart(userId);

        CartItem item = cart.getItems().stream()
                .filter(i -> i.getId().equals(itemId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Item not found in cart"));

        if (quantity <= 0) {
            cart.getItems().remove(item);
        } else {
            if (quantity > item.getProduct().getAvailableQuantity()) {
                throw new RuntimeException("Quantity exceeds available stock for: " + item.getProduct().getName());
            }
            item.setQuantity(quantity);
        }

        updateCartTotals(cart);
        Cart updatedCart = cartRepository.save(cart);
        return new CartResponse(updatedCart);
    }

    public CartResponse removeItemFromCart(Long userId, Long itemId) {
        Cart cart = getOrCreateCart(userId);

        cart.getItems().removeIf(item -> item.getId().equals(itemId));

        updateCartTotals(cart);
        Cart updatedCart = cartRepository.save(cart);
        return new CartResponse(updatedCart);
    }

    public void clearCart(Long userId) {
        Cart cart = getOrCreateCart(userId);
        cart.getItems().clear();
        updateCartTotals(cart);
        cartRepository.save(cart);
    }

    private void updateCartTotals(Cart cart) {
        double total = 0.0;
        int itemsCount = 0;
        for (CartItem item : cart.getItems()) {
            if (item.getUnitPrice() == null && item.getProduct() != null) {
                item.setUnitPrice(item.getProduct().getPrice());
            }
            if (item.getProductName() == null && item.getProduct() != null) {
                item.setProductName(item.getProduct().getName());
            }
            if (item.getUnitPrice() != null) {
                item.setTotalPrice(item.getUnitPrice() * item.getQuantity());
                total += item.getTotalPrice();
            }
            itemsCount += item.getQuantity();
        }
        cart.setTotalPrice(total);
        cart.setTotalItems(itemsCount);
    }

    private Cart getOrCreateCart(Long userId) {
        return cartRepository.findByUserId(userId).orElseGet(() -> {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            Cart newCart = new Cart();
            newCart.setUser(user);
            return cartRepository.save(newCart);
        });
    }
}
