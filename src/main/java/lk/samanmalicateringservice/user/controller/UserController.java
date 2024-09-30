package lk.samanmalicateringservice.user.controller;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
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
import lk.samanmalicateringservice.user.dao.UserDao;
import lk.samanmalicateringservice.user.entity.User;

@RestController
@RequestMapping(value = "/user") // class level mapping
public class UserController {

    @Autowired
    private UserDao userDao;

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @Autowired
    private PrivilegeController privilegeController;

    @GetMapping(value = "/printall", produces = "application/json")
    public List<User> getAllData() {
        // get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // get privilege object using log user and relavent module
        Privilege logUserPrivilege = privilegeController.getPrivilegeByUsernameModule(auth.getName(), "USER");
        // check privilege
        if (!logUserPrivilege.getPriviselect()) {
            return new ArrayList<User>();
        }
        return userDao.findAll(Sort.by(Direction.DESC, "id"));
    }

    @RequestMapping
    public ModelAndView userUi() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        ModelAndView userView = new ModelAndView();
        userView.addObject("logusername", auth.getName());
        userView.addObject("title", "User : Samanmali Catering");
        userView.addObject("activeOne", "user");
        userView.setViewName("user.html");
        return userView;
    }

    // create mapping for save user
    @PostMapping
    public String saveUser(@RequestBody User user) {

        // 1) log user authentication and authorization
        // get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // get privilege object using log user and relavent module
        Privilege logUserPrivilege = privilegeController.getPrivilegeByUsernameModule(auth.getName(), "USER");
        // check privilege
        if (!logUserPrivilege.getPriviinsert()) {
            return "Save not Completed... :you haven't permission..!";
        }

        // 2) check duplicate
        User extUserByEmail = userDao.getUserByEmail(user.getEmail());
        if (extUserByEmail != null) {
            return "Because of, \n Given Email :" + user.getEmail() + " is already exist";
        }
        // ekm username ek tibboth casenh
        User extUserByUserName = userDao.getByUserName(user.getUsername());
        if (extUserByUserName != null) {
            return "Because of, \n Given User Name :" + user.getUsername() + " is already exist";
        }

        try {
            // 3) need set auto generate value
            user.setAddeddatetime(LocalDateTime.now());
            //password encode
            user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
            // operator
            userDao.save(user);
            return "OK";
        } catch (Exception e) {
            return "Save NOT Completed : " + e.getMessage();
        }
    }

    // create mapping for delete user
    @DeleteMapping
    public String deleteUser(@RequestBody User user) {
        // authentication and authorization
         // get logged user authentication object
         Authentication auth = SecurityContextHolder.getContext().getAuthentication();
         // get privilege object using log user and relavent module
         Privilege logUserPrivilege = privilegeController.getPrivilegeByUsernameModule(auth.getName(), "USER");
         // check privilege
         if (!logUserPrivilege.getPrividelete()) {
             return "Delete not Completed... :you haven't permission..!";
         }
        // 1) Check if that user exists
        User extUser = userDao.getReferenceById(user.getId());// getReferenceById ek jparepository ekenmai enn
        if (extUser == null) {
            return "Delete NOT completed : This user does not exist";
        }
        try {
            // soft delete (status ek maaru krno)
            extUser.setStatus(false);
            userDao.save(extUser);
            return "OK";
        } catch (Exception e) {
            return "Delete Not Completed : " + e.getMessage();
        }
    }

    @PutMapping
    public String userUpdate(@RequestBody User user) {
        // authentication and authorization
        // get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // get privilege object using log user and relavent module
        Privilege logUserPrivilege = privilegeController.getPrivilegeByUsernameModule(auth.getName(), "USER");
        // check privilege
        if (!logUserPrivilege.getPriviupdate()) {
            return "Update not Completed... :you haven't permission..!";
        }
        // existing 
        User extUser = userDao.getReferenceById(user.getId());
        if (extUser == null) {
            return "Update not Completed: User not existe...";
        }
        //duplicate check
        User extUserName = userDao.getByUserName(user.getUsername());
        if (extUserName != null && !user.getId().equals(extUserName.getId())) {
            return "Update not complete : User Name already ext!";
        }
        try {
            userDao.save(user);
            return "OK";
        } catch (Exception e) {
            return "Update not completed" + e.getMessage();
        }

    }
}
