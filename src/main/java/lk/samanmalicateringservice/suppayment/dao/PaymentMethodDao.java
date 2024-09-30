package lk.samanmalicateringservice.suppayment.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import lk.samanmalicateringservice.suppayment.entity.PaymentMethod;

public interface PaymentMethodDao extends JpaRepository<PaymentMethod, Integer>{
    
}
