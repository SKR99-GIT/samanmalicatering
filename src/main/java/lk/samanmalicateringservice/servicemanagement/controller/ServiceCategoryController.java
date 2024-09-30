package lk.samanmalicateringservice.servicemanagement.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lk.samanmalicateringservice.servicemanagement.dao.ServiceCategoryDao;
import lk.samanmalicateringservice.servicemanagement.entity.ServiceCategory;

@RestController
@RequestMapping(value = "/servicecategory")
public class ServiceCategoryController {
    
    @Autowired
    private ServiceCategoryDao serviceCategoryDao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<ServiceCategory> getAllData(){
        return serviceCategoryDao.findAll();
    }
}
