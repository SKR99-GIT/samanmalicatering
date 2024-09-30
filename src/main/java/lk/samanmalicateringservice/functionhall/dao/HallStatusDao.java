package lk.samanmalicateringservice.functionhall.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import lk.samanmalicateringservice.functionhall.entity.HallStatus;

public interface HallStatusDao extends JpaRepository<HallStatus, Integer>{
    
}
