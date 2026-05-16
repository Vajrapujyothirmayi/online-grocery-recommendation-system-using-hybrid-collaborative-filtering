package com.grocery.services;

import com.grocery.models.Product;
import com.grocery.models.User;
import com.grocery.payload.request.ProductRequest;
import com.grocery.payload.response.ProductResponse;
import com.grocery.repository.ProductRepository;
import com.grocery.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductService {
    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    public List<ProductResponse> getAllProducts() {
        return productRepository.findAll().stream()
                .map(ProductResponse::new)
                .collect(Collectors.toList());
    }

    public ProductResponse getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        return new ProductResponse(product);
    }

    public List<ProductResponse> getProductsByCategory(String category) {
        return productRepository.findByCategory(category).stream()
                .map(ProductResponse::new)
                .collect(Collectors.toList());
    }

    public List<ProductResponse> getProductsByProducerId(Long producerId) {
        return productRepository.findByProducerId(producerId).stream()
                .map(ProductResponse::new)
                .collect(Collectors.toList());
    }

    public ProductResponse createProduct(ProductRequest request, Long producerId) {
        User producer = userRepository.findById(producerId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Product product = new Product();
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setCategory(request.getCategory());
        product.setImageUrl(request.getImageUrl());
        product.setAvailableQuantity(request.getAvailableQuantity());
        product.setProducer(producer);

        Product savedProduct = productRepository.save(product);
        return new ProductResponse(savedProduct);
    }

    public ProductResponse updateProduct(Long id, ProductRequest request, Long producerId) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (!product.getProducer().getId().equals(producerId)) {
            throw new RuntimeException("You do not have permission to update this product");
        }

        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setCategory(request.getCategory());
        product.setImageUrl(request.getImageUrl());
        product.setAvailableQuantity(request.getAvailableQuantity());

        Product updatedProduct = productRepository.save(product);
        return new ProductResponse(updatedProduct);
    }

    public void deleteProduct(Long id, Long producerId) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (!product.getProducer().getId().equals(producerId)) {
            throw new RuntimeException("You do not have permission to delete this product");
        }

        productRepository.delete(product);
    }
}
