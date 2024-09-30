package lk.samanmalicateringservice.menu.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import lk.samanmalicateringservice.menu.entity.MenuStatus;

public interface MenuStatusDao extends JpaRepository<MenuStatus, Integer>{
    
}
