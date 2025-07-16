package com.ecom.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ecom.model.CartItem;
import com.ecom.model.Order;
import com.ecom.model.OrderItem;
import com.ecom.model.User;
import com.ecom.repository.CartItemRepository;
import com.ecom.repository.OrderItemRepository;
import com.ecom.repository.OrderRepository;
import com.ecom.repository.UserRepository;

import jakarta.transaction.Transactional;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/place")
    @Transactional
    public ResponseEntity<Order> placeOrder() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        User user = userRepository.findByEmail(email).orElseThrow();

        List<CartItem> cartItems = cartItemRepository.findByUser(user);
        if (cartItems.isEmpty()) {
            return ResponseEntity.badRequest().body(null);
        }

        double total = cartItems.stream()
            .mapToDouble(item -> item.getProduct().getPrice() * item.getQuantity())
            .sum();

        Order order = new Order(user, total);
        orderRepository.save(order);

        for (CartItem item : cartItems) {
            OrderItem orderItem = new OrderItem(order, item.getProduct(), item.getQuantity(), item.getProduct().getPrice());
            orderItemRepository.save(orderItem);
        }

        cartItemRepository.deleteByUser(user);

        return ResponseEntity.ok(order);
    }

    @GetMapping
    public List<Order> getUserOrders() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        User user = userRepository.findByEmail(email).orElseThrow();
        return orderRepository.findByUser(user);
    }

    @GetMapping("/by-id/{orderId}")
    public ResponseEntity<Order> getOrderById(@PathVariable Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with ID: " + orderId));
        return ResponseEntity.ok(order);
    }
}
