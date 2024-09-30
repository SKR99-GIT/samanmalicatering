package lk.samanmalicateringservice.reservation.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lk.samanmalicateringservice.reservation.dao.LorryDao;
import lk.samanmalicateringservice.reservation.entity.Lorry;

@RestController
@RequestMapping(value = "/lorry")
public class LorryController {
    
    @Autowired
    private LorryDao lorryDao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<Lorry> getAllData(){
        return lorryDao.findAll();
    }

    @GetMapping(value = "/getavailablelorry/{functiondate}", produces = "application/json")
    public List<Lorry> getAvailLorry(@PathVariable("functiondate") LocalDate functiondate){
        return lorryDao.getAvailableLorry(functiondate);
    }
}
