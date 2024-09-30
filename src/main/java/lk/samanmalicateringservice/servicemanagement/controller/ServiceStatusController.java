package lk.samanmalicateringservice.servicemanagement.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lk.samanmalicateringservice.servicemanagement.dao.ServiceStatusDao;
import lk.samanmalicateringservice.servicemanagement.entity.ServiceStatus;

@RestController
@RequestMapping(value = "/servicestatus")
public class ServiceStatusController {

    @Autowired
    private ServiceStatusDao serviceStatusDao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<ServiceStatus> getAllData() {
        return serviceStatusDao.findAll();
    }

}
