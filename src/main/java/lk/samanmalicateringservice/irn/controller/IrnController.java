package lk.samanmalicateringservice.irn.controller;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import jakarta.transaction.Transactional;
import lk.samanmalicateringservice.ingredient.dao.IngredientsDao;
import lk.samanmalicateringservice.ingredient.entity.Ingredients;
import lk.samanmalicateringservice.inventory.dao.InventoryDao;
import lk.samanmalicateringservice.inventory.entity.Inventory;
import lk.samanmalicateringservice.irn.dao.IrnDao;
import lk.samanmalicateringservice.irn.entity.Irn;
import lk.samanmalicateringservice.irn.entity.IrnHasIngredients;
import lk.samanmalicateringservice.privilege.controller.PrivilegeController;
import lk.samanmalicateringservice.privilege.entity.Privilege;
import lk.samanmalicateringservice.user.dao.UserDao;

@RestController
@RequestMapping(value = "/irn")
public class IrnController {

    @Autowired
    private IrnDao irnDao;


    @Autowired
    private InventoryDao inventoryDao;

    @Autowired
    private IngredientsDao ingredientsDao;

    @Autowired
    private UserDao userDao;

    @Autowired
    private PrivilegeController privilegeController;

    @GetMapping(value = "/printall", produces = "application/json")
    public List<Irn> getAllData() {
        // get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // get privilege object using log user and relavent module
        Privilege logUserPrivilege = privilegeController.getPrivilegeByUsernameModule(auth.getName(), "IRN");
        // check privilege
        if (!logUserPrivilege.getPriviselect()) {
            return new ArrayList<Irn>();
        }
        return irnDao.findAll(Sort.by(Direction.DESC, "id"));
    }

    @GetMapping(value = "/getirnbysupplier/{supplierid}")
    public List<Irn> getIrnBySupplier(@PathVariable Integer supplierid){
        return irnDao.getIrnBySupplier(supplierid);
    }

