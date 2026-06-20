// src/main/java/com/environment/backend/config/SecurityConfig.java
package com.environment.backend.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
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
    private JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;
    
    @Autowired
    private JwtRequestFilter jwtRequestFilter;
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    
    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(authz -> authz
                // Public endpoints
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/events").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/events/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/registrations/event/*/count").permitAll()
                .requestMatchers("/api/notifications/public").permitAll()
                .requestMatchers("/api/notifications/event/**").permitAll()
                .requestMatchers("/api/notifications/type/**").permitAll()
                .requestMatchers("/api/gallery").permitAll()
                .requestMatchers("/api/donations").permitAll()
                .requestMatchers("/api/donations/total").permitAll()
                .requestMatchers("/api/contact").permitAll()
                
                // Admin only endpoints
                .requestMatchers(HttpMethod.POST, "/api/events").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/events/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/events/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.POST, "/api/notifications").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/notifications/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/notifications/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.POST, "/api/gallery").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/gallery/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/gallery/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.GET, "/api/contact").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/contact/**").hasRole("ADMIN")
                .requestMatchers("/api/auth/users").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/auth/users/**").hasRole("ADMIN")
                
                // Authenticated endpoints
                .requestMatchers("/api/registrations/**").authenticated()
                .requestMatchers("/api/notifications/my-notifications").authenticated()
                .requestMatchers("/api/donations/my-donations").authenticated()
                .requestMatchers("/api/auth/profile").authenticated()
                .requestMatchers(HttpMethod.PUT, "/api/auth/**").authenticated()
                .requestMatchers(HttpMethod.DELETE, "/api/auth/profile").authenticated()
                
                .anyRequest().authenticated()
            )
            .exceptionHandling(ex -> ex
                .authenticationEntryPoint(jwtAuthenticationEntryPoint)
            )
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            );
        
        http.addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }
}