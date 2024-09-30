package lk.samanmalicateringservice.servicemanagement.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import lk.samanmalicateringservice.servicemanagement.entity.ServiceStatus;

public interface ServiceStatusDao extends JpaRepository<ServiceStatus, Integer>{
    
}