    @RequestMapping
    public ModelAndView irnUi() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        ModelAndView irnView = new ModelAndView();
        irnView.addObject("logusername", auth.getName());
        irnView.addObject("title", "IRN : Samanmali Catering");
        irnView.addObject("activeOne", "irn");
        irnView.setViewName("irn.html");
        return irnView;
    }

    @PostMapping
    @Transactional // table 3k data manage krn nisa mek dagann oni naththm rollback wenneth naa
    // rallback --> table wl data manage krl anthimata system ek tibba thaththweta
    // aaphu wenna kiyn ek
    public String saveIrn(@RequestBody Irn irn) {
        // 1) log user authentication and authorization
        // get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // get privilege object using log user and relavent module
        Privilege logUserPrivilege = privilegeController.getPrivilegeByUsernameModule(auth.getName(), "IRN");
        // check privilege
        if (!logUserPrivilege.getPriviinsert()) {
            return "Save not Completed... :you haven't permission..!";
        }
        // 2) duplicate check
        // lombok eken hdn getter setters wlin---> mokend krnn kiyl ahnn

        // methana error ekk aawoth ek catch krl lssanata error msg ek pennd oni nisa
        // tmi try catch ek dagann
        try {
            // 3)set auto generated values
            // set date time
            irn.setAddeddatetime(LocalDateTime.now());
            irn.setAddeduser_id(userDao.getByUserName(auth.getName()).getId());

            // set irncode
            String nextIrnCode = irnDao.getNextIrnCode();
            if (nextIrnCode.equals(null) || nextIrnCode.equals("")) {
                irn.setIrncode("IRN0001");
            } else {
                irn.setIrncode(nextIrnCode);
            }

            String nextSpBill = irnDao.getNextSupBillNumber();
            if (nextSpBill.equals(null) || nextSpBill.equals("")) {
                irn.setSupplierbillnumber("ISB20240001");
            } else {
                irn.setSupplierbillnumber(nextSpBill);
            }

            // mek dann isslla purchaceorder_id ek block krnonh infinity recursion ekk ena
            // nisa, ek block krlm tibila hariyann naa save krgnnd ek required nisa, itim me
            // widihata ek dala save krgnnd oni
            for (IrnHasIngredients irning : irn.getIrnhasingredientslist()) {
                irning.setIrn_id(irn);
            }

            // irn ekt payment ekk krama mek auto fill wenn oni
            irn.setPaidamount(BigDecimal.ZERO);

            // add/save una grnn object ek ==> newIrn
            Irn newIrn = irnDao.save(irn);
            // nedd to update Ing Inventory
            // irn eke tiyen ing tika allannd oni
            for (IrnHasIngredients newirning : newIrn.getIrnhasingredientslist()) {

                Inventory extInventory = inventoryDao.getByIng(newirning.getIngredients_id().getId());

                // Ingredients eke unit price ek update krnn oni anthimata api IRN ekt daana Unit price ekt adaalawa
                Ingredients recivedIngredients = ingredientsDao.getReferenceById(newirning.getIngredients_id().getId());
                recivedIngredients.setUnitprice(newirning.getUnit_price());
                ingredientsDao.save(recivedIngredients);

                //
                if (extInventory == null) {
                    Inventory newInventory = new Inventory();
                    // mekata value set krnnd oni
                    newInventory.setIngredients_id(newirning.getIngredients_id());
                    newInventory.setReservedate(newIrn.getReservedate());
                    newInventory.setExpiredate(newirning.getExpiredate());
                    newInventory.setBatch_number(newirning.getBatch_number());
                    newInventory.setTotalqty(newirning.getQuantity());
                    newInventory.setIrn_id(newIrn);
                    newInventory.setAvailableqty(newirning.getQuantity());
                    newInventory.setRemoveqty(BigDecimal.ZERO);

                    inventoryDao.save(newInventory);
                } else {
                    // bigdecimal wl kawadawath +,-,/,* baa -- ekt .add,.multiple wge ewa tiyeno
                    extInventory.setAvailableqty(extInventory.getAvailableqty().add(newirning.getQuantity()));
                    extInventory.setTotalqty(extInventory.getTotalqty().add(newirning.getQuantity())); // adu wena ewath me wge hadann
                    inventoryDao.save(extInventory);
                    // garbage removale eketh me wge tmi wenn
                }
            }
            return "OK";
        } catch (Exception e) {
            return "save not completed: " + e.getMessage();
        }
    }

    /* // mekt update delete oni naa
    // kiuwa-----------------------------------!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    @PutMapping
    public String updateIrn(@RequestBody Irn irn) {
        // 1) log user authentication and authorization
        // get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // get privilege object using log user and relavent module
        Privilege logUserPrivilege = privilegeController.getPrivilegeByUsernameModule(auth.getName(), "IRN");
        // check privilege
        if (!logUserPrivilege.getPriviinsert()) {
            return "Update not Completed... :you haven't permission..!";
        }
        // 2) existing check
        Irn extIrn = irnDao.getReferenceById(irn.getId());
        if (extIrn == null) {
            return "Update not completed : This IRN Detail not exist..!!!";
        }
        // duplicate check
        try {
            irn.setUpdatedatetime(LocalDateTime.now());
            irn.setUpdateuser_id(userDao.getByUserName(auth.getName()).getId());
            // mek dann isslla purchaceorder_id ek block krnonh infinity recursion ekk ena
            // nisa, ek block krlm tibila hariyann naa save krgnnd ek required nisa, itim me
            // widihata ek dala save krgnnd oni
            for (IrnHasIngredients irning : irn.getIrnhasingredientslist()) {
                irning.setIrn_id(irn);
            }

            irnDao.save(irn);
            return "OK";
        } catch (Exception e) {
            return "Update not completed" + e.getMessage();
        }
    }

    @DeleteMapping
    public String deleteIrn(@RequestBody Irn irn) {
        // get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // get privilege object using log user and relavent module
        Privilege logUserPrivilege = privilegeController.getPrivilegeByUsernameModule(auth.getName(), "IRN");
        // check privilege
        if (!logUserPrivilege.getPriviinsert()) {
            return "Delete not Completed... :you haven't permission..!";
        }
        // 1)check if that irn ext
        Irn extIrn = irnDao.getReferenceById(irn.getId());
        if (extIrn == null) {
            return "Delete NOT completed : This IRN does not exist";
        }
        try {
            extIrn.setDeletedatetime(LocalDateTime.now());
            extIrn.setDeleteuser_id(userDao.getByUserName(auth.getName()).getId());
            // soft delete (change the status)
            IrnStatus deleteStatus = irnStatusDao.getReferenceById(2);
            extIrn.setIrnstatus_id(deleteStatus);

            irnDao.save(extIrn);
            return "OK";
        } catch (Exception e) {
            return "Delete not Completed :" + e.getMessage();
        }
    }
    */

}
 