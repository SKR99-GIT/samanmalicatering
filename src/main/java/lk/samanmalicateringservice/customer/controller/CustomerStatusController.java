package lk.samanmalicateringservice.customer.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lk.samanmalicateringservice.customer.dao.CustomerStatusDao;
import lk.samanmalicateringservice.customer.entity.CustomerStatus;

@RestController
@RequestMapping(value = "/customerstatus")
public class CustomerStatusController {
    
    @Autowired 
    private CustomerStatusDao customerStatusDao;

    @GetMapping(value = "/list")
    public List<CustomerStatus> getAllData(){
        return customerStatusDao.findAll();
    }
}
