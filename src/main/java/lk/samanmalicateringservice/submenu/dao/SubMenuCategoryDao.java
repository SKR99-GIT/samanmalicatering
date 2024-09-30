package lk.samanmalicateringservice.submenu.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import lk.samanmalicateringservice.submenu.entity.SubMenuCategory;

public interface SubMenuCategoryDao extends JpaRepository<SubMenuCategory, Integer>{
    
}
