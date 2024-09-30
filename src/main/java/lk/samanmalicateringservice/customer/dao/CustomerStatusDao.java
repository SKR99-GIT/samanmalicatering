package lk.samanmalicateringservice.customer.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import lk.samanmalicateringservice.customer.entity.CustomerStatus;

public interface CustomerStatusDao extends JpaRepository<CustomerStatus, Integer> {
    
}
