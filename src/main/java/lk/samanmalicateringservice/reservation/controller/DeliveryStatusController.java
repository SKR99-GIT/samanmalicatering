package lk.samanmalicateringservice.reservation.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lk.samanmalicateringservice.reservation.dao.DeliveryStatusDao;
import lk.samanmalicateringservice.reservation.entity.DeliveryStatus;

@RestController
@RequestMapping(value = "/deliverystatus")
public class DeliveryStatusController {
    
    @Autowired
    private DeliveryStatusDao deliveryStatusDao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<DeliveryStatus> getAllData(){
        return deliveryStatusDao.findAll();
    }
}
