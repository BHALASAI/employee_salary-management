package com.acme.salary.employee;

import com.acme.salary.common.DuplicateResourceException;
import com.acme.salary.common.ResourceNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@Transactional(readOnly = true)
public class EmployeeService {
    private final EmployeeRepository employeeRepository;

    public EmployeeService(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    public Page<EmployeeResponse> search(String search, String country, String department,
                                         Boolean active, Pageable pageable) {
        return employeeRepository.search(blankAsNull(search), blankAsNull(country), blankAsNull(department), active, pageable)
                .map(EmployeeResponse::from);
    }

    public EmployeeResponse get(long id) {
        return EmployeeResponse.from(findEntity(id));
    }

    @Transactional
    public EmployeeResponse create(EmployeeCreateRequest request) {
        if (employeeRepository.existsByEmail(request.email())) {
            throw new DuplicateResourceException("Email already exists");
        }
        Employee employee = employeeRepository.saveAndFlush(toEntity(request));
        employee.assignEmployeeId(formatEmployeeId(employee.getId()));
        return EmployeeResponse.from(employeeRepository.save(employee));
    }

    @Transactional
    public EmployeeResponse update(long id, EmployeeCreateRequest request) {
        Employee employee = findEntity(id);
        if (!employee.getEmail().equalsIgnoreCase(request.email())
                && employeeRepository.existsByEmail(request.email())) {
            throw new DuplicateResourceException("Email already exists");
        }
        employee.update(employee.getEmployeeId(), request.firstName(), request.lastName(), request.email(),
                request.department(), request.jobTitle(), request.country(), request.currency(),
                request.baseSalary(), request.bonus(), request.effectiveDate(), request.active());
        return EmployeeResponse.from(employeeRepository.save(employee));
    }

    @Transactional
    public void delete(long id) {
        Employee employee = findEntity(id);
        employeeRepository.delete(employee);
    }

    private Employee findEntity(long id) {
        return employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found: " + id));
    }

    private Employee toEntity(EmployeeCreateRequest request) {
        return new Employee("PENDING-" + UUID.randomUUID().toString().substring(0, 20),
                request.firstName(), request.lastName(), request.email(),
                request.department(), request.jobTitle(), request.country(), request.currency(),
                request.baseSalary(), request.bonus(), request.effectiveDate(), request.active());
    }

    private String formatEmployeeId(long id) {
        if (id > 99_999) {
            throw new IllegalStateException("Employee ID capacity exceeded");
        }
        return "ACME-%05d".formatted(id);
    }

    private String blankAsNull(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }
}
