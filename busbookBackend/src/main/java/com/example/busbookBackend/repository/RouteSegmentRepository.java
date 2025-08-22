package com.example.busbookBackend.repository;

import com.example.busbookBackend.entity.RouteSegment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RouteSegmentRepository extends JpaRepository<RouteSegment, Long> {
    
    List<RouteSegment> findByRoute_IdOrderBySequenceNoAsc(Long routeId);
    
    @Query("SELECT rs FROM RouteSegment rs WHERE rs.route.id = :routeId " +
           "AND rs.sequenceNo >= :startSeq AND rs.sequenceNo < :endSeq " +
           "ORDER BY rs.sequenceNo ASC")
    List<RouteSegment> findByRouteIdAndSequenceNoBetween(
        @Param("routeId") Long routeId, 
        @Param("startSeq") int startSeq, 
        @Param("endSeq") int endSeq);
    
    @Query("SELECT rs FROM RouteSegment rs WHERE rs.route.id = :routeId AND rs.fromStop.id = :stopId")
    Optional<RouteSegment> findByRouteIdAndFromStopId(@Param("routeId") Long routeId, @Param("stopId") Long stopId);
    
    @Query("SELECT rs FROM RouteSegment rs WHERE rs.route.id = :routeId AND rs.toStop.id = :stopId")
    Optional<RouteSegment> findByRouteIdAndToStopId(@Param("routeId") Long routeId, @Param("stopId") Long stopId);
}