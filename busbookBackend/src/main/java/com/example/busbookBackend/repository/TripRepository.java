package com.example.busbookBackend.repository;

import com.example.busbookBackend.entity.Trip;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TripRepository extends JpaRepository<Trip, Long> {
    
    @Query("SELECT t FROM Trip t " +
           "JOIN t.bus b " +
           "JOIN b.route r " +
           "WHERE t.travelDate = :travelDate " +
           "AND EXISTS (SELECT 1 FROM RouteSegment rs1 WHERE rs1.route = r AND rs1.fromStop.id = :fromStopId) " +
           "AND EXISTS (SELECT 1 FROM RouteSegment rs2 WHERE rs2.route = r AND rs2.toStop.id = :toStopId) " +
           "AND (SELECT rs1.sequenceNo FROM RouteSegment rs1 WHERE rs1.route = r AND rs1.fromStop.id = :fromStopId) < " +
           "(SELECT rs2.sequenceNo FROM RouteSegment rs2 WHERE rs2.route = r AND rs2.toStop.id = :toStopId)")
    List<Trip> findTripsForRoute(@Param("fromStopId") Long fromStopId, 
                                @Param("toStopId") Long toStopId, 
                                @Param("travelDate") LocalDate travelDate);
}