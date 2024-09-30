package lk.samanmalicateringservice.customer.controller;

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

import lk.samanmalicateringservice.customer.dao.CustomerDao;
import lk.samanmalicateringservice.customer.dao.CustomerStatusDao;
import lk.samanmalicateringservice.customer.entity.Customer;
import lk.samanmalicateringservice.customer.entity.CustomerStatus;
import lk.samanmalicateringservice.privilege.controller.PrivilegeController;
import lk.samanmalicateringservice.privilege.entity.Privilege;
import lk.samanmalicateringservice.user.dao.UserDao;

@RestController
@RequestMapping(value = "/customer")
public class CustomerController {

    @Autowired
    private CustomerDao customerDao;

    @Autowired
    private CustomerStatusDao customerStatusDao;

    @Autowired
    private UserDao userDao;

    @Autowired
    private PrivilegeController privilegeController;

    @GetMapping(value = "/printall", produces = "application/json")
    public List<Customer> getAllData() {
        // get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // get privilege object using log user and relavent module
        Privilege logUserPrivilege = privilegeController.getPrivilegeByUsernameModule(auth.getName(), "CUSTOMER");
        // check privilege
        if (!logUserPrivilege.getPriviselect()) {
            return new ArrayList<Customer>();
        }
        // findAll() ek enneth JpaRepositary eken | sort by eken meke data ena widiha
        // descending widihata sort krl tiyenn, ethkot aluthin add krn ek udata eno
        return customerDao.findAll(Sort.by(Direction.DESC, "id"));
    }

    @RequestMapping
    public ModelAndView customerUi() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        ModelAndView customerView = new ModelAndView();
        customerView.addObject("logusername", auth.getName());
        customerView.addObject("title", "Customer : Samanmali Catering");
        customerView.addObject("activeOne", "customer");
        customerView.setViewName("customer.html");
        return customerView;
    }

    @GetMapping("/getactivecustomer")
    public List<Customer> getActiveCus(){
        return customerDao.getActiveCustomer();
    }

    // post mapping for save customer
    @PostMapping
    // ajax eke body eke tmi data tika enn kiyl kiynnd tmi @RequestBody dann
    public String saveCustomer(@RequestBody Customer customer) {

        // 1) log user authentication and authorization
        // get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // get privilege object using log user and relavent module
        Privilege logUserPrivilege = privilegeController.getPrivilegeByUsernameModule(auth.getName(), "CUSTOMER");
        // check privilege
        if (!logUserPrivilege.getPriviinsert()) {
            return "Save not Completed... :you haven't permission..!";
        }
        // 2) duplicate check
        // getEmployeeByNic ek api Dao eke query ghl hdgnn ekk, getNic kiyn ek enn
        // lombok eken hdn getter setters wlin
        Customer extCusByNic = customerDao.getCustomerByNic(customer.getNic());
        if (extCusByNic != null) {
            return "Save Not completed :\n Following nic " + customer.getNic() + " already Ext!";
        }

        // methana error ekk aawoth ek catch krl lssanata error msg ek pennd oni nisa
        // tmi try catch ek dagann
        try {
            // 3) need set auto generate value
            customer.setAddeddatetime(LocalDateTime.now());
            customer.setAddeduser_id(userDao.getByUserName(auth.getName()).getId());
            // generate next employee number through EmployeeDao
            String nextCusNumber = customerDao.getNextCusNumber();
            // empnumber kiyn ek string value ekk ek nisa ek samanaid kiyl blnnd wenn equals
            // kiyn eken (== krl blnn int or boolean ewa)
            if (nextCusNumber.equals(null) || nextCusNumber.equals("")) {
                // employee next number ek empyt or null wennd puluwn ek nisa tmi mehem kre
                // setEmpnumber hdnneth lombok
                customer.setCusnumber("001");
            } else {
                customer.setCusnumber(nextCusNumber);
            }
            customerDao.save(customer);
            return "OK";
        } catch (Exception e) {
            return "save not completed: " + e.getMessage();
        }
    }

    // put mapping for update customer
    @PutMapping
    public String updateCustomer(@RequestBody Customer customer) {

        // 1) log user authentication and authorization
        // get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // get privilege object using log user and relavent module
        Privilege logUserPrivilege = privilegeController.getPrivilegeByUsernameModule(auth.getName(), "CUSTOMER");
        // check privilege
        if (!logUserPrivilege.getPriviupdate()) {
            return "Update not Completed... :you haven't permission..!";
        }
        // 2) existing check
        Customer extCustomer = customerDao.getReferenceById(customer.getId());
        if (extCustomer == null) {
            return "Update not completed : Customer not exist..!!!";
        }
        // 3) duplicate check
        Customer extCusByNic = customerDao.getCustomerByNic(customer.getNic());
        if (extCusByNic != null && extCusByNic.getId() != customer.getId()) {
            return "Update Not completed :\n Following nic " + customer.getNic() + " already Ext!";
        }
        try {
            customer.setUpdatedatetime(LocalDateTime.now());
            customer.setUpdateuser_id(userDao.getByUserName(auth.getName()).getId());

            customerDao.save(customer);
            return "OK";
        } catch (Exception e) {
            return "Update not completed" + e.getMessage();
        }

    }

    // delete mapping for delete customer
    @DeleteMapping
    public String deleteCustomer(@RequestBody Customer customer) {
        //1)log user authentication and authorization
        // get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // get privilege object using log user and relavent module
        Privilege logUserPrivilege = privilegeController.getPrivilegeByUsernameModule(auth.getName(), "CUSTOMER");
        // check privilege
        if (!logUserPrivilege.getPrividelete()) {
            return "Delete not Completed... :you haven't permission..!";
        }
        // 2) check if that customer exists
        Customer extCustomer = customerDao.getReferenceById(customer.getId());
        if (extCustomer == null) {
            return "Delete NOT completed : This Customer does not exist";
        }
        try {
            extCustomer.setDeletedatetime(LocalDateTime.now());
            extCustomer.setDeleteuser_id(userDao.getByUserName(auth.getName()).getId());
            // 2) soft delete (change the status)
            CustomerStatus deleteStatus = customerStatusDao.getReferenceById(2);
            extCustomer.setCustomerstatus_id(deleteStatus);

            customerDao.save(extCustomer);
            return "OK";

        } catch (Exception e) {
            return "Delete not Completed :" + e.getMessage();
        }
    }

}
