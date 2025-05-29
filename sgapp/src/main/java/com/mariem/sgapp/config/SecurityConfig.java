package com.mariem.sgapp.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf().disable() // Désactive CSRF pour simplifier les tests
            .authorizeRequests()
            .anyRequest().permitAll(); // Autorise toutes les requêtes sans authentification
        return http.build();
    }
    
    //new
    /*
    @Bean
    public JwtUtil jwtUtil() {
        return new JwtUtil();
    }
   
    
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, JwtFilter jwtFilter) throws Exception {
        http
            .csrf().disable()
            .authorizeRequests()
            .requestMatchers("/api/login/**").permitAll() // Login accessible sans authentification
            .requestMatchers("/api/administrateur/**").hasRole("ROLE_ADMIN")
            .requestMatchers("/api/enseignant/**").hasRole("ROLE_ENSEIGNANT")
            .requestMatchers("/api/employer/**").hasRole("ROLE_EMPLOYER")
            .anyRequest().authenticated() // Toutes les autres routes nécessitent une authentification
            .and()
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class); // Ajouter le filtre JWT

        return http.build();
    }*/
}
