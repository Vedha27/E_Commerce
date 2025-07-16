package com.ecom.controller;

import com.ecom.model.Order;
import com.ecom.model.OrderItem;
import com.ecom.repository.OrderItemRepository;
import com.ecom.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/order-items")
public class OrderItemController {

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private OrderRepository orderRepository;

    @GetMapping("/{orderId}")
    public List<OrderItem> getOrderItems(@PathVariable Long orderId) {
        Order order = orderRepository.findById(orderId).orElseThrow(() ->
                new RuntimeException("Order not found with ID: " + orderId));
        return orderItemRepository.findByOrder(order);
    }
}
