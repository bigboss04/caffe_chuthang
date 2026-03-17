package com.cafeshop;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class CafeShopApplication {

    public static void main(String[] args) {
        SpringApplication.run(CafeShopApplication.class, args);
    }
}
