package lk.samanmalicateringservice.reservation.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import lk.samanmalicateringservice.reservation.entity.FunctionType;

public interface FunctionTypeDao extends JpaRepository<FunctionType, Integer>{
    
}
