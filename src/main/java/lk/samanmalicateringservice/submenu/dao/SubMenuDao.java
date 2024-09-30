package lk.samanmalicateringservice.submenu.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.samanmalicateringservice.submenu.entity.SubMenu;

public interface SubMenuDao extends JpaRepository<SubMenu, Integer>{

    //menu form eke submenu category eken submenus fiiter krgnn query ek 
    @Query(value = "select sm from SubMenu sm where sm.submenucategory_id.id=?1")
    public List<SubMenu> GetSubMenuByCategory(Integer submenucategoryid);

    // define query for get submenu by given name
    // mek jpql deafult query ekk
    // ? dann mek query ekk kiyl kiynn --- ?1 meke ilakkamen kiynn ahnn access krn parameter eke anke
    @Query(value = "select sm from SubMenu sm where sm.name=?1")
    public SubMenu getSubMenuByName(String name);

    //reservation eke menu eken adala submenus tika ena query ek
    @Query(value = "SELECT sm FROM SubMenu sm where sm.id in (select mhs.submenu_id.id from MenuHasSubMenu mhs where mhs.menu_id.id=?1)")
    public List<SubMenu> getSubmenuByMenu(Integer menuid);
    
}
