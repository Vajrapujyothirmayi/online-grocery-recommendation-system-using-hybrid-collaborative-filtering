package com.grocery.controllers;

import com.grocery.payload.request.ProductRequest;
import com.grocery.payload.response.MessageResponse;
import com.grocery.payload.response.ProductResponse;
import com.grocery.security.services.UserDetailsImpl;
import com.grocery.services.ProductService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RestController
@RequestMapping("/api/products")
public class ProductController {
    @Autowired
    private ProductService productService;

    @GetMapping
    public ResponseEntity<List<ProductResponse>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> getProductById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<ProductResponse>> getProductsByCategory(@PathVariable String category) {
        return ResponseEntity.ok(productService.getProductsByCategory(category));
    }

    @GetMapping("/producer/{producerId}")
    public ResponseEntity<List<ProductResponse>> getProductsByProducerId(@PathVariable Long producerId) {
        return ResponseEntity.ok(productService.getProductsByProducerId(producerId));
    }

    @PostMapping
    @PreAuthorize("hasRole('PRODUCER')")
    public ResponseEntity<ProductResponse> createProduct(@Valid @RequestBody ProductRequest productRequest) {
        Long producerId = getUserId();
        return ResponseEntity.ok(productService.createProduct(productRequest, producerId));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('PRODUCER')")
    public ResponseEntity<ProductResponse> updateProduct(@PathVariable Long id,
            @Valid @RequestBody ProductRequest productRequest) {
        Long producerId = getUserId();
        return ResponseEntity.ok(productService.updateProduct(id, productRequest, producerId));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('PRODUCER')")
    public ResponseEntity<MessageResponse> deleteProduct(@PathVariable Long id) {
        Long producerId = getUserId();
        productService.deleteProduct(id, producerId);
        return ResponseEntity.ok(new MessageResponse("Product deleted successfully!"));
    }

    private Long getUserId() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication()
                .getPrincipal();
        return userDetails.getId();
    }
}
