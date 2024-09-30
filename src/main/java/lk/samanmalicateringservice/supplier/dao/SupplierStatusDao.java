package lk.samanmalicateringservice.supplier.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import lk.samanmalicateringservice.supplier.entity.SupplierStatus;

public interface SupplierStatusDao extends JpaRepository<SupplierStatus, Integer>{
    
}
