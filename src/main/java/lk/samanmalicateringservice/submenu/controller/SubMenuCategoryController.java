package lk.samanmalicateringservice.submenu.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lk.samanmalicateringservice.submenu.dao.SubMenuCategoryDao;
import lk.samanmalicateringservice.submenu.entity.SubMenuCategory;

@RestController
@RequestMapping(value = "/submenucategory")
public class SubMenuCategoryController {

    @Autowired
    private SubMenuCategoryDao subMenuCategoryDao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<SubMenuCategory> getAllData(){
        return subMenuCategoryDao.findAll();
    }
}
