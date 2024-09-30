package lk.samanmalicateringservice.functionhall.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lk.samanmalicateringservice.functionhall.dao.HallStatusDao;
import lk.samanmalicateringservice.functionhall.entity.HallStatus;

@RestController
@RequestMapping(value = "/hallstatus")
public class HallStatusContoller {
    
    @Autowired
    private HallStatusDao hallStatusDao;

    @GetMapping(value = "/list",  produces = "application/json")
    public List<HallStatus> getAllData(){
        return hallStatusDao.findAll();
    }
    
}
