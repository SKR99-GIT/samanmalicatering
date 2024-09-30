package lk.samanmalicateringservice.customer.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.samanmalicateringservice.customer.entity.Customer;

public interface CustomerDao extends JpaRepository<Customer, Integer> {

    //query for get customer by his nic (check duplicate)
    @Query(value = "select c from Customer c where c.nic=?1")
    public Customer getCustomerByNic(String nic);

    //query or generate next cutomer number
    @Query(value = "SELECT lpad(max(c.cusnumber)+1 ,3 ,0) as cusnumber FROM samanmalicateringservice.customer as c;" , nativeQuery = true)
    public String getNextCusNumber();

    @Query(value = "select c from Customer c where c.customerstatus_id.id=1")
    List<Customer> getActiveCustomer();
}
