package lk.samanmalicateringservice.payment.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.samanmalicateringservice.payment.entity.Payment;

public interface PaymentDao extends JpaRepository<Payment, Integer> {

    @Query(value = "SELECT concat('RB',year(current_date()), lpad(substring(max(p.billnumber), 7) +1, 3, 0)) FROM samanmalicateringservice.payment as p where year(p.addeddatetime) = year(current_date());", nativeQuery = true)
    public String getNextPaymentBillNumber();

    /* @Query(value = "select p from Payment p where p.payment_type='Advance'")
    List<Payment> getPaidAdvance(); */

    //for reports
    @Query(value = "select * from payment where date(addeddatetime) >=?1 and date(addeddatetime) <=?2",nativeQuery = true)
    List<Payment> getPaymentsByDateRange(String stratDate,String endDate);
}
