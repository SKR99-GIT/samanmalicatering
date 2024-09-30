package lk.samanmalicateringservice.irn.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import lk.samanmalicateringservice.irn.entity.IrnStatus;

public interface IrnStatusDao extends JpaRepository<IrnStatus, Integer>{
    
}
