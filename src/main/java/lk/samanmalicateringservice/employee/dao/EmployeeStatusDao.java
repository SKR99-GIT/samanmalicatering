package lk.samanmalicateringservice.employee.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import lk.samanmalicateringservice.employee.entity.EmployeeStatus;

public interface EmployeeStatusDao extends JpaRepository <EmployeeStatus,Integer>{
    
}
