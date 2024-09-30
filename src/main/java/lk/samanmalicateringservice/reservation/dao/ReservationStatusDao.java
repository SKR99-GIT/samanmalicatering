package lk.samanmalicateringservice.reservation.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import lk.samanmalicateringservice.reservation.entity.ReservationStatus;

public interface ReservationStatusDao extends JpaRepository<ReservationStatus, Integer>{
}
