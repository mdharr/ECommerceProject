package com.luv2code.ecommerce.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;

@Service
public class CaptchaService {

    @Value("${RECAPTCHA_SECRET}")
    private String secretKey;

    private static final String VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";

    public boolean verifyCaptcha(String captchaResponse) {
        RestTemplate restTemplate = new RestTemplate();
        String url = VERIFY_URL + "?secret=" + secretKey + "&response=" + captchaResponse;

        ResponseEntity<String> response = restTemplate.postForEntity(url, null, String.class);

        return response.getBody().contains("\"success\": true");
    }
}
