package com.acme.salary.employee;

import com.acme.salary.common.DuplicateResourceException;
import com.acme.salary.common.ResourceNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
    public EmployeeResponse create(EmployeeRequest request) {
        if (employeeRepository.existsByEmployeeId(request.employeeId())) {
            throw new DuplicateResourceException("Employee ID already exists");
        }
        return EmployeeResponse.from(employeeRepository.save(toEntity(request)));
    }

    @Transactional
    public EmployeeResponse update(long id, EmployeeRequest request) {
        Employee employee = findEntity(id);
        if (!employee.getEmployeeId().equals(request.employeeId())
                && employeeRepository.existsByEmployeeId(request.employeeId())) {
            throw new DuplicateResourceException("Employee ID already exists");
        }
        employee.update(request.employeeId(), request.firstName(), request.lastName(), request.email(),
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

    private Employee toEntity(EmployeeRequest request) {
        return new Employee(request.employeeId(), request.firstName(), request.lastName(), request.email(),
                request.department(), request.jobTitle(), request.country(), request.currency(),
                request.baseSalary(), request.bonus(), request.effectiveDate(), request.active());
    }

    private String blankAsNull(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }
}
