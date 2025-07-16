package com.ecom.repository;

import com.ecom.model.CartItem;
import com.ecom.model.Product;
import com.ecom.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {

    List<CartItem> findByUser(User user);

    void deleteByUser(User user);

    CartItem findByUserAndProduct(User user, Product product);
}
