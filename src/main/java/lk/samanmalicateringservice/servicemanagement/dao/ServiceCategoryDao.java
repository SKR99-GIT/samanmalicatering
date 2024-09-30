package lk.samanmalicateringservice.servicemanagement.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import lk.samanmalicateringservice.servicemanagement.entity.ServiceCategory;

public interface ServiceCategoryDao extends JpaRepository<ServiceCategory, Integer>{
    
}
