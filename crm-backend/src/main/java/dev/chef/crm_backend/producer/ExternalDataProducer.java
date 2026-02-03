package dev.chef.crm_backend.producer;

/**
 * Generic contract for any external source producer.
 * New producer types (e.g. analytics, payments) can implement this interface
 * and will be picked up automatically by the scheduler.
 */
public interface ExternalDataProducer {

	/**
	 * Human‑readable name for logging/monitoring.
	 */
	String getSourceName();

	/**
	 * Fetch data from the external system and publish it to the message queue.
	 */
	void produce();
}

