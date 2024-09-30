package lk.samanmalicateringservice.garbageremover.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import lk.samanmalicateringservice.garbageremover.entity.GarbageStatus;

public interface GarbageStatusDao extends JpaRepository<GarbageStatus, Integer>{
    
}
