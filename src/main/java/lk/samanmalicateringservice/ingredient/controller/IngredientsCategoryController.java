package lk.samanmalicateringservice.ingredient.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lk.samanmalicateringservice.ingredient.dao.IngredientsCategoryDao;
import lk.samanmalicateringservice.ingredient.entity.IngredientsCategory;

@RestController
@RequestMapping(value = "/ingredientscategory")
public class IngredientsCategoryController {
    
    @Autowired
    private IngredientsCategoryDao ingredientsCategoryDao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<IngredientsCategory> getallData(){
        return ingredientsCategoryDao.findAll();
    }
}
