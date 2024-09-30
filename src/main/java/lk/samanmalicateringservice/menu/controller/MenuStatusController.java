package lk.samanmalicateringservice.menu.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lk.samanmalicateringservice.menu.dao.MenuStatusDao;
import lk.samanmalicateringservice.menu.entity.MenuStatus;

@RestController
@RequestMapping(value = "/menustatus")
public class MenuStatusController {
    
    @Autowired
    private MenuStatusDao menuStatusDao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<MenuStatus> getAllData(){
        return menuStatusDao.findAll();
    }
}
