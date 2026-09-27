package com.acme.salary.employee;

import com.acme.salary.common.DuplicateResourceException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.math.BigDecimal;
import java.time.LocalDate;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EmployeeServiceTest {
    @Mock
    private EmployeeRepository employeeRepository;

    @InjectMocks
    private EmployeeService employeeService;

    @Test
    void createGeneratesEmployeeIdFromDatabaseIdentity() {
        EmployeeCreateRequest request = createRequest();
        when(employeeRepository.saveAndFlush(any(Employee.class))).thenAnswer(invocation -> {
            Employee employee = invocation.getArgument(0);
            ReflectionTestUtils.setField(employee, "id", 10_001L);
            return employee;
        });
        when(employeeRepository.save(any(Employee.class))).thenAnswer(invocation -> invocation.getArgument(0));

        EmployeeResponse response = employeeService.create(request);

        ArgumentCaptor<Employee> captor = ArgumentCaptor.forClass(Employee.class);
        verify(employeeRepository).save(captor.capture());
        assertThat(captor.getValue().getEmployeeId()).isEqualTo("ACME-10001");
        assertThat(response.employeeId()).isEqualTo("ACME-10001");
        assertThat(response.baseSalary()).isEqualByComparingTo("85000.00");
        assertThat(response.active()).isTrue();
    }

    @Test
    void searchTrimsOptionalFiltersBeforeQuerying() {
        org.springframework.data.domain.Page<Employee> page = new org.springframework.data.domain.PageImpl<>(java.util.List.of());
        when(employeeRepository.search(any(), any(), any(), any(), any())).thenReturn(page);
        org.springframework.data.domain.Pageable pageable = org.springframework.data.domain.PageRequest.of(0, 25);

        employeeService.search("  Patel ", " France ", "  ", true, pageable);

        verify(employeeRepository).search("Patel", "France", null, true, pageable);
    }

    private EmployeeCreateRequest createRequest() {
        return new EmployeeCreateRequest("Aisha", "Patel", "aisha@example.com", "Engineering",
                "Engineer", "France", "EUR", new BigDecimal("85000.00"), new BigDecimal("5000.00"),
                LocalDate.of(2025, 1, 1), true);
    }
}
