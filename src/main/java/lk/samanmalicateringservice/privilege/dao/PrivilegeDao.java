package lk.samanmalicateringservice.privilege.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.samanmalicateringservice.privilege.entity.Privilege;

public interface PrivilegeDao extends JpaRepository<Privilege, Integer> {

    @Query("select p from Privilege p where p.role_id.id=?1 and p.module_id.id=?2")
    Privilege getByRoleModule(Integer roleid, Integer moduleid);

    // create query for get privilege by given username and module nme
    @Query(value = "SELECT bit_or(p.priviselect) as pri_sel,bit_or(p.priviinsert) as pri_in,bit_or(p.priviupdate) as pri_up,bit_or(p.prividelete) as pri_del FROM samanmalicateringservice.privilege as p where p.module_id in (SELECT m.id from samanmalicateringservice.module as m where m.name = ?2) and p.role_id in(SELECT uhr.role_id FROM samanmalicateringservice.user_has_role as uhr where uhr.user_id in (SELECT u.id FROM samanmalicateringservice.user as u where u.username=?1));", nativeQuery = true)
    String getPrivilegeByUserModule(String username, String modulename);

}
