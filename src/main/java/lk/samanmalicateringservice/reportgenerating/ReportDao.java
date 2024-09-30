package lk.samanmalicateringservice.reportgenerating;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.samanmalicateringservice.employee.entity.Employee;

public interface ReportDao extends JpaRepository<Employee, Integer>{
    
    @Query(value = "select e from Employee e where e.employeestatus_id.id=1")
    List<Employee> workingEmployeesList();

    @Query(value = "select e from Employee e where e.employeestatus_id.id=?1 and e.designation_id.id=?2")
    List<Employee> employeeListByStatusDesi(int status, int designation);

    
}
