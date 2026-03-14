package com.cafeshop.repository;

import com.cafeshop.model.Customer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {
    Optional<Customer> findByPhone(String phone);

    Optional<Customer> findByEmail(String email);

    Page<Customer> findByFullNameContainingIgnoreCase(String name, Pageable pageable);

    Page<Customer> findByLocked(Boolean locked, Pageable pageable);

    long countByLocked(Boolean locked);
}
