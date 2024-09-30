package lk.samanmalicateringservice.porder.controller;

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
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import lk.samanmalicateringservice.porder.dao.PorderDao;
import lk.samanmalicateringservice.porder.dao.PorderStatusDao;
import lk.samanmalicateringservice.porder.entity.Porder;
import lk.samanmalicateringservice.porder.entity.PorderStatus;
import lk.samanmalicateringservice.porder.entity.PurchaseorderHasIngredients;
import lk.samanmalicateringservice.privilege.controller.PrivilegeController;
import lk.samanmalicateringservice.privilege.entity.Privilege;
import lk.samanmalicateringservice.user.dao.UserDao;

@RestController
@RequestMapping(value = "/porder")
public class PorderController {

    @Autowired
    private PorderDao porderDao;

    @Autowired
    private PorderStatusDao porderStatusDao;

    @Autowired
    private UserDao userDao;

    @Autowired
    private PrivilegeController privilegeController;

    @GetMapping(value = "/printall", produces = "application/json")
    public List<Porder> getAllData() {
        // get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // get privilege object using log user and relavent module
        Privilege logUserPrivilege = privilegeController.getPrivilegeByUsernameModule(auth.getName(), "PORDER");
        // check privilege
        if (!logUserPrivilege.getPriviselect()) {
            return new ArrayList<Porder>();
        }
        return porderDao.findAll(Sort.by(Direction.DESC, "id"));
    }

    // IRN from eke supplier gen eyage porder tika gann meken
    @GetMapping(value = "/getporderbysupplier{supplierid}")
    public List<Porder> getPorderBySup(@PathVariable Integer supplierid) {
        return porderDao.getPorderBySupplier(supplierid);
    }

    @RequestMapping
    public ModelAndView porderUi() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        ModelAndView porderView = new ModelAndView();
        porderView.addObject("logusername", auth.getName());
        porderView.addObject("title", "Porder : Samanmali Catering");
        porderView.addObject("activeOne", "porder");
        porderView.setViewName("IngredientPurchase.html");
        return porderView;
    }

    @PostMapping
    public String savePorder(@RequestBody Porder porder) {
        // 1) log user authentication and authorization
        // get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // get privilege object using log user and relavent module
        Privilege logUserPrivilege = privilegeController.getPrivilegeByUsernameModule(auth.getName(), "PORDER");
        // check privilege
        if (!logUserPrivilege.getPriviinsert()) {
            return "Save not Completed... :you haven't permission..!";
        }
        // 2) duplicate check
        // lombok eken hdn getter setters wlin
        try {
            // 3)set auto generated items
            // set date time
            porder.setAddeddatetime(LocalDateTime.now());
            porder.setAddeduser_id(userDao.getByUserName(auth.getName()).getId());

            // set code
            String nextPoCode = porderDao.getNextPOCode();
            if (nextPoCode.equals(null) || nextPoCode.equals("")) {
                porder.setPordercode("PO2024001");
            } else {
                porder.setPordercode(nextPoCode);
            }

            // mek dann isslla purchaceorder_id ek block krnonh infinity recursion ekk ena
            // nisa, ek block krlm tibila hariyann naa save krgnnd ek required nisa, itim me
            // widihata ek dala save krgnnd oni
            for (PurchaseorderHasIngredients poing : porder.getPurchaseorderhasingredientslist()) {
                poing.setPurchaseorder_id(porder);
            }

            porderDao.save(porder);
            return "OK";
        } catch (Exception e) {
            return "save not completed: " + e.getMessage();
        }
    }

    @PutMapping
    public String updatePorder(@RequestBody Porder porder) {
        // 1) log user authentication and authorization
        // get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // get privilege object using log user and relavent module
        Privilege logUserPrivilege = privilegeController.getPrivilegeByUsernameModule(auth.getName(), "PORDER");
        // check privilege
        if (!logUserPrivilege.getPriviinsert()) {
            return "Update not Completed... :you haven't permission..!";
        }
        // 2) existing check
        Porder extPorder = porderDao.getReferenceById(porder.getId());
        if (extPorder == null) {
            return "Update not completed : This Porder Detail not exist..!!!";
        }
        try {
            porder.setUpdatedatetime(LocalDateTime.now());
            porder.setUpdateuser_id(userDao.getByUserName(auth.getName()).getId());

            for (PurchaseorderHasIngredients poing : porder.getPurchaseorderhasingredientslist()) {
                poing.setPurchaseorder_id(porder);
            }

            porderDao.save(porder);
            return "OK";
        } catch (Exception e) {
            return "Update not completed" + e.getMessage();
        }
    }

    @DeleteMapping
    public String deletePorder(@RequestBody Porder porder) {
        // get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // get privilege object using log user and relavent module
        Privilege logUserPrivilege = privilegeController.getPrivilegeByUsernameModule(auth.getName(), "PORDER");
        // check privilege
        if (!logUserPrivilege.getPriviinsert()) {
            return "Delete not Completed... :you haven't permission..!";
        }
        // 1)check if that irn ext
        Porder extPorder = porderDao.getReferenceById(porder.getId());
        if (extPorder == null) {
            return "Delete NOT completed : This POrder does not exist";
        }
        try {
            extPorder.setDeletedatetime(LocalDateTime.now());
            extPorder.setDeleteuser_id(userDao.getByUserName(auth.getName()).getId());
            // soft delete (change the status)
            PorderStatus deleteStatus = porderStatusDao.getReferenceById(3);
            extPorder.setPorderstatus_id(deleteStatus);

            for (PurchaseorderHasIngredients poing : porder.getPurchaseorderhasingredientslist()) {
                poing.setPurchaseorder_id(porder);
            }

            porderDao.save(extPorder);
            return "OK";
        } catch (Exception e) {
            return "Delete not Completed :" + e.getMessage();
        }
    }
}
