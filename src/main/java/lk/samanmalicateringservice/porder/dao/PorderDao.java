package lk.samanmalicateringservice.porder.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.samanmalicateringservice.porder.entity.Porder;

public interface PorderDao extends JpaRepository<Porder, Integer>{

    @Query(value = "SELECT concat('PO',year(current_date()), lpad(substring(max(po.pordercode), 7) +1, 3, 0)) FROM samanmalicateringservice.purchaseorder as po where year(po.addeddatetime) = year(current_date());", nativeQuery = true)
    public String getNextPOCode();

    //IRN form ekedi supplier select krm eken eyage porder tika filter wela ena query ek
    @Query(value = "select po from Porder po where po.supplier_id.id=?1 and porderstatus_id.id = 2")
    public List<Porder> getPorderBySupplier(Integer supplierid);
}
