package lk.samanmalicateringservice.submenu.controller;

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

import lk.samanmalicateringservice.privilege.controller.PrivilegeController;
import lk.samanmalicateringservice.privilege.entity.Privilege;
import lk.samanmalicateringservice.submenu.dao.SubMenuDao;
import lk.samanmalicateringservice.submenu.dao.SubMenuStatusDao;
import lk.samanmalicateringservice.submenu.entity.SubMenu;
import lk.samanmalicateringservice.submenu.entity.SubMenuStatus;
import lk.samanmalicateringservice.submenu.entity.SubmenuHasIngredients;
import lk.samanmalicateringservice.user.dao.UserDao;

@RestController
@RequestMapping(value = "/submenu")
public class SubMenuController {

    @Autowired
    private SubMenuDao subMenuDao;

    @Autowired
    private SubMenuStatusDao subMenuStatusDao;

    @Autowired
    private UserDao userDao;

    @Autowired
    private PrivilegeController privilegeController;

    @GetMapping(value = "/printall", produces = "application/json")
    public List<SubMenu> getAllData() {
         // get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // get privilege object using log user and relavent module
        Privilege logUserPrivilege = privilegeController.getPrivilegeByUsernameModule(auth.getName(), "SUBMENU");
        // check privilege
        if (!logUserPrivilege.getPriviselect()) {
            return new ArrayList<SubMenu>();
        }
        return subMenuDao.findAll(Sort.by(Direction.DESC, "id"));
    }

    // menu form eke submenu category eken submenus fiiter krgnn meken
    @GetMapping(value = "/getsubmenubycategory{submenucategoryid}")
    public List<SubMenu> getSubMenuByCat(@PathVariable Integer submenucategoryid) {
        return subMenuDao.GetSubMenuByCategory(submenucategoryid);
    }

    //reservation ekedi menu wlin submenu gann ek
    @GetMapping(value = "/getsubmenubymenu{menuid}")
    public List<SubMenu> getSubByMenu(@PathVariable Integer menuid){
        return subMenuDao.getSubmenuByMenu(menuid);
    }

    @RequestMapping
    public ModelAndView submenuUi() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        ModelAndView submenuView = new ModelAndView();
        submenuView.addObject("logusername", auth.getName());
        submenuView.addObject("title", "Submenu : Samanmali Catering");
        submenuView.addObject("activeOne", "submenu");
        submenuView.setViewName("submenu.html");
        return submenuView;
    }

    @PostMapping
    public String saveSubMenu(@RequestBody SubMenu submenu) {
        // 1) log user authentication and authorization
         // get logged user authentication object
         Authentication auth = SecurityContextHolder.getContext().getAuthentication();
         // get privilege object using log user and relavent module
         Privilege logUserPrivilege = privilegeController.getPrivilegeByUsernameModule(auth.getName(), "SUBMENU");
         // check privilege
         if (!logUserPrivilege.getPriviinsert()) {
             return "Save not Completed... :you haven't permission..!";
         }
        // 2) duplicate check
        // lombok eken hdn getter setters wlin
        SubMenu extSubMenuByName = subMenuDao.getSubMenuByName(submenu.getName());
        if (extSubMenuByName != null) {
            return "Save Not completed :\n Following Sub Menu " + submenu.getName() + " already Ext!";
        }
        try {
            submenu.setAddeddatetime(LocalDateTime.now());
            submenu.setAddeduser_id(userDao.getByUserName(auth.getName()).getId());

              // mek dann isslla purchaceorder_id ek block krnonh infinity recursion ekk ena
            // nisa, ek block krlm tibila hariyann naa save krgnnd ek required nisa, itim me
            // widihata ek dala save krgnnd oni
            for (SubmenuHasIngredients submenuing : submenu.getSubmenuhasingredientslist()) {
                submenuing.setSubmenu_id(submenu);
            }

            subMenuDao.save(submenu);
            return "OK";
        } catch (Exception e) {
            return "save not completed: " + e.getMessage();
        }
    }

    @PutMapping
    public String updateSubMenu(@RequestBody SubMenu submenu) {
        // 1) log user authentication and authorization
         // get logged user authentication object
         Authentication auth = SecurityContextHolder.getContext().getAuthentication();
         // get privilege object using log user and relavent module
         Privilege logUserPrivilege = privilegeController.getPrivilegeByUsernameModule(auth.getName(), "SUBMENU");
         // check privilege
         if (!logUserPrivilege.getPriviupdate()) {
             return "Update not Completed... :you haven't permission..!";
         }
        // 2) existing check
        SubMenu extSubMenu = subMenuDao.getReferenceById(submenu.getId());
        if (extSubMenu == null) {
            return "Update not completed : Sub Menu not exist...!!";
        }
        // 3) duplicate check
        try {
            submenu.setUpdatedatetime(LocalDateTime.now());
            submenu.setUpdateuser_id(userDao.getByUserName(auth.getName()).getId());
            subMenuDao.save(submenu);
            return "OK";
        } catch (Exception e) {
            return "Update not completed" + e.getMessage();
        }
    }

    @DeleteMapping
    public String deleteSubMenu(@RequestBody SubMenu subMenu) {
        // get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // get privilege object using log user and relavent module
        Privilege logUserPrivilege = privilegeController.getPrivilegeByUsernameModule(auth.getName(), "SUBMENU");
        // check privilege
        if (!logUserPrivilege.getPrividelete()) {
            return "Delete not Completed... :you haven't permission..!";
        }
        // 1)check if that sub menu exists
        SubMenu extSubMenu = subMenuDao.getReferenceById(subMenu.getId());
        if (extSubMenu == null) {
            return "Delete NOT completed : This Sub Menu does not exist";
        }
        try {
            extSubMenu.setDeletedatetime(LocalDateTime.now());
            extSubMenu.setDeleteuser_id(userDao.getByUserName(auth.getName()).getId());
            // soft delete (change the status)
            SubMenuStatus deleteStatus = subMenuStatusDao.getReferenceById(2);
            extSubMenu.setSubmenustatus_id(deleteStatus);

            subMenuDao.save(extSubMenu);
            return "OK";
        } catch (Exception e) {
            return "Delete not Completed :" + e.getMessage();
        }
    }
}
