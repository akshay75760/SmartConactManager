package com.scm.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class WebClientConfig {

    @Value("${microservices.profile-service.url:http://localhost:8082}")
    private String profileServiceUrl;

    @Bean
    public WebClient profileServiceWebClient() {
        return WebClient.builder()
                .baseUrl(profileServiceUrl)
                .build();
    }
}
