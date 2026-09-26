package com.acme.salary.employee;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    boolean existsByEmployeeId(String employeeId);

    Optional<Employee> findByEmployeeId(String employeeId);

    @Query("""
            select e from Employee e
            where (:search is null or :search = '' or
                   lower(e.employeeId) like lower(concat('%', :search, '%')) or
                   lower(e.firstName) like lower(concat('%', :search, '%')) or
                   lower(e.lastName) like lower(concat('%', :search, '%')) or
                   lower(e.email) like lower(concat('%', :search, '%')) or
                   lower(e.jobTitle) like lower(concat('%', :search, '%')))
              and (:country is null or :country = '' or e.country = :country)
              and (:department is null or :department = '' or e.department = :department)
              and (:active is null or e.active = :active)
            """)
    Page<Employee> search(@Param("search") String search,
                           @Param("country") String country,
                           @Param("department") String department,
                           @Param("active") Boolean active,
                           Pageable pageable);

    long countByActiveTrue();

    @Query("select avg(e.baseSalary) from Employee e")
    BigDecimal averageBaseSalary();

    @Query("select avg(e.bonus) from Employee e")
    BigDecimal averageBonus();

    @Query("select e.currency as currency, count(e) as employeeCount, sum(e.baseSalary) as totalBaseSalary from Employee e group by e.currency order by e.currency")
    List<CurrencyMetric> salaryByCurrency();

    @Query("select e.country as label, count(e) as employeeCount from Employee e group by e.country order by employeeCount desc")
    List<CountMetric> headcountByCountry();

    @Query("select e.department as label, count(e) as employeeCount from Employee e group by e.department order by employeeCount desc")
    List<CountMetric> headcountByDepartment();

    interface CurrencyMetric {
        String getCurrency();
        Long getEmployeeCount();
        BigDecimal getTotalBaseSalary();
    }

    interface CountMetric {
        String getLabel();
        Long getEmployeeCount();
    }
}
