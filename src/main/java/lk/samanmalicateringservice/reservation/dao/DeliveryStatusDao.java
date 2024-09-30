package lk.samanmalicateringservice.reservation.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import lk.samanmalicateringservice.reservation.entity.DeliveryStatus;

public interface DeliveryStatusDao extends JpaRepository<DeliveryStatus, Integer>{
    
}
