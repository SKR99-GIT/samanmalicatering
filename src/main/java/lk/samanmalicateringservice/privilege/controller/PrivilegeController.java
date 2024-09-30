package lk.samanmalicateringservice.privilege.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;


import lk.samanmalicateringservice.privilege.dao.PrivilegeDao;
import lk.samanmalicateringservice.privilege.entity.Privilege;

@RestController
public class PrivilegeController {

    @Autowired
    private PrivilegeDao privilegeDao;

    @GetMapping(value = "/privilege/printall", produces = "application/json")
    public List<Privilege> getAllData() {
          // get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // get privilege object using log user and relavent module
        Privilege logUserPrivilege = getPrivilegeByUsernameModule(auth.getName(), "PRIVILEGE");
        // check privilege
        if (!logUserPrivilege.getPriviselect()) {
            return new ArrayList<Privilege>();
        }
        return privilegeDao.findAll(Sort.by(Direction.DESC, "id"));
    }

    @RequestMapping(value = "/privilege")
    public ModelAndView privilegeUi() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        ModelAndView privilegView = new ModelAndView();
        privilegView.addObject("logusername", auth.getName());
        privilegView.addObject("title", "Privilege : Samanmali Catering");
        privilegView.addObject("activeOne", "privilege");
        privilegView.setViewName("privilege.html");
        return privilegView;
    }

    // create post mapping for save privilege record
    @PostMapping(value = "/privilege")
    public String savePrivilege(@RequestBody Privilege privilege) {
        // get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // get privilege object using log user and relavent module
        Privilege logUserPrivilege = getPrivilegeByUsernameModule(auth.getName(), "PRIVILEGE");
        // check privilege
        if (!logUserPrivilege.getPriviinsert()) {
            return "Save not Completed... :you haven't permission..!";
        }
        // duplicate
        try {
            Privilege extPrivilege = privilegeDao.getByRoleModule(privilege.getRole_id().getId(),
                    privilege.getModule_id().getId());
            if (extPrivilege != null) {
                return "Save Not Completed : Privilege Already Exist by Given Role and Module";
            }
            // operation
            privilegeDao.save(privilege);
            return "OK";
        } catch (Exception e) {
            return "Save not completed : " + e.getMessage();
        }
    }

    // put mapping for update privilege record
    @PutMapping(value = "/privilege")
    public String updatePrivilege(@RequestBody Privilege privilege) {
        // get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // get privilege object using log user and relavent module
        Privilege logUserPrivilege = getPrivilegeByUsernameModule(auth.getName(), "PRIVILEGE");
        // check privilege
        if (!logUserPrivilege.getPriviinsert()) {
            return "Save not Completed... :you haven't permission..!";
        }
        // check existing
        Privilege extPrivilege = privilegeDao.getReferenceById(privilege.getId());
        if (extPrivilege == null) {
            return "Update not completed : Given privilege record not ext";
        }
        try {
            // opration
            privilegeDao.save(privilege);
            return "OK";
        } catch (Exception e) {
            return "Update Not Completed : " + e.getMessage();
        }
    }

    @DeleteMapping(value = "/privilege")
    public String deletePrivilege(@RequestBody Privilege privilege) {
        // get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // get privilege object using log user and relavent module
        Privilege logUserPrivilege = getPrivilegeByUsernameModule(auth.getName(), "PRIVILEGE");
        // check privilege
        if (!logUserPrivilege.getPriviinsert()) {
            return "Save not Completed... :you haven't permission..!";
        }
        // check existing
        Privilege extPrivilege = privilegeDao.getReferenceById(privilege.getId());
        if (extPrivilege == null) {
            return "Delete not completed : Given privilege record not ext";
        }
        try {
            
            // set auto generated value
            extPrivilege.setPriviselect(false);
            extPrivilege.setPriviinsert(false);
            extPrivilege.setPriviupdate(false);
            extPrivilege.setPrividelete(false);
            // opration
            privilegeDao.save(extPrivilege);
            return "OK";
        } catch (Exception e) {
            return "Delete Not Completed : " + e.getMessage();
        }
    }

    // create get mapping for get privillege by logged user module
    // meken gnn frontend ekt
    @GetMapping(value = "/privilage/bymodule/{modulename}", produces = "application/json") // for frontend
    // modulename ek gann param ekk widihata
    public Privilege getPrivilegeByModule(@PathVariable("modulename") String modulename) {

        // create authentication object for get loged user detail form security context
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return getPrivilegeByUsernameModule(auth.getName(), modulename);
    }

    // for frontend and backend controllers
    public Privilege getPrivilegeByUsernameModule(String username, String modulename) {
        // kud log wenn kiyl balano
        // methana check krno log wenn admind nadd kiyl,log wenn admin nm eyata oni
        // dekata privilege tiyeno
        // yamkisi string value ekk tw string ekkt samanaid kiyl blnn equals wlin
        // log wechcha kena admin nmn eyata privilege bala bala innd oni naa, direct
        // return krnnd oni adminge privilege mehmai kiyl
        if (username.equals("Admin")) {

            Boolean select = true;
            Boolean insert = true;
            Boolean update = true;
            Boolean delete = true;
            // api privilege eke hdgththa privilege constructor ek
            Privilege adminPri = new Privilege(select, insert, update, delete);

            return adminPri;
        } else {
            // log wechcha kenata adalawa record ekk genn gnnd oni
            String priv = privilegeDao.getPrivilegeByUserModule(username, modulename);
            // split eken coma wlin wenn wena ewa kadala arnn array ekkt gnn ek krnn
            String[] priviArray = priv.split(",");
            // meken if else dala line 4kin krgnn wade short form eken mehem krgnnd puluwn
            // false ek autom eno 1 true nm meke class wlin 0 ek false lesa gnnwa
            Boolean select = priviArray[0].equals("1");
            Boolean insert = priviArray[1].equals("1");
            ;
            Boolean update = priviArray[2].equals("1");
            ;
            Boolean delete = priviArray[3].equals("1");
            ;
            Privilege userPri = new Privilege(select, insert, update, delete);
            // return dao.getPrivilegeByUserModule(username, modulename); <-- mehem baa api
            // gnnd oni same type eke object ekk string ekk arnn baa
            return userPri;
        }
        // object format eken genn gannawa apit oni krn CRUD operation set ekm
        // apit hash set ekk hdgenath mek krgnnd puluwn (eken tiyeneth name,value pair
        // ekk)
        // {'select':true, 'insert':true,'update':true,'delete':true }
    }
}
