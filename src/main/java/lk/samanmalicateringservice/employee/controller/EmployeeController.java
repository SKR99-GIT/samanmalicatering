package lk.samanmalicateringservice.employee.controller;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

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

import jakarta.transaction.Transactional;
import lk.samanmalicateringservice.employee.dao.EmployeeDao;
import lk.samanmalicateringservice.employee.dao.EmployeeStatusDao;
import lk.samanmalicateringservice.employee.entity.Employee;
import lk.samanmalicateringservice.employee.entity.EmployeeStatus;
import lk.samanmalicateringservice.privilege.controller.PrivilegeController;
import lk.samanmalicateringservice.privilege.entity.Privilege;
import lk.samanmalicateringservice.user.dao.RoleDao;
import lk.samanmalicateringservice.user.dao.UserDao;
import lk.samanmalicateringservice.user.entity.Role;
import lk.samanmalicateringservice.user.entity.User;

@RestController // @RestController annotation can be used to return JSON response (join java file to the controller file / used to create RESTful web services using spring MVC)
@RequestMapping(value = "/employee") // class level mapping
public class EmployeeController {

    @Autowired // for inject EmployeeDao object to employeeDao variable
    private EmployeeDao employeeDao; // meken tmi meya kiyn wada krnn ek nisa mehem dgnnd oni

    @Autowired
    private EmployeeStatusDao employeeStatusDao;

    @Autowired
    private PrivilegeController privilegeController;

    @Autowired
    private UserDao userDao;

    @Autowired
    private RoleDao roleDao;

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    // define get mapping for get employee all data -- [/employee/printall]
    // url request krl data genn gnn nisa tmi @GetMapping dann
    // produces="application/json" and "application/xml" gnn database eken genn gnn
    // data frontend eke pennd oni widha DAOta kiynn oni nisa
    @GetMapping(value = "/printall", produces = "application/json")
    // list ek gann array eke object ekin ek piliwelata gnnd oni nisa
    public List<Employee> getAllData() {
        // get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // get privilege object using log user and relavent module
        Privilege logUserPrivilege = privilegeController.getPrivilegeByUsernameModule(auth.getName(), "EMPLOYEE");
        // check privilege
        if (!logUserPrivilege.getPriviselect()) {
            return new ArrayList<Employee>();
        }
        // findAll() ek enneth JpaRepositary eken | sort by eken meke data ena widiha
        // descending widihata sort krl tiyenn, ethkot aluthin add krn ek udata eno
        return employeeDao.findAll(Sort.by(Direction.DESC, "id"));
    }

    // define request mapping for return employee ui --> [/employee] (ModelAndView
    // eken tmi ek gann)
    @RequestMapping
    public ModelAndView employeeUi() {
        // create authentication object for get logged user details from security
        // context (Authentication/SecurityContextHolder kiyn package use krgnno mekt)
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // create modelandview object for return ui
        ModelAndView employeeView = new ModelAndView();
        // set return name
        employeeView.addObject("logusername", auth.getName());
        employeeView.addObject("title", "Employee : Samanmali Catering");
        employeeView.addObject("activeOne", "employee");
        employeeView.setViewName("employee.html");
        // return view
        return employeeView;
    }

    // controller eken tmi duplicate and auto generate ewa check krnn

    // post mapping for save employee
    @PostMapping
    @Transactional
    // ajax eke body eke tmi data tika enn kiyl kiynnd tmi @RequestBody dann
    public String saveEmployee(@RequestBody Employee employee) {

        // 1) log user authentication and authorization
        // get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // get privilege object using log user and relavent module
        Privilege logUserPrivilege = privilegeController.getPrivilegeByUsernameModule(auth.getName(), "EMPLOYEE");
        // check privilege
        if (!logUserPrivilege.getPriviinsert()) {
            return "Save not Completed... :you haven't permission..!";
        }

        // 2) duplicate check
        // getEmployeeByNic ek api Dao eke query ghl hdgnn ekk, getNic kiyn ek enn
        // lombok eken hdn getter setters wlin
        Employee extEmpByNic = employeeDao.getEmployeeByNic(employee.getNic());
        if (extEmpByNic != null) {
            return "Save Not completed :\n Following nic " + employee.getNic() + " already Ext!";
        }

        Employee extEmpByEmail = employeeDao.getEmployeeByEmail(employee.getEmail());
        if (extEmpByEmail != null) {
            return "Save Not completed :\n Following email " + employee.getEmail() + " already Ext!";
        }

        // methana error ekk aawoth ek catch krl lssanata error msg ek pennd oni nisa
        // tmi try catch ek dagann
        try {
            // 3) need set auto generate value
            employee.setAddeddatetime(LocalDateTime.now());
            employee.setAddeduser_id(userDao.getByUserName(auth.getName()).getId());
            // generate next employee number through EmployeeDao
            String nextEmpNumber = employeeDao.getNextEmpNumber();
            // empnumber kiyn ek string value ekk ek nisa ek samanaid kiyl blnnd wenn equals
            // kiyn eken (== krl blnn int or boolean ewa)
            if (nextEmpNumber.equals(null) || nextEmpNumber.equals("")) {
                // employee next number ek empyt or null wennd puluwn ek nisa tmi mehem kre
                // setEmpnumber hdnneth lombok
                employee.setEmpnumber("000001");
            } else {
                employee.setEmpnumber(nextEmpNumber);
            }
            Employee savedNewEmployee = employeeDao.save(employee);

      // DEPENDENCIES
      // dependecies (add new user acc if required) [methana add puluwn manussayata
      // aniwaren userge add ekath puluwn wenn oni]
      // status ek true unoth tmi mek hadenn
      if (employee.getDesignation_id().getUseracc()) {
        // create user
        User userAcc = new User();// empty user object ekk hdgththa, ai--> meken new table ekk hdnn yano nm (aluth
                                  // record ekknm meken hdnn yann aniwaren aluth object ekk oni nisa)

        // set property with value one by one
        userAcc.setUsername(employee.getCallingname());
        // mek decode krnnd baa (one way encription ekk tmi wenn) ---> match eken
        // rowpassword ekai,encode password eken samaanaid blno
        userAcc.setPassword(bCryptPasswordEncoder.encode(employee.getEmpnumber()));
        userAcc.setEmail(employee.getEmail());
        userAcc.setStatus(true);
        userAcc.setAddeddatetime(LocalDateTime.now());
        userAcc.setEmployee_id(savedNewEmployee);
        userAcc.setUser_photo(savedNewEmployee.getEmployee_photo());
        userAcc.setUser_photo_name(savedNewEmployee.getEmployee_photo_name());


        // designation list ekai roles list ekai samanawa tiyagnnd ethkot mek lesi /
        // 1.26
        Set<Role> userRole = new HashSet<>(); // role set ekk hdgththa ai userge role ekt oni nisa,hbi meya empty
                                              // (create empty role set object for set new user as userRole)
        Role newObject = roleDao.getByRoleName(employee.getDesignation_id().getName()); // designation ekt related wena
                                                                                        // role object ekk genn
                                                                                        // gththa,ek set kgnnd / 1.37
                                                                                        // (get role object using
                                                                                        // employee designation and
                                                                                        // store role variable)
        userRole.add(newObject);// add role object into role set
        userAcc.setRoles(userRole); // add role set into roleset

        // meka save krgnnd oni(e file ekt relavent dao file ek magin)
        userDao.save(userAcc);
      }
            return "OK";
      
        } catch (Exception e) {
            return "save not completed: " + e.getMessage();
        }
    }

