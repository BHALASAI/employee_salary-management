package com.acme.salary.employee;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;

class EmployeeCreateRequestValidationTest {
    private final Validator validator = Validation.buildDefaultValidatorFactory().getValidator();

    @Test
    void rejectsInvalidEmail() {
        Set<ConstraintViolation<EmployeeCreateRequest>> violations = validator.validate(request("not-an-email"));

        assertThat(violations).anySatisfy(violation ->
                assertThat(violation.getPropertyPath().toString()).isEqualTo("email"));
    }

    @Test
    void acceptsValidFieldsWithoutEmployeeId() {
        assertThat(validator.validate(request("aisha@example.com"))).isEmpty();
    }

    private EmployeeCreateRequest request(String email) {
        return new EmployeeCreateRequest("Aisha", "Patel", email, "Engineering", "Engineer", "France", "EUR",
                new BigDecimal("85000.00"), new BigDecimal("5000.00"), LocalDate.of(2025, 1, 1), true);
    }
}