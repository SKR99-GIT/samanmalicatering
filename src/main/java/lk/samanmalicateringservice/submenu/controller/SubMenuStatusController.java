package lk.samanmalicateringservice.submenu.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lk.samanmalicateringservice.submenu.dao.SubMenuStatusDao;
import lk.samanmalicateringservice.submenu.entity.SubMenuStatus;

@RestController
@RequestMapping(value = "/submenustatus")
public class SubMenuStatusController {
    
    @Autowired
    private SubMenuStatusDao subMenuStatusDao;

    @GetMapping(value = "/list",produces = "application/json")
    public List<SubMenuStatus> getAllData(){
        return subMenuStatusDao.findAll();
    }
}
