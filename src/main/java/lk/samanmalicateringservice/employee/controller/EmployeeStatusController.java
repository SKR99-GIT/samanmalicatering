package lk.samanmalicateringservice.employee.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import lk.samanmalicateringservice.employee.dao.EmployeeStatusDao;
import lk.samanmalicateringservice.employee.entity.EmployeeStatus;

@RestController
public class EmployeeStatusController {
    
    @Autowired
    private EmployeeStatusDao employeeStatusDao;

    @GetMapping(value = "/employeestatus/list" , produces = "application/json")
    public List <EmployeeStatus> getAllData(){
        return employeeStatusDao.findAll();
    }
}
