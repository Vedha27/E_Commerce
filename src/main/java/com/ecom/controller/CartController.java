package com.ecom.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ecom.model.CartItem;
import com.ecom.model.Product;
import com.ecom.model.User;
import com.ecom.repository.CartItemRepository;
import com.ecom.repository.ProductRepository;
import com.ecom.repository.UserRepository;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartItemRepository cartItemRepo;

    @Autowired
    private ProductRepository productRepo;

    @Autowired
    private UserRepository userRepo;

    @PostMapping("/add")
    public ResponseEntity<?> addToCart(
        @RequestParam Long productId,
        @RequestParam int quantity
    ) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName(); 
        User user = userRepo.findByEmail(email).orElseThrow();

        Product product = productRepo.findById(productId).orElseThrow();

        CartItem existing = cartItemRepo.findByUserAndProduct(user, product);
        if (existing != null) {
            existing.setQuantity(existing.getQuantity() + quantity);
            return ResponseEntity.ok(cartItemRepo.save(existing));
        }

        CartItem newItem = new CartItem(user, product, quantity);
        return ResponseEntity.ok(cartItemRepo.save(newItem));
    }


    @GetMapping("/view")
    public ResponseEntity<List<CartItem>> viewCart() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        User user = userRepo.findByEmail(email).orElseThrow();

        List<CartItem> items = cartItemRepo.findByUser(user);
        return ResponseEntity.ok(items);
    }


    @DeleteMapping("/clear")
    public void clearCart(Authentication auth) {
        User user = userRepo.findByEmail(auth.getName()).orElseThrow();
        cartItemRepo.deleteByUser(user);
    }
}
