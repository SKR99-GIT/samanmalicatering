package lk.samanmalicateringservice.functionhall.controller;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
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

import lk.samanmalicateringservice.functionhall.dao.HallDao;
import lk.samanmalicateringservice.functionhall.dao.HallStatusDao;
import lk.samanmalicateringservice.functionhall.entity.Hall;
import lk.samanmalicateringservice.functionhall.entity.HallStatus;
import lk.samanmalicateringservice.privilege.controller.PrivilegeController;
import lk.samanmalicateringservice.privilege.entity.Privilege;
import lk.samanmalicateringservice.user.dao.UserDao;

@RestController
@RequestMapping(value = "/hall")
public class HallController {

    @Autowired
    private HallDao hallDao;

    @Autowired
    private HallStatusDao hallStatusDao;

    @Autowired
    private UserDao userDao;

    @Autowired
    private PrivilegeController privilegeController;

    @GetMapping(value = "/printall", produces = "application/json")
    public List<Hall> getAllData() {
        // get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // get privilege object using log user and relavent module
        Privilege logUserPrivilege = privilegeController.getPrivilegeByUsernameModule(auth.getName(), "FUNCTIONHALL");
        // check privilege
        if (!logUserPrivilege.getPriviselect()) {
            return new ArrayList<Hall>();
        }
        return hallDao.findAll(Sort.by(Direction.DESC, "id"));
    }

    @RequestMapping
    public ModelAndView hallUi() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        ModelAndView hallView = new ModelAndView();
        hallView.addObject("logusername", auth.getName());
        hallView.addObject("title", "Hall : Samanmali Catering");
        hallView.addObject("activeOne", "hall");
        hallView.setViewName("hall.html");
        return hallView;
    }

    // create a post mapping fro save hall
    @PostMapping
    // ajax eke body eke tmi data tika enn kiyl kiynnd tmi @RequestBody dann
    public String saveHall(@RequestBody Hall hall) {
        // 1) log user authentication and authorization
        // get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // get privilege object using log user and relavent module
        Privilege logUserPrivilege = privilegeController.getPrivilegeByUsernameModule(auth.getName(), "FUNCTIONHALL");
        // check privilege
        if (!logUserPrivilege.getPriviinsert()) {
            return "Save not Completed... :you haven't permission..!";
        }
        // 2) duplicate check
        // lombok eken hdn getter setters wlin
        Hall extHallByName = hallDao.getHallByName(hall.getName());
        if (extHallByName != null) {
            return "Save Not completed :\n Following Hall " + hall.getName() + " already Ext!";
        }
        // methana error ekk aawoth ek catch krl lssanata error msg ek pennd oni nisa
        // tmi try catch ek dagann
        try {
            hall.setAddeddatetime(LocalDateTime.now());
            hall.setAddeduser_id(userDao.getByUserName(auth.getName()).getId());
            hallDao.save(hall);
            return "OK";
        } catch (Exception e) {
            return "save not completed: " + e.getMessage();
        }
    }

    @GetMapping(value = "/getavailablehall/{functiondate}/{functionstarttime}/{functionendtime}/{maxparticipantcount}", produces = "application/json")
    public List<Hall> getAvailableHallByDateTimeMaxCount(@PathVariable ("functiondate") LocalDate functiondate, @PathVariable("functionstarttime") LocalTime functionstarttime, @PathVariable ("functionendtime") LocalTime functionendtime, @PathVariable ("maxparticipantcount") Integer maxparticipantcount) {
        return hallDao.getAvailableHall(functiondate, functionstarttime, functionendtime, maxparticipantcount);
    }

    @PutMapping
    public String updateHall(@RequestBody Hall hall) {
        // 1) log user authentication and authorization
        // get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // get privilege object using log user and relavent module
        Privilege logUserPrivilege = privilegeController.getPrivilegeByUsernameModule(auth.getName(), "FUNCTIONHALL");
        // check privilege
        if (!logUserPrivilege.getPriviupdate()) {
            return "Update not Completed... :you haven't permission..!";
        }
        // 2) exsting check
        Hall extHall = hallDao.getReferenceById(hall.getId());
        if (extHall == null) {
            return "Update not completed : Hall not exist..!!!";
        }
        // 3)duplicate check
        Hall extHallByName = hallDao.getHallByName(hall.getName());
        if (extHallByName != null && extHallByName.getId() != hall.getId()) {
            return "Update Not completed :\n Following Hall " + hall.getName() + " already Ext!";
        }
        try {
            hall.setUpdatedatetime(LocalDateTime.now());
            hall.setUpdateuser_id(userDao.getByUserName(auth.getName()).getId());
            hallDao.save(hall);
            return "OK";
        } catch (Exception e) {
            return "Update not completed" + e.getMessage();
        }
    }

    @DeleteMapping
    public String deleteHall(@RequestBody Hall hall) {
        // 1)check if that hall exists
         // get logged user authentication object
         Authentication auth = SecurityContextHolder.getContext().getAuthentication();
         // get privilege object using log user and relavent module
         Privilege logUserPrivilege = privilegeController.getPrivilegeByUsernameModule(auth.getName(), "FUNCTIONHALL");
         // check privilege
         if (!logUserPrivilege.getPrividelete()) {
             return "Delete not Completed... :you haven't permission..!";
         }
        Hall extHall = hallDao.getReferenceById(hall.getId());
        if (extHall == null) {
            return "Delete NOT completed : This Hall does not exist";
        }
        try {
            extHall.setDeletedatetime(LocalDateTime.now());
            extHall.setDeleteuser_id(userDao.getByUserName(auth.getName()).getId());

            // 2)soft delete (change the status)
            HallStatus deleteStatus = hallStatusDao.getReferenceById(2);
            extHall.setHallstatus_id(deleteStatus);

            hallDao.save(extHall);
            return "OK";
        } catch (Exception e) {
            return "Delete not Completed :" + e.getMessage();
        }
    }
}
