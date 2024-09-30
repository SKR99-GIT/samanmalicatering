package lk.samanmalicateringservice.user.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.samanmalicateringservice.user.entity.Role;

public interface RoleDao extends JpaRepository<Role, Integer> {

    @Query(value = "select r from Role r where r.name <> 'Admin'")
    public List<Role> getRoleListWithoutAdmin();

    // create query for get given role
    @Query(value = "select r from Role r where r.name=?1")
    public Role getByRoleName(String name);
}
