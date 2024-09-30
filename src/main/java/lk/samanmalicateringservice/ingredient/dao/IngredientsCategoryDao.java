package lk.samanmalicateringservice.ingredient.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import lk.samanmalicateringservice.ingredient.entity.IngredientsCategory;

public interface IngredientsCategoryDao extends JpaRepository<IngredientsCategory, Integer>{
    
}
