package lk.samanmalicateringservice.reservation.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import lk.samanmalicateringservice.reservation.entity.KitchenStatus;

public interface KitchenStatusDao extends JpaRepository<KitchenStatus, Integer>{
    
}
