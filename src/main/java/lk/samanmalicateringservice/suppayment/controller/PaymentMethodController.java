package lk.samanmalicateringservice.suppayment.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lk.samanmalicateringservice.suppayment.dao.PaymentMethodDao;
import lk.samanmalicateringservice.suppayment.entity.PaymentMethod;

@RestController
@RequestMapping(value = "/paymentmethod")
public class PaymentMethodController {
    
    @Autowired
    private PaymentMethodDao paymentMethodDao;

    @GetMapping(value = "/list",produces = "application/json")
    public List<PaymentMethod> getAllData(){
        return paymentMethodDao.findAll();
    }
}
