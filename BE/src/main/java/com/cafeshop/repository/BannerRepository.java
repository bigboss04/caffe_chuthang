package com.cafeshop.repository;

import com.cafeshop.model.Banner;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BannerRepository extends JpaRepository<Banner, Long> {
    List<Banner> findByActiveAndPositionOrderBySortOrder(Boolean active, String position);

    List<Banner> findByPositionOrderBySortOrder(String position);
}
