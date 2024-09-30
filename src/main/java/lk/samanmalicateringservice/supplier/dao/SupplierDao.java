package lk.samanmalicateringservice.supplier.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.samanmalicateringservice.supplier.entity.Supplier;

public interface SupplierDao extends JpaRepository<Supplier, Integer>{

    @Query(value = "select s from Supplier s where s.email=?1")
    public Supplier getSupplierByEmail(String email);

    @Query(value = "SELECT concat('S', lpad(substring(max(s.supnumber), 5)+1 ,4 ,0)) as code FROM samanmalicateringservice.supplier as s;", nativeQuery = true)
    public String getNextSupNumber();

    @Query(value = "select s from Supplier s where s.supplierstatus_id.id=1")
    List<Supplier> getActiveSupplier();
    
}
