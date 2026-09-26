package com.acme.salary.seed;

import com.acme.salary.employee.Employee;
import com.acme.salary.employee.EmployeeRepository;
import com.acme.salary.user.AppUser;
import com.acme.salary.user.Role;
import com.acme.salary.user.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Component
public class DataInitializer implements CommandLineRunner {
    private static final String[] FIRST_NAMES = {"Aisha", "Lucas", "Maya", "Noah", "Sofia", "Ethan", "Priya", "Liam", "Zara", "Oliver"};
    private static final String[] LAST_NAMES = {"Patel", "Martin", "Chen", "Smith", "Garcia", "Khan", "Brown", "Silva", "Wilson", "Rossi"};
    private static final String[] DEPARTMENTS = {"Engineering", "People", "Finance", "Operations", "Sales", "Legal", "Marketing", "Customer Success"};
    private static final String[] JOB_TITLES = {"Analyst", "Specialist", "Manager", "Senior Manager", "Lead", "Director", "Coordinator"};
    private static final String[] COUNTRIES = {"France", "India", "United States", "United Kingdom", "Germany", "Japan", "Brazil", "Canada"};
    private static final String[] CURRENCIES = {"EUR", "INR", "USD", "GBP", "EUR", "JPY", "BRL", "CAD"};

    private final UserRepository userRepository;
    private final EmployeeRepository employeeRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, EmployeeRepository employeeRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.employeeRepository = employeeRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        seedUsers();
        if (employeeRepository.count() > 0) {
            return;
        }

        Random random = new Random(42);
        List<Employee> batch = new ArrayList<>(500);
        for (int index = 1; index <= 10_000; index++) {
            int group = (index - 1) % COUNTRIES.length;
            String firstName = FIRST_NAMES[(index - 1) % FIRST_NAMES.length];
            String lastName = LAST_NAMES[(index * 3) % LAST_NAMES.length];
            BigDecimal salary = BigDecimal.valueOf(45_000L + random.nextInt(95_001)).setScale(2, RoundingMode.HALF_UP);
            BigDecimal bonus = salary.multiply(BigDecimal.valueOf(0.05 + (random.nextDouble() * 0.15)))
                    .setScale(2, RoundingMode.HALF_UP);
            batch.add(new Employee(
                    String.format("ACME-%05d", index), firstName, lastName,
                    String.format("%s.%s%05d@acme.example", firstName, lastName, index).toLowerCase(),
                    DEPARTMENTS[(index - 1) % DEPARTMENTS.length],
                    JOB_TITLES[(index - 1) % JOB_TITLES.length], COUNTRIES[group], CURRENCIES[group], salary, bonus,
                    LocalDate.of(2024, 1, 1).plusDays(index % 730), index % 17 != 0));
            if (batch.size() == 500) {
                employeeRepository.saveAll(batch);
                batch.clear();
            }
        }
        if (!batch.isEmpty()) {
            employeeRepository.saveAll(batch);
        }
    }

    private void seedUsers() {
        createUserIfMissing("admin", "admin123!", Role.ADMIN);
        createUserIfMissing("hrmanager", "hrmanager123!", Role.HR_MANAGER);
        createUserIfMissing("viewer", "viewer123!", Role.VIEWER);
    }

    private void createUserIfMissing(String username, String password, Role role) {
        if (userRepository.findByUsername(username).isEmpty()) {
            userRepository.save(new AppUser(username, passwordEncoder.encode(password), role));
        }
    }
}
