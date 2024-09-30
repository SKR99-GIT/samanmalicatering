package lk.samanmalicateringservice.porder.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import lk.samanmalicateringservice.porder.entity.PorderStatus;

public interface PorderStatusDao extends JpaRepository<PorderStatus, Integer>{
    
}
