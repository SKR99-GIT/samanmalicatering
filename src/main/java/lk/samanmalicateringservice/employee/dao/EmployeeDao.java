package lk.samanmalicateringservice.employee.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import lk.samanmalicateringservice.employee.entity.Employee;

public interface EmployeeDao extends JpaRepository<Employee, Integer> {

    // native , JPQL(default) (HQL)

    // create query for get next employee number
    // lpad kiynn issrhata oni characters dann oni krn keyword native query ekk nisa
    // mek nativeQuery true krnnd oni
    @Query(value = "SELECT lpad(max(e.empnumber)+1 ,6 ,0) as empnumber FROM samanmalicateringservice.employee as e;", nativeQuery = true)
    public String getNextEmpNumber();

    // define query for get employee by given nic
    // 1 kramaya
    // mekedi ar issla eke wge thadi query ekk liyann naththe mek jpql deafult
    // kramayat
    // ? dann mek query ekk kiyl kiynn --- ?1 meke ilakkamen kiynn ahnn access krn parameter eke anke
    @Query(value = "select e from Employee e where e.nic=?1")
    public Employee getEmployeeByNic(String nic);

    // define query for get employee by given email
    // 2 kramaya
    @Query(value = "select e from Employee e where e.email=:email")
    public Employee getEmployeeByEmail(@Param("email") String email);

    //user account ekk nathi employeelawa thorala gannwa
    @Query(value = "select e from Employee e where e.id not in (select u.employee_id.id from User u)")
    public List<Employee> getListBywithoutUserAccount(); 
}
