package lk.samanmalicateringservice.privilege.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lk.samanmalicateringservice.privilege.dao.ModuleDao;
import lk.samanmalicateringservice.privilege.entity.Module;

import org.springframework.web.bind.annotation.GetMapping;


@RestController
@RequestMapping("/module")
public class ModuleController {
    
    @Autowired
    private ModuleDao moduleDao;

    //jparepository eke deafult ena function ekknh findall kiynn ek nisa ek hdnn deyk naane dao eke(mathakai nd)
    @GetMapping(value = "/list" , produces = "application/json")
    public List<Module> getAllData() {
        return moduleDao.findAll();
    }

    //get mapping for get module data by given roleid [/module/listbyrole?roleid=1]
    @GetMapping(value = "/listbyrole" , params = {"roleid"})
    public List<Module> getByRole(@RequestParam("roleid") Integer roleid){
        return moduleDao.getModuleByRole(roleid);
    }
}
