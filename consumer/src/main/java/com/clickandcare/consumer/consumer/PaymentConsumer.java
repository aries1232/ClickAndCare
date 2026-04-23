package com.clickandcare.consumer.consumer;

import com.clickandcare.consumer.model.PaymentEvent;
import com.clickandcare.consumer.service.PaymentService;
import io.awspring.cloud.sqs.annotation.SqsListener;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class PaymentConsumer {

    private final PaymentService paymentService;

    @SqsListener("${sqs.payment-queue-url}")
    public void handlePaymentEvent(PaymentEvent event) {
        log.info("[PaymentConsumer] Received message from payment-queue. eventType={} stripeEventId={}",
                event.getEventType(), event.getStripeEventId());

        try {
            paymentService.processPayment(event);
            log.info("[PaymentConsumer] Successfully processed. stripeEventId={}", event.getStripeEventId());
        } catch (Exception e) {
            log.error("[PaymentConsumer] Processing failed. stripeEventId={} error={}",
                    event.getStripeEventId(), e.getMessage());
            // Rethrowing causes SQS to not delete the message → visibility timeout → retry
            throw e;
        }
    }
}
