package com.acme.salary.employee;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Table;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "employees", indexes = {
        @Index(name = "idx_employee_email", columnList = "email"),
        @Index(name = "idx_employee_country", columnList = "country"),
        @Index(name = "idx_employee_department", columnList = "department"),
        @Index(name = "idx_employee_active", columnList = "active")
})
public class Employee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 30)
    private String employeeId;

    @Column(nullable = false, length = 80)
    private String firstName;

    @Column(nullable = false, length = 80)
    private String lastName;

    @Column(nullable = false, unique = true, length = 160)
    private String email;

    @Column(nullable = false, length = 100)
    private String department;

    @Column(nullable = false, length = 120)
    private String jobTitle;

    @Column(nullable = false, length = 80)
    private String country;

    @Column(nullable = false, length = 3)
    private String currency;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal baseSalary;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal bonus;

    @Column(nullable = false)
    private LocalDate effectiveDate;

    @Column(nullable = false)
    private boolean active;

    protected Employee() {
    }

    public Employee(String employeeId, String firstName, String lastName, String email,
                    String department, String jobTitle, String country, String currency,
                    BigDecimal baseSalary, BigDecimal bonus, LocalDate effectiveDate, boolean active) {
        this.employeeId = employeeId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.department = department;
        this.jobTitle = jobTitle;
        this.country = country;
        this.currency = currency;
        this.baseSalary = baseSalary;
        this.bonus = bonus;
        this.effectiveDate = effectiveDate;
        this.active = active;
    }

    public Long getId() {
        return id;
    }

    public String getEmployeeId() {
        return employeeId;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public String getEmail() {
        return email;
    }

    public String getDepartment() {
        return department;
    }

    public String getJobTitle() {
        return jobTitle;
    }

    public String getCountry() {
        return country;
    }

    public String getCurrency() {
        return currency;
    }

    public BigDecimal getBaseSalary() {
        return baseSalary;
    }

    public BigDecimal getBonus() {
        return bonus;
    }

    public LocalDate getEffectiveDate() {
        return effectiveDate;
    }

    public boolean isActive() {
        return active;
    }

    public void update(String employeeId, String firstName, String lastName, String email,
                       String department, String jobTitle, String country, String currency,
                       BigDecimal baseSalary, BigDecimal bonus, LocalDate effectiveDate, boolean active) {
        this.employeeId = employeeId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.department = department;
        this.jobTitle = jobTitle;
        this.country = country;
        this.currency = currency;
        this.baseSalary = baseSalary;
        this.bonus = bonus;
        this.effectiveDate = effectiveDate;
        this.active = active;
    }
}
