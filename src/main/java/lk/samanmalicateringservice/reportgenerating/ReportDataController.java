package lk.samanmalicateringservice.reportgenerating;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lk.samanmalicateringservice.employee.entity.Employee;

@RestController
public class ReportDataController {

    @Autowired
    private ReportDao reportDao;
    
    @GetMapping(value = "/reportdataworkingemployee", produces = "application/json")
    public List<Employee> getWorkingEmployeeList(){
        return reportDao.workingEmployeesList();
    }

    //[/reportdataemployee?status=1&designation=1]
    @GetMapping(value = "/reportdataemployee", params = {"status", "designation"},produces = "application/json")
    public List<Employee> getWorkingEmployeeListByStatusDesignation(@RequestParam("status")int status, @RequestParam("designation") int designation){
        return reportDao.employeeListByStatusDesi(status, designation);
    }
}
