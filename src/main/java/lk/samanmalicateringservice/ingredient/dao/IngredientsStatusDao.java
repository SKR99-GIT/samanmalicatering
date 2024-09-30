package lk.samanmalicateringservice.ingredient.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import lk.samanmalicateringservice.ingredient.entity.IngredientsStatus;

public interface IngredientsStatusDao extends JpaRepository<IngredientsStatus, Integer>{
    
}
