package lk.samanmalicateringservice.garbageremover.controller;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import lk.samanmalicateringservice.garbageremover.dao.GarbageDao;
import lk.samanmalicateringservice.garbageremover.dao.GarbageStatusDao;
import lk.samanmalicateringservice.garbageremover.entity.Garbage;
import lk.samanmalicateringservice.garbageremover.entity.GarbageStatus;
import lk.samanmalicateringservice.inventory.dao.InventoryDao;
import lk.samanmalicateringservice.inventory.entity.Inventory;
import lk.samanmalicateringservice.privilege.controller.PrivilegeController;
import lk.samanmalicateringservice.privilege.entity.Privilege;
import lk.samanmalicateringservice.user.dao.UserDao;

@RestController
@RequestMapping(value = "/garbage")
public class GarbageController {

    @Autowired
    private GarbageDao garbageDao;

    @Autowired 
    private GarbageStatusDao garbageStatusDao;

    @Autowired 
    private InventoryDao inventoryDao;

    @Autowired
    private UserDao userDao;

    @Autowired
    private PrivilegeController privilegeController;


    @GetMapping(value = "printall", produces = "application/json")
    public List<Garbage> getAllData() {
         // get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // get privilege object using log user and relavent module
        Privilege logUserPrivilege = privilegeController.getPrivilegeByUsernameModule(auth.getName(), "GARBAGEREMOVAL");
        // check privilege
        if (!logUserPrivilege.getPriviselect()) {
            return new ArrayList<Garbage>();
        }
        return garbageDao.findAll(Sort.by(Direction.DESC, "id"));
    }

    @RequestMapping
    public ModelAndView garbageUi() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        ModelAndView garbageView = new ModelAndView();
        garbageView.addObject("logusername", auth.getName());
        garbageView.addObject("title", "Garbage Removal : Samanmali Catering");
        garbageView.addObject("activeOne", "garbage");
        garbageView.setViewName("garbage.html");
        return garbageView;
    }

    @PostMapping
    public String saveGarbage(@RequestBody Garbage garbage) {
        // 1)log user authentivation and authorization
        // get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // get privilege object using log user and relavent module
        Privilege logUserPrivilege = privilegeController.getPrivilegeByUsernameModule(auth.getName(), "GARBAGEREMOVAL");
        // check privilege
        if (!logUserPrivilege.getPriviinsert()) {
            return "Save not Completed... :you haven't permission..!";
        }
        // 2)duplicate check
        // lombok eken hdn getter setters wlin
        try {
            // 3)set auto generated items
            // set date time
            garbage.setAddeddatetime(LocalDateTime.now());
            garbage.setAddeduser_id(userDao.getByUserName(auth.getName()).getId());

            Garbage completeGarbage = garbageDao.save(garbage);

            Inventory extInventory = inventoryDao.getByIng(completeGarbage.getIngredientinvetory_id().getId());

            if (extInventory != null) {
                extInventory.setRemoveqty(extInventory.getRemoveqty().add(completeGarbage.getQuntity()));
                extInventory.setTotalqty(extInventory.getTotalqty().subtract(completeGarbage.getQuntity()));
                extInventory.setAvailableqty(extInventory.getAvailableqty().subtract(completeGarbage.getQuntity()));
            }
            inventoryDao.save(extInventory);

          /*   //update inv
            Inventory ingredientinvetory =  inventoryDao.getReferenceById(garbage.getIngredientinvetory_id().getId());
            System.out.println(ingredientinvetory);
            //reduce
            ingredientinvetory.setAvailableqty(ingredientinvetory.getAvailableqty().subtract(garbage.getQuntity()));
            inventoryDao.save(ingredientinvetory);
 */
            return "OK";
        } catch (Exception e) {
            return "save not completed: " + e.getMessage();
        }
    }

    @PutMapping
    public String updateGarbage(@RequestBody Garbage garbage){
         //1) log user authentication and authorization
        // get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // get privilege object using log user and relavent module
        Privilege logUserPrivilege = privilegeController.getPrivilegeByUsernameModule(auth.getName(), "GARBAGEREMOVAL");
        // check privilege
        if (!logUserPrivilege.getPriviinsert()) {
            return "Update not Completed... :you haven't permission..!";
        }
        //2) exsting check
        Garbage extGarbage = garbageDao.getReferenceById(garbage.getId());
        if (extGarbage == null) {
            return "Update not completed : Garbage details not exist...!!";
        }
        try {
            garbage.setUpdatedatetime(LocalDateTime.now());
            garbage.setUpdateuser_id(userDao.getByUserName(auth.getName()).getId());

            garbageDao.save(garbage);
            return "OK";
        } catch (Exception e) {
            return "Update not completed" + e.getMessage();
        }
    }

    @DeleteMapping
    public String deleteGarbage(@RequestBody Garbage garbage){
        // get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // get privilege object using log user and relavent module
        Privilege logUserPrivilege = privilegeController.getPrivilegeByUsernameModule(auth.getName(), "GARBAGEREMOVAL");
        // check privilege
        if (!logUserPrivilege.getPriviinsert()) {
            return "Delete not Completed... :you haven't permission..!";
        }
        //1) check if that garbage exists
        Garbage extGarbage = garbageDao.getReferenceById(garbage.getId());
        if (extGarbage == null) {
            return "Delete NOT completed : This Garbage details do not exist";
        }
        try {
            extGarbage.setDeletedatetime(LocalDateTime.now());
            extGarbage.setDeleteuser_id(userDao.getByUserName(auth.getName()).getId());
            //2) soft delete
            GarbageStatus deleteGarbageStatus = garbageStatusDao.getReferenceById(2);
            extGarbage.setGarbageremovalstatus_id(deleteGarbageStatus);

            garbageDao.save(extGarbage);
            return "OK";

        } catch (Exception e) {
            return "Delete not Completed :" +e.getMessage();
        }
    }
}
