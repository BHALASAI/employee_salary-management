package com.acme.salary.dashboard;

import com.acme.salary.employee.EmployeeRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class DashboardServiceTest {
    @Mock
    private EmployeeRepository employeeRepository;

    @Test
    void summaryKeepsCurrencyTotalsSeparate() {
        EmployeeRepository.CurrencyMetric euro = currencyMetric("EUR", 2L, new BigDecimal("120000.00"));
        EmployeeRepository.CurrencyMetric dollar = currencyMetric("USD", 3L, new BigDecimal("180000.00"));
        when(employeeRepository.count()).thenReturn(5L);
        when(employeeRepository.countByActiveTrue()).thenReturn(4L);
        when(employeeRepository.averageBaseSalary()).thenReturn(new BigDecimal("60000.00"));
        when(employeeRepository.averageBonus()).thenReturn(new BigDecimal("5000.00"));
        when(employeeRepository.salaryByCurrency()).thenReturn(List.of(euro, dollar));
        when(employeeRepository.headcountByCountry()).thenReturn(List.of(countMetric("France", 2L)));
        when(employeeRepository.headcountByDepartment()).thenReturn(List.of(countMetric("Engineering", 3L)));

        DashboardResponse response = new DashboardService(employeeRepository).summary();

        assertThat(response.headcount()).isEqualTo(5);
        assertThat(response.byCurrency()).extracting(CurrencyMetricResponse::currency)
                .containsExactly("EUR", "USD");
        assertThat(response.byCurrency().get(0).totalBaseSalary()).isEqualByComparingTo("120000.00");
    }

    private EmployeeRepository.CurrencyMetric currencyMetric(String currency, long count, BigDecimal total) {
        return new EmployeeRepository.CurrencyMetric() {
            public String getCurrency() { return currency; }
            public Long getEmployeeCount() { return count; }
            public BigDecimal getTotalBaseSalary() { return total; }
        };
    }

    private EmployeeRepository.CountMetric countMetric(String label, long count) {
        return new EmployeeRepository.CountMetric() {
            public String getLabel() { return label; }
            public Long getEmployeeCount() { return count; }
        };
    }
}
