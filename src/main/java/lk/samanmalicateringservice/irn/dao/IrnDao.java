package lk.samanmalicateringservice.irn.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.samanmalicateringservice.irn.entity.Irn;

public interface IrnDao extends JpaRepository<Irn, Integer>{

    @Query(value = "SELECT concat('IRN', lpad(substring(max(irn.irncode), 5)+1 ,4 ,0)) as code FROM samanmalicateringservice.irn;", nativeQuery = true)
    public String getNextIrnCode();

    @Query(value = "SELECT concat('ISB',year(current_date()), lpad(substring(max(i.supplierbillnumber),8)+1,4,0)) FROM samanmalicateringservice.irn as i where year(i.addeddatetime) = year(current_date());", nativeQuery = true)
    public String getNextSupBillNumber();
    
    //supplier payment ekt supplierta adala irn tika genn gnnd oni query ek 
    @Query(value = "select i from Irn i where i.supplier_id.id=?1 and i.netamount != i.paidamount")
    public List<Irn> getIrnBySupplier(Integer supplierid);
}
