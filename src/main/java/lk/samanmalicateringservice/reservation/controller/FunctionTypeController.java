package lk.samanmalicateringservice.reservation.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lk.samanmalicateringservice.reservation.dao.FunctionTypeDao;
import lk.samanmalicateringservice.reservation.entity.FunctionType;

@RestController
@RequestMapping(value = "/functiontype")
public class FunctionTypeController {
    
    @Autowired
    private FunctionTypeDao functionTypeDao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<FunctionType> getAllData(){
        return functionTypeDao.findAll();
    }

}
