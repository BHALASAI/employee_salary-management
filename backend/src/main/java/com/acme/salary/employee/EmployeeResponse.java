package com.acme.salary.employee;

import java.math.BigDecimal;
import java.time.LocalDate;

public record EmployeeResponse(
        Long id,
        String employeeId,
        String firstName,
        String lastName,
        String email,
        String department,
        String jobTitle,
        String country,
        String currency,
        BigDecimal baseSalary,
        BigDecimal bonus,
        LocalDate effectiveDate,
        boolean active
) {
    public static EmployeeResponse from(Employee employee) {
        return new EmployeeResponse(
                employee.getId(), employee.getEmployeeId(), employee.getFirstName(), employee.getLastName(),
                employee.getEmail(), employee.getDepartment(), employee.getJobTitle(), employee.getCountry(),
                employee.getCurrency(), employee.getBaseSalary(), employee.getBonus(), employee.getEffectiveDate(),
                employee.isActive());
    }
}
