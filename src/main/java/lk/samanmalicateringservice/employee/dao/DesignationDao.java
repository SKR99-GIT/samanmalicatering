package lk.samanmalicateringservice.employee.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import lk.samanmalicateringservice.employee.entity.Designation;

public interface DesignationDao extends JpaRepository<Designation,Integer>{
    
}
