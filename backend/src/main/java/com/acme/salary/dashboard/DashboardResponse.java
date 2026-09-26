package com.acme.salary.dashboard;

import java.math.BigDecimal;
import java.util.List;

public record DashboardResponse(
        long headcount,
        long activeHeadcount,
        BigDecimal averageBaseSalary,
        BigDecimal averageBonus,
        List<CurrencyMetricResponse> byCurrency,
        List<MetricResponse> byCountry,
        List<MetricResponse> byDepartment
) {
}
