package com.clickandcare.consumer.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Data
@NoArgsConstructor
@Document(collection = "paymentrequests")
public class PaymentRequest {

    @Id
    private String id;

    @Indexed(unique = true)
    private String stripeEventId;

    private String appointmentId;
    private String userId;
    private Double amount;
    private String currency;

    private PaymentStatus status;

    private int retryCount = 0;
    private String errorMessage;
    private String sqsMessageId;
    private Instant publishedToSqsAt;

    @CreatedDate
    private Instant createdAt;

    @LastModifiedDate
    private Instant updatedAt;
}
