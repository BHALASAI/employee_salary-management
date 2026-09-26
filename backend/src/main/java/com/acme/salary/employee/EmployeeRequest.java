package com.acme.salary.employee;

import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDate;

public record EmployeeRequest(
        @NotBlank @Size(max = 30) String employeeId,
        @NotBlank @Size(max = 80) String firstName,
        @NotBlank @Size(max = 80) String lastName,
        @NotBlank @Email @Size(max = 160) String email,
        @NotBlank @Size(max = 100) String department,
        @NotBlank @Size(max = 120) String jobTitle,
        @NotBlank @Size(max = 80) String country,
        @NotBlank @Pattern(regexp = "[A-Z]{3}") String currency,
        @NotNull @Min(0) @Digits(integer = 13, fraction = 2) BigDecimal baseSalary,
        @NotNull @Min(0) @Digits(integer = 13, fraction = 2) BigDecimal bonus,
        @NotNull @PastOrPresent LocalDate effectiveDate,
        @NotNull Boolean active
) {
}
