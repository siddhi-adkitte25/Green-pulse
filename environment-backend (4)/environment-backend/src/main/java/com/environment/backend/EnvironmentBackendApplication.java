// src/main/java/com/environment/backend/EnvironmentBackendApplication.java
package com.environment.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.EnableAspectJAutoProxy;

@SpringBootApplication
@EnableCaching(proxyTargetClass = true) // Enable CGLIB proxies
@EnableAspectJAutoProxy(proxyTargetClass = true) // Use CGLIB for AOP
public class EnvironmentBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(EnvironmentBackendApplication.class, args);
    }
}