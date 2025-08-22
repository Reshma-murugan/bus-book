package com.example.busbookBackend.repository;

import com.example.busbookBackend.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    
    List<Booking> findByUser_IdOrderByBookedAtDesc(Long userId);
    
    @Query("SELECT b FROM Booking b WHERE b.trip.id = :tripId " +
           "AND b.seatNumber = :seatNumber " +
           "AND b.status = 'CONFIRMED' " +
           "AND b.fromSeq < :toSeq AND b.toSeq > :fromSeq")
    List<Booking> findOverlappingBookings(@Param("tripId") Long tripId, 
                                         @Param("seatNumber") String seatNumber,
                                         @Param("fromSeq") int fromSeq, 
                                         @Param("toSeq") int toSeq);
    
    @Query("SELECT COUNT(DISTINCT b.seatNumber) FROM Booking b WHERE b.trip.id = :tripId " +
           "AND b.status = 'CONFIRMED' " +
           "AND b.fromSeq < :toSeq AND b.toSeq > :fromSeq")
    long countBookedSeatsForSegment(@Param("tripId") Long tripId, 
                                   @Param("fromSeq") int fromSeq, 
                                   @Param("toSeq") int toSeq);
}