package lk.samanmalicateringservice.login.controller;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import lk.samanmalicateringservice.employee.dao.EmployeeDao;
import lk.samanmalicateringservice.employee.entity.Employee;
import lk.samanmalicateringservice.user.dao.RoleDao;
import lk.samanmalicateringservice.user.dao.UserDao;
import lk.samanmalicateringservice.user.entity.Role;
import lk.samanmalicateringservice.user.entity.User;

@RestController
public class LoginController {

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @Autowired
    private UserDao userDao;

    @Autowired
    private RoleDao roleDao;

    @Autowired
    private EmployeeDao employeeDao;
    
@GetMapping(value = "/login")
public ModelAndView loginUi(){
    ModelAndView loginView = new ModelAndView();
    loginView.setViewName("login.html");
    return loginView;
}

 @GetMapping(value = "/error")
 public ModelAndView errorUi(){
    ModelAndView errorView = new ModelAndView();
    errorView.setViewName("error.html");
    return errorView;
 }

@GetMapping(value = "/dashboard")
public ModelAndView dashboardUi(){
    //create authentication object for get logged user details from security context (Authentication/SecurityContextHolder kiyn package use krgnno mekt)
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    ModelAndView dashboardView = new ModelAndView();
    //log wela inn kenage details tika gnn mehem
    dashboardView.addObject("logusername", auth.getName());
    dashboardView.addObject("title", "Dashboard : Samanmali Catering");
    dashboardView.addObject("activeOne", "dashboard");
    dashboardView.setViewName("dashboard.html");
    return dashboardView;
}

    // mek oni thanaka hdnn puluwn
    // classlevel mapping ek nathi thanaka hdnn
    @GetMapping(value = "/createadmin")
    public String generateAdminAccount() {

        User extAdminUser = userDao.getByUserName("Admin");
        if (extAdminUser == null) {
            // onim ekk object ekk hdnonm eke constructor ek hdgnnd oni
            //create admin user
            User adminUser = new User();// create empty user object
            adminUser.setUsername("Admin");
            adminUser.setPassword(bCryptPasswordEncoder.encode("12345"));
            adminUser.setEmail("admin@email.com");
            adminUser.setStatus(true);
            adminUser.setAddeddatetime(LocalDateTime.now());

            Employee adminEmployee = employeeDao.getReferenceById(10);
            adminUser.setEmployee_id(adminEmployee);

            Set<Role> userRoles = new HashSet<>();
            userRoles.add(roleDao.getReferenceById(1));
            adminUser.setRoles(userRoles);

            userDao.save(adminUser);
        }

        return "<script> window.location.replace('/login'); </script>";
    }
}
