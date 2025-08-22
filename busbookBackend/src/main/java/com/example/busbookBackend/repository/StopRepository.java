package com.example.busbookBackend.repository;

import com.example.busbookBackend.entity.Stop;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StopRepository extends JpaRepository<Stop, Long> {
    
    @Query("SELECT s FROM Stop s WHERE " +
           "LOWER(s.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(s.city) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Stop> findByNameOrCityContainingIgnoreCase(@Param("query") String query);
}