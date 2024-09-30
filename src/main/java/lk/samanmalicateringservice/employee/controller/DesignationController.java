package lk.samanmalicateringservice.employee.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import lk.samanmalicateringservice.employee.dao.DesignationDao;
import lk.samanmalicateringservice.employee.entity.Designation;

@RestController
public class DesignationController {
    
    @Autowired
    private DesignationDao designationDao;

    @GetMapping(value = "/designation/list", produces = "application/json")
    public List <Designation> getAllData(){
        return designationDao.findAll();
    }
}
