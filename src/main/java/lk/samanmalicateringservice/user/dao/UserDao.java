package lk.samanmalicateringservice.user.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.samanmalicateringservice.user.entity.User;

public interface UserDao extends JpaRepository<User, Integer> {

    // create query for get user by given email
    @Query(value = "select u from User u where u.email=?1")
    public User getUserByEmail(String email);

    // create query for get user by given employee
    // employee_id.id --> employee_id object eke id ek tmi meken me gnn
    @Query(value = "select u from User u where u.employee_id.id=?1")
    public User getByEmployee(Integer empid);

    // create query for get user by given user name
    @Query(value = "select u from User u where u.username=?1")
    public User getByUserName(String username);
}
