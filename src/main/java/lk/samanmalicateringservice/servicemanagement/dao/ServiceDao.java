package lk.samanmalicateringservice.servicemanagement.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.samanmalicateringservice.servicemanagement.entity.Service;

public interface ServiceDao extends JpaRepository<Service, Integer>{
    
@Query(value = "select s from Service s where s.nic=?1")
public Service getServiceByNic(String nic);

@Query(value = "select sm from Service sm where sm.servicecategory_id.id=?1")
public List<Service> getServiceNameByCategory(Integer servicecategoryid);
}
