package lk.samanmalicateringservice.suppayment.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.samanmalicateringservice.suppayment.entity.SupplierPayment;

public interface SupplierPaymentDao extends JpaRepository<SupplierPayment,Integer>{

    @Query(value = "SELECT concat('B',year(current_date()), lpad(substring(max(sp.billnumber), 7) +1, 3, 0)) FROM samanmalicateringservice.supplierpayment as sp where year(sp.addeddatetime) = year(current_date());", nativeQuery = true)
    public String getNextBillNumber();
    
}
