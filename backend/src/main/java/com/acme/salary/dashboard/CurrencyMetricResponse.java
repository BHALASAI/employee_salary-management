package com.acme.salary.dashboard;

import java.math.BigDecimal;

public record CurrencyMetricResponse(String currency, long employeeCount, BigDecimal totalBaseSalary) {
}