    // create put mapping for update employee
    @PutMapping
    public String updateEmployee(@RequestBody Employee employee) {
        // 1) authentication and authorization
        // get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // get privilege object using log user and relavent module
        Privilege logUserPrivilege = privilegeController.getPrivilegeByUsernameModule(auth.getName(), "EMPLOYEE");
        // check privilege
        if (!logUserPrivilege.getPriviupdate()) {
            return "Update not Completed... :you haven't permission..!";
        }

        // 2) that record ext in db
        Employee extEmployee = employeeDao.getReferenceById(employee.getId());
        if (extEmployee == null) {
            // return eken passe aaye run wenn naa
            return "Update not completed : This employee not ext...!!";
        }

        // 3)check duplicate
        Employee extEmployeeNic = employeeDao.getEmployeeByNic(employee.getNic());
        // extEmployeeNic.getId() != employee.getId() --> meken krl tiyenn aluthin daapu
        // ek prn ekt samana naththm tmi mek tiyenod kiyl check krnn, nththm kohomath
        // duplicate wadinonh
        if (extEmployeeNic != null && extEmployeeNic.getId() != employee.getId()) {
            return "Upadate not completed : changed nic already ext...!!";
        }

        Employee extEmployeeEmail = employeeDao.getEmployeeByEmail(employee.getEmail());
        if (extEmployeeEmail != null && extEmployeeEmail.getId() != employee.getId()) {
            return "Upadate not completed : changed email already ext";
        }

        // 4)okkom hari nm save krnwa
        try {
            employee.setUpdatedatetime(LocalDateTime.now());
            employee.setUpdateuser_id(userDao.getByUserName(auth.getName()).getId());

            employeeDao.save(employee);

            return "OK";

        } catch (Exception e) {
            return "Update not completed: " + e.getMessage();
        }
    }

    // delete mapping for delete employee
    @DeleteMapping
    public String deleteEmployee(@RequestBody Employee employee) {

        // 1) user authentication and authorizaion
        // get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // get privilege object using log user and relavent module
        Privilege logUserPrivilege = privilegeController.getPrivilegeByUsernameModule(auth.getName(), "EMPLOYEE");
        // check privilege
        if (!logUserPrivilege.getPrividelete()) {
            return "Delete not Completed... :you haven't permission..!";
        }

        // 2)check ext
        Employee extEmployee = employeeDao.getReferenceById(employee.getId());
        if (extEmployee == null) {
            return "Delete not Completed : This Employee not ext...!!";
        }
        try {
            extEmployee.setDeletedatetime(LocalDateTime.now());
            extEmployee.setDeleteuser_id(userDao.getByUserName(auth.getName()).getId());
            // soft delete
            // meken db eken data ek permanatlt delete wenn naa, data ek tiyeno status maaru
            // krno dele6e kiyl
            EmployeeStatus deleteStatus = employeeStatusDao.getReferenceById(3);
            extEmployee.setEmployeestatus_id(deleteStatus);

            // ar status maaru krn ek save krnn oni .save eken, mokd mek hard delete ekk
            // nowana nisa
            employeeDao.save(extEmployee);

            return "OK";

        } catch (Exception e) {
            return "Delete not Completed :" + e.getMessage();
        }
    }

    // create get mapping for get employee without user account
    @GetMapping(value = "/listwithoutuseraccount", produces = "application/json")
    public List<Employee> getListWithoutUserAccount() {
        return employeeDao.getListBywithoutUserAccount();
    }

}