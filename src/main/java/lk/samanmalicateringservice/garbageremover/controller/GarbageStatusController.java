package lk.samanmalicateringservice.garbageremover.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lk.samanmalicateringservice.garbageremover.dao.GarbageStatusDao;
import lk.samanmalicateringservice.garbageremover.entity.GarbageStatus;

@RestController
@RequestMapping(value = "/garbagestatus")
public class GarbageStatusController {
    
    @Autowired
    private GarbageStatusDao garbageStatusDao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<GarbageStatus> getAllData(){
        return garbageStatusDao.findAll();
    }
}
