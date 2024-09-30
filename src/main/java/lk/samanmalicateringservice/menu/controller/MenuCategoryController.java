package lk.samanmalicateringservice.menu.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lk.samanmalicateringservice.menu.dao.MenuCategoryDao;
import lk.samanmalicateringservice.menu.entity.MenuCategory;

@RestController
@RequestMapping(value = "/menucategory")
public class MenuCategoryController {
    
    @Autowired
    private MenuCategoryDao menuCategoryDao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<MenuCategory> getAllData(){
        return menuCategoryDao.findAll();
    }
}
