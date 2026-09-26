package com.acme.salary.dashboard;

import com.acme.salary.employee.EmployeeRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class DashboardService {
    private final EmployeeRepository employeeRepository;

    public DashboardService(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    public DashboardResponse summary() {
        List<CurrencyMetricResponse> currencies = employeeRepository.salaryByCurrency().stream()
                .map(metric -> new CurrencyMetricResponse(metric.getCurrency(), metric.getEmployeeCount(), metric.getTotalBaseSalary()))
                .toList();
        List<MetricResponse> countries = toMetrics(employeeRepository.headcountByCountry());
        List<MetricResponse> departments = toMetrics(employeeRepository.headcountByDepartment());
        return new DashboardResponse(
                employeeRepository.count(),
                employeeRepository.countByActiveTrue(),
                valueOrZero(employeeRepository.averageBaseSalary()),
                valueOrZero(employeeRepository.averageBonus()),
                currencies,
                countries,
                departments);
    }

    private List<MetricResponse> toMetrics(List<EmployeeRepository.CountMetric> metrics) {
        return metrics.stream()
                .map(metric -> new MetricResponse(metric.getLabel(), metric.getEmployeeCount()))
                .toList();
    }

    private BigDecimal valueOrZero(BigDecimal value) {
        return value == null ? BigDecimal.ZERO : value;
    }
}
