package lk.samanmalicateringservice.menu.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import lk.samanmalicateringservice.menu.entity.MenuCategory;

public interface MenuCategoryDao extends JpaRepository<MenuCategory, Integer>{
    
}
