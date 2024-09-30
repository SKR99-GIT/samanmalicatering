package lk.samanmalicateringservice.reservation.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lk.samanmalicateringservice.reservation.dao.KitchenStatusDao;
import lk.samanmalicateringservice.reservation.entity.KitchenStatus;

@RestController
@RequestMapping(value = "/kitchenstatus")
public class KitchenStatusController {

    @Autowired
    private KitchenStatusDao kitchenStatusDao;

    @GetMapping(value = "/list", produces = "application/json" )
    public List<KitchenStatus> getAllData(){
        return kitchenStatusDao.findAll();
    }
    
}
