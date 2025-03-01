package com.luv2code.ecommerce.services;

import com.luv2code.ecommerce.dtos.PaymentInfo;
import com.luv2code.ecommerce.dtos.Purchase;
import com.luv2code.ecommerce.dtos.PurchaseResponse;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;

public interface CheckoutService {

    PurchaseResponse placeOrder(Purchase purchase);

    PaymentIntent createPaymentIntent(PaymentInfo paymentInfo) throws StripeException;
}
