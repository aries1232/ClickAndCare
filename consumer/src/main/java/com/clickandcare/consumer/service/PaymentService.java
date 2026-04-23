package com.clickandcare.consumer.service;

import com.clickandcare.consumer.model.PaymentEvent;
import com.clickandcare.consumer.model.PaymentRequest;
import com.clickandcare.consumer.model.PaymentStatus;
import com.clickandcare.consumer.repository.PaymentRequestRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRequestRepository paymentRequestRepository;
    private final MongoTemplate mongoTemplate;

    public void processPayment(PaymentEvent event) {
        String stripeEventId = event.getStripeEventId();
        String appointmentId = event.getAppointmentId();

        log.info("[PaymentService] Processing payment event. stripeEventId={} appointmentId={}",
                stripeEventId, appointmentId);

        // Idempotency check — skip if already COMPLETED
        if (paymentRequestRepository.existsByStripeEventIdAndStatus(stripeEventId, PaymentStatus.COMPLETED)) {
            log.warn("[PaymentService] Event already COMPLETED, skipping. stripeEventId={}", stripeEventId);
            return;
        }

        // Update PaymentRequest → PROCESSING
        updatePaymentRequestStatus(stripeEventId, PaymentStatus.PROCESSING, null);
        log.info("[PaymentService] Status → PROCESSING. stripeEventId={}", stripeEventId);

        try {
            // Update Appointment → payment: true
            Query appointmentQuery = new Query(Criteria.where("_id").is(appointmentId));
            Update appointmentUpdate = new Update().set("payment", true);
            mongoTemplate.updateFirst(appointmentQuery, appointmentUpdate, "appointments");

            log.info("[PaymentService] Appointment updated. appointmentId={}", appointmentId);

            // Update PaymentRequest → COMPLETED
            updatePaymentRequestStatus(stripeEventId, PaymentStatus.COMPLETED, null);
            log.info("[PaymentService] Status → COMPLETED. stripeEventId={} appointmentId={}",
                    stripeEventId, appointmentId);

        } catch (Exception e) {
            log.error("[PaymentService] Failed to process payment. stripeEventId={} error={}",
                    stripeEventId, e.getMessage(), e);

            // Update PaymentRequest → FAILED with error
            updatePaymentRequestStatus(stripeEventId, PaymentStatus.FAILED, e.getMessage());
            incrementRetryCount(stripeEventId);

            // Rethrow so SQS visibility timeout triggers a retry
            throw new RuntimeException("Payment processing failed: " + e.getMessage(), e);
        }
    }

    private void updatePaymentRequestStatus(String stripeEventId, PaymentStatus status, String errorMessage) {
        Query query = new Query(Criteria.where("stripeEventId").is(stripeEventId));
        Update update = new Update().set("status", status);
        if (errorMessage != null) {
            update.set("errorMessage", errorMessage);
        }
        mongoTemplate.updateFirst(query, update, PaymentRequest.class);
    }

    private void incrementRetryCount(String stripeEventId) {
        Query query = new Query(Criteria.where("stripeEventId").is(stripeEventId));
        Update update = new Update().inc("retryCount", 1);
        mongoTemplate.updateFirst(query, update, PaymentRequest.class);
    }
}
