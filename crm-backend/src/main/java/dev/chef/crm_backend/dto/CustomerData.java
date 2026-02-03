package dev.chef.crm_backend.dto;

import java.util.Map;

/**
 * DTO for customer data from the CRM REST/SOAP API (/customers).
 * Fields are flexible to support varying API response shapes.
 */
public record CustomerData(
		String id,
		String name,
		String email,
		Map<String, Object> additional
) {
	public CustomerData(String id, String name, String email) {
		this(id, name, email, null);
	}
}
