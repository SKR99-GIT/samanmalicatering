package lk.samanmalicateringservice.user.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lk.samanmalicateringservice.user.dao.RoleDao;
import lk.samanmalicateringservice.user.entity.Role;

@RestController
@RequestMapping(value = "/role")
public class RoleController {
    
    @Autowired
    private RoleDao roleDao;

    @GetMapping(value = "/list" , produces = "application/json")
    public List<Role> getAllData(){
        return roleDao.findAll();
    }

    @GetMapping(value = "/getRoleListWithoutAdmin" , produces = "application/json")
    public List<Role> getWithoutAdmin(){
        return roleDao.getRoleListWithoutAdmin();
    }
}
