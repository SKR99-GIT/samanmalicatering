package lk.samanmalicateringservice.menu.controller;

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

import lk.samanmalicateringservice.menu.dao.MenuDao;
import lk.samanmalicateringservice.menu.dao.MenuStatusDao;
import lk.samanmalicateringservice.menu.entity.Menu;
import lk.samanmalicateringservice.menu.entity.MenuStatus;
import lk.samanmalicateringservice.privilege.controller.PrivilegeController;
import lk.samanmalicateringservice.privilege.entity.Privilege;
import lk.samanmalicateringservice.user.dao.UserDao;

@RestController
@RequestMapping(value = "/menu")
public class MenuController {

    @Autowired
    private MenuDao menuDao;

    @Autowired
    private MenuStatusDao menuStatusDao;

    @Autowired
    private UserDao userDao;

    @Autowired
    private PrivilegeController privilegeController;

    @GetMapping(value = "/printall", produces = "application/json")
    public List<Menu> getAllData() {
        // get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // get privilege object using log user and relavent module
        Privilege logUserPrivilege = privilegeController.getPrivilegeByUsernameModule(auth.getName(), "MENU");
        // check privilege
        if (!logUserPrivilege.getPriviselect()) {
            return new ArrayList<Menu>();
        }
        return menuDao.findAll(Sort.by(Direction.DESC, "id"));
    }

    @GetMapping(value = "/getmenunamebyfunctiontype{functiontypeid}")
    public List<Menu> getMenuNameByFun(@PathVariable Integer
    functiontypeid) {
        return menuDao.getMenuNameByFunctionType(functiontypeid);
    }

    @RequestMapping
    public ModelAndView menuUi() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        ModelAndView menuView = new ModelAndView();
        menuView.addObject("logusername", auth.getName());
        menuView.addObject("title", "Menu : Samanmali Catering");
        menuView.addObject("activeOne", "menu");
        menuView.setViewName("menu.html");
        return menuView;
    }

    // create a post mapping for save menu
    @PostMapping
    public String SaveMenu(@RequestBody Menu menu) {
        // 1) log user authentication and authorization
        // get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // get privilege object using log user and relavent module
        Privilege logUserPrivilege = privilegeController.getPrivilegeByUsernameModule(auth.getName(), "MENU");
        // check privilege
        if (!logUserPrivilege.getPriviinsert()) {
            return "Save not Completed... :you haven't permission..!";
        }
        // 2) duplicate check --> mt krnnd oni e name eken e categoryt tiyenn mek
        // withrai kiynnd, ek krn nkhmd kiyl ahgnnd
        // lombok eken hdn getter setters wlin
        try {
            menu.setAddeddatetime(LocalDateTime.now());
            menu.setAddeduser_id(userDao.getByUserName(auth.getName()).getId());
            menuDao.save(menu);
            return "OK";
        } catch (Exception e) {
            return "save not completed: " + e.getMessage();
        }
    }

    @PutMapping
    public String updateMenu(@RequestBody Menu menu) {
        // 1) log user authentication and authorization
        // get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // get privilege object using log user and relavent module
        Privilege logUserPrivilege = privilegeController.getPrivilegeByUsernameModule(auth.getName(), "MENU");
        // check privilege
        if (!logUserPrivilege.getPriviinsert()) {
            return "Update not Completed... :you haven't permission..!";
        }
        // 2) existing check
        Menu extMenu = menuDao.getReferenceById(menu.getId());
        if (extMenu == null) {
            return "Update not completed : Menu not exist...!!";
        }
        // 3) duplicate check
        try {
            menu.setUpdatedatetime(LocalDateTime.now());
            menu.setUpdateuser_id(userDao.getByUserName(auth.getName()).getId());
            menuDao.save(menu);
            return "OK";
        } catch (Exception e) {
            return "Update not completed" + e.getMessage();
        }
    }

    @DeleteMapping
    public String deleteMenu(@RequestBody Menu menu) {
        // get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // get privilege object using log user and relavent module
        Privilege logUserPrivilege = privilegeController.getPrivilegeByUsernameModule(auth.getName(), "MENU");
        // check privilege
        if (!logUserPrivilege.getPriviinsert()) {
            return "Delete not Completed... :you haven't permission..!";
        }
        // 1)check if this menu ext
        Menu extMenu = menuDao.getReferenceById(menu.getId());
        if (extMenu == null) {
            return "Delete NOT completed : This Menu does not exist";
        }
        try {
            extMenu.setDeletedatetime(LocalDateTime.now());
            extMenu.setDeleteuser_id(userDao.getByUserName(auth.getName()).getId());
            // soft delete (change the status)
            MenuStatus deleteStatus = menuStatusDao.getReferenceById(2);
            extMenu.setMenustatus_id(deleteStatus);

            menuDao.save(extMenu);
            return "OK";
        } catch (Exception e) {
            return "Delete not Completed :" + e.getMessage();
        }
    }
}
