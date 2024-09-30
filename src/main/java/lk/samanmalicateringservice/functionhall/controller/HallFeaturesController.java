package lk.samanmalicateringservice.functionhall.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lk.samanmalicateringservice.functionhall.dao.HallFeaturesDao;
import lk.samanmalicateringservice.functionhall.entity.HallFeatures;

@RestController
@RequestMapping(value = "/hallfeatures")
public class HallFeaturesController {
    
    @Autowired
    private HallFeaturesDao hallFeaturesDao;

    @GetMapping(value = "/list",  produces = "application/json")
    public List<HallFeatures> getAllData(){
        return hallFeaturesDao.findAll();
    }
}
