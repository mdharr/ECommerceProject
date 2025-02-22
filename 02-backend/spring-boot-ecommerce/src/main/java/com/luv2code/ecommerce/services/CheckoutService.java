package com.luv2code.ecommerce.services;

import com.luv2code.ecommerce.dtos.Purchase;
import com.luv2code.ecommerce.dtos.PurchaseResponse;

public interface CheckoutService {

    PurchaseResponse placeOrder(Purchase purchase);
}
