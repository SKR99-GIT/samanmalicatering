package lk.samanmalicateringservice.irn.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lk.samanmalicateringservice.irn.dao.IrnStatusDao;
import lk.samanmalicateringservice.irn.entity.IrnStatus;

@RestController
@RequestMapping(value = "/irnstatus")
public class IrnStatusController {
    
    @Autowired
    private IrnStatusDao irnStatusDao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<IrnStatus> getAllData(){
        return irnStatusDao.findAll();
    }
}
