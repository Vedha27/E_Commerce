package com.ecom.service;

import com.ecom.model.CartItem;
import com.ecom.model.Product;
import com.ecom.model.User;
import com.ecom.repository.CartItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CartItemService {

    @Autowired
    private CartItemRepository cartItemRepository;

    public List<CartItem> getCartItemsByUser(User user) {
        return cartItemRepository.findByUser(user);
    }

    public CartItem addToCart(User user, Product product, int quantity) {
        CartItem item = new CartItem(user, product, quantity);
        return cartItemRepository.save(item);
    }

    public void clearCart(User user) {
        cartItemRepository.deleteByUser(user);
    }
}
