package lk.samanmalicateringservice.menu.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.samanmalicateringservice.menu.entity.Menu;

public interface MenuDao extends JpaRepository<Menu, Integer>{
    
    @Query(value = "select m from from Menu m where m.functiontype_id.id=?1")
    public List<Menu> getMenuNameByFunctionType(Integer functiontypeid);

}
