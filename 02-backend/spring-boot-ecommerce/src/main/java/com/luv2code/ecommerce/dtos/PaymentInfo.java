package com.luv2code.ecommerce.dtos;

import lombok.Data;

@Data
public class PaymentInfo {

    private int amount;
    private String currency;
}
