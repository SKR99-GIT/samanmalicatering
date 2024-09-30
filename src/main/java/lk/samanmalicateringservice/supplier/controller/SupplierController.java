package lk.samanmalicateringservice.supplier.controller;

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

import lk.samanmalicateringservice.privilege.controller.PrivilegeController;
import lk.samanmalicateringservice.privilege.entity.Privilege;
import lk.samanmalicateringservice.supplier.dao.SupplierDao;
import lk.samanmalicateringservice.supplier.dao.SupplierStatusDao;
import lk.samanmalicateringservice.supplier.entity.Supplier;
import lk.samanmalicateringservice.supplier.entity.SupplierStatus;
import lk.samanmalicateringservice.user.dao.UserDao;

@RestController
@RequestMapping(value = "/supplier")
public class SupplierController {

    @Autowired
    private SupplierDao supplierDao;

    @Autowired
    private SupplierStatusDao supplierStatusDao;

    @Autowired
    private UserDao userDao;

    @Autowired
    private PrivilegeController privilegeController;

    @GetMapping(value = "/printall", produces = "application/json")
    public List<Supplier> getAllData() {
        // get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // get privilege object using log user and relavent module
        Privilege logUserPrivilege = privilegeController.getPrivilegeByUsernameModule(auth.getName(), "SUPPLIER");
        // check privilege
        if (!logUserPrivilege.getPriviselect()) {
            return new ArrayList<Supplier>();
        }
        return supplierDao.findAll(Sort.by(Direction.DESC, "id"));
    }

    @GetMapping("/getactivesupplier")
    public List<Supplier> getActiveSup(){
        return supplierDao.getActiveSupplier();
    }

    @RequestMapping
    public ModelAndView supplierUi() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        ModelAndView supplierView = new ModelAndView();
        supplierView.addObject("logusername", auth.getName());
        supplierView.addObject("title", "Supplier : Samanmali Catering");
        supplierView.addObject("activeOne", "supplier");
        supplierView.setViewName("supplier.html");
        return supplierView;
    }

    @PostMapping
    public String saveSupplier(@RequestBody Supplier supplier) {
        // 1) log user authentication and authorization
        // get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // get privilege object using log user and relavent module
        Privilege logUserPrivilege = privilegeController.getPrivilegeByUsernameModule(auth.getName(), "SUPPLIER");
        // check privilege
        if (!logUserPrivilege.getPriviinsert()) {
            return "Save not Completed... :you haven't permission..!";
        }
        // 2) duplicate check -->
        // lombok eken hdn getter setters wlin
        Supplier extSupplierByEmail = supplierDao.getSupplierByEmail(supplier.getEmail());
        if (extSupplierByEmail != null) {
            return "Save Not completed :\n Following Supplier Email " + supplier.getEmail() + " already Ext!";
        }

        // methana error ekk aawoth ek catch krl lssanata error msg ek pennd oni nisa
        // tmi try catch ek dagann
        try {
            // 3) set auto generated items
            // set date and time
            supplier.setAddeddatetime(LocalDateTime.now());
            supplier.setAddeduser_id(userDao.getByUserName(auth.getName()).getId());

            // set supnumber
            String nextSupNumber = supplierDao.getNextSupNumber();
            if (nextSupNumber.equals(null) || nextSupNumber.equals("")) {
                supplier.setSupnumber("S0001");
            } else {
                supplier.setSupnumber(nextSupNumber);
            }
            supplierDao.save(supplier);
            return "OK";
        } catch (Exception e) {
            return "save not completed: " + e.getMessage();
        }
    }

    // create a post mapping for save menu
    @PutMapping
    public String updateSupplier(@RequestBody Supplier supplier) {
        // 1) log user authentication and authorization
         // get logged user authentication object
         Authentication auth = SecurityContextHolder.getContext().getAuthentication();
         // get privilege object using log user and relavent module
         Privilege logUserPrivilege = privilegeController.getPrivilegeByUsernameModule(auth.getName(), "SUPPLIER");
         // check privilege
         if (!logUserPrivilege.getPriviupdate()) {
             return "Update not Completed... :you haven't permission..!";
         }
        // 2) existing check
        Supplier extSupplier = supplierDao.getReferenceById(supplier.getId());
        if (extSupplier == null) {
            return "Update not completed : Menu not exist...!!";
        }
        // 3) duplicate check
        Supplier extSupByEmail = supplierDao.getSupplierByEmail(supplier.getEmail());
        if (extSupByEmail != null && extSupByEmail.getId() != supplier.getId()) {
            return "Update Not completed :\n Following email " + supplier.getEmail() + " already Ext!";
        }
        try {
            supplier.setUpdatedatetime(LocalDateTime.now());
            supplier.setUpdateuser_id(userDao.getByUserName(auth.getName()).getId());
            supplierDao.save(supplier);
            return "OK";
        } catch (Exception e) {
            return "Update not completed" + e.getMessage();
        }
    }

    @DeleteMapping
    public String deleteSupplier(@RequestBody Supplier supplier) {
         // get logged user authentication object
         Authentication auth = SecurityContextHolder.getContext().getAuthentication();
         // get privilege object using log user and relavent module
         Privilege logUserPrivilege = privilegeController.getPrivilegeByUsernameModule(auth.getName(), "SUPPLIER");
         // check privilege
         if (!logUserPrivilege.getPrividelete()) {
             return "Delete not Completed... :you haven't permission..!";
         }
        // 1)check if this supplier ext
        Supplier extSupplier = supplierDao.getReferenceById(supplier.getId());
        if (extSupplier == null) {
            return "Delete NOT completed : This Supplier does not exist";
        }
        try {
            extSupplier.setDeletedatetime(LocalDateTime.now());
            extSupplier.setDeleteuser_id(userDao.getByUserName(auth.getName()).getId());
            // soft delete (change the status)
            SupplierStatus deleteStatus = supplierStatusDao.getReferenceById(2);
            extSupplier.setSupplierstatus_id(deleteStatus);

            supplierDao.save(extSupplier);
            return "OK";
        } catch (Exception e) {
            return "Delete not Completed :" + e.getMessage();
        }
    }
}
