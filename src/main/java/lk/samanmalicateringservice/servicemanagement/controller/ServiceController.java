package lk.samanmalicateringservice.servicemanagement.controller;

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
import lk.samanmalicateringservice.servicemanagement.dao.ServiceDao;
import lk.samanmalicateringservice.servicemanagement.dao.ServiceStatusDao;
import lk.samanmalicateringservice.servicemanagement.entity.Service;
import lk.samanmalicateringservice.servicemanagement.entity.ServiceStatus;
import lk.samanmalicateringservice.user.dao.UserDao;

@RestController
@RequestMapping(value = "/service")
public class ServiceController {

    @Autowired
    private ServiceDao serviceDao;

    @Autowired
    private ServiceStatusDao serviceStatusDao;

    @Autowired
    private UserDao userDao;

    @Autowired
    private PrivilegeController privilegeController;

    @GetMapping(value = "/printall", produces = "application/json")
    public List<Service> getAllData() {
         // get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // get privilege object using log user and relavent module
        Privilege logUserPrivilege = privilegeController.getPrivilegeByUsernameModule(auth.getName(), "SERVICE");
        // check privilege
        if (!logUserPrivilege.getPriviselect()) {
            return new ArrayList<Service>();
        }
        return serviceDao.findAll(Sort.by(Direction.DESC, "id"));
    }

    @GetMapping(value = "/getservicenamebycategory{servicecategoryid}")
    public List<Service> getServiceNameByCat(@PathVariable Integer servicecategoryid){
        return serviceDao.getServiceNameByCategory(servicecategoryid);
    }

    @RequestMapping
    public ModelAndView serviceUi() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        ModelAndView serviceView = new ModelAndView();
        serviceView.addObject("logusername", auth.getName());
        serviceView.addObject("title", "Service : Samanmali Catering");
        serviceView.addObject("activeOne", "service");
        serviceView.setViewName("service.html");
        return serviceView;
    }

    @PostMapping
    public String saveService(@RequestBody Service service) {
        // 1) log user authentication and authorization
        // get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // get privilege object using log user and relavent module
        Privilege logUserPrivilege = privilegeController.getPrivilegeByUsernameModule(auth.getName(), "SERVICE");
        // check privilege
        if (!logUserPrivilege.getPriviinsert()) {
            return "Save not Completed... :you haven't permission..!";
        }
        // 2) duplicate check
        // getEmployeeByNic ek api Dao eke query ghl hdgnn ekk, getNic kiyn ek enn
        // lombok eken hdn getter setters wlin
        Service extServiceByNic = serviceDao.getServiceByNic(service.getNic());
        if (extServiceByNic != null) {
            return "Save Not completed :\n Following nic " + service.getNic() + " already Ext!";
        }
        try {
            service.setAddeddatetime(LocalDateTime.now());
            service.setAddeduser_id(userDao.getByUserName(auth.getName()).getId());

            serviceDao.save(service);
            return "OK";
        } catch (Exception e) {
            return "save not completed: " + e.getMessage();
        }
    }

    @PutMapping
    public String updateSeervice(@RequestBody Service service) {

        // 1) log user authentication and authorization
        // get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // get privilege object using log user and relavent module
        Privilege logUserPrivilege = privilegeController.getPrivilegeByUsernameModule(auth.getName(), "SERVICE");
        // check privilege
        if (!logUserPrivilege.getPriviinsert()) {
            return "Update not Completed... :you haven't permission..!";
        }
        // 2) existing check
        Service extService = serviceDao.getReferenceById(service.getId());
        if (extService == null) {
            return "Update not completed : Service not exist..!!!";
        }
        // 3) duplicate check
        Service extServiceByNic = serviceDao.getServiceByNic(service.getNic());
        if (extServiceByNic != null && extServiceByNic.getId() != service.getId()) {
            return "Update Not completed :\n Following nic " + service.getNic() + " already Ext!";
        }
        try {
            service.setUpdatedatetime(LocalDateTime.now());
            service.setUpdateuser_id(userDao.getByUserName(auth.getName()).getId());

            serviceDao.save(service);
            return "OK";
        } catch (Exception e) {
            return "Update not completed" + e.getMessage();
        }

    }

    @DeleteMapping
    public String deleteService(@RequestBody Service service) {
        // get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // get privilege object using log user and relavent module
        Privilege logUserPrivilege = privilegeController.getPrivilegeByUsernameModule(auth.getName(), "SERVICE");
        // check privilege
        if (!logUserPrivilege.getPriviinsert()) {
            return "Delete not Completed... :you haven't permission..!";
        }
        // 1)check if that service exists
        Service extService = serviceDao.getReferenceById(service.getId());
        if (extService == null) {
            return "Delete NOT completed : This Service does not exist";
        }
        try {
            extService.setDeletedatetime(LocalDateTime.now());
            extService.setDeleteuser_id(userDao.getByUserName(auth.getName()).getId());
            // 2)soft delete (change the status)
            ServiceStatus deleteStatus = serviceStatusDao.getReferenceById(2);
            extService.setServicestatus_id(deleteStatus);

            serviceDao.save(extService);
            return "OK";
        } catch (Exception e) {
            return "Delete not Completed :" + e.getMessage();
        }
    }
}
