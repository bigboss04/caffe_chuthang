package com.cafeshop.repository;

import com.cafeshop.model.ShippingZone;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ShippingZoneRepository extends JpaRepository<ShippingZone, Long> {
    List<ShippingZone> findByActiveOrderBySortOrder(Boolean active);
}
