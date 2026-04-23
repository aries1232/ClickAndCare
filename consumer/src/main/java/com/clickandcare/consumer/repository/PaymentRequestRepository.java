package com.clickandcare.consumer.repository;

import com.clickandcare.consumer.model.PaymentRequest;
import com.clickandcare.consumer.model.PaymentStatus;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface PaymentRequestRepository extends MongoRepository<PaymentRequest, String> {
    Optional<PaymentRequest> findByStripeEventId(String stripeEventId);
    boolean existsByStripeEventIdAndStatus(String stripeEventId, PaymentStatus status);
}
