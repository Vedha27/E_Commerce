package com.ecom.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtFilter jwtFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(
                    "/", "/login.html", "/register.html",
                    "/admin-products.html", "/customer-products.html",
                    "/cart.html", "/order-success.html", "/my-orders.html",
                    "/images/**",
                    "/register.js", "/login.js", "/order-success.js",
                    "/admin-products.js", "/customer-products.js",
                    "/cart.js", "/my-orders.js",

                    "/register.css", "/login.css", "/admin-products.css",
                    "/customer-products.css", "/cart.css", "/order-success.css",
                    "/my-orders.css",

                    "/api/auth/**"
                ).permitAll()

                .requestMatchers("/api/products/**").hasAnyAuthority("ADMIN", "CUSTOMER")
                .requestMatchers("/api/cart/**").hasAuthority("CUSTOMER")
                .requestMatchers("/api/orders/**").hasAuthority("CUSTOMER") // ✅ Secure orders API
                .requestMatchers("/api/users/**").authenticated() // Optional: secure user API
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
