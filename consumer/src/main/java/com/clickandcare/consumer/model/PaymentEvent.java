package com.clickandcare.consumer.model;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class PaymentEvent {
    private String eventType;
    private String stripeEventId;
    private String appointmentId;
    private String userId;
    private Double amount;
    private String currency;
    private String paymentRequestId;
}
