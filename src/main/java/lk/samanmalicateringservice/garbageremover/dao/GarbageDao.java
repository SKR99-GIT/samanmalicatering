package lk.samanmalicateringservice.garbageremover.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import lk.samanmalicateringservice.garbageremover.entity.Garbage;

public interface GarbageDao extends JpaRepository<Garbage, Integer>{
    
}
