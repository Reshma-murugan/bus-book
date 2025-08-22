package com.example.busbookBackend.repository;

import com.example.busbookBackend.entity.Seat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SeatRepository extends JpaRepository<Seat, Long> {
    List<Seat> findByBus_IdOrderByRowNoAscColNoAsc(Long busId);
}