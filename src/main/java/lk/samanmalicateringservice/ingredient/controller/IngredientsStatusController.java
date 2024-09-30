package lk.samanmalicateringservice.ingredient.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lk.samanmalicateringservice.ingredient.dao.IngredientsStatusDao;
import lk.samanmalicateringservice.ingredient.entity.IngredientsStatus;

@RestController
@RequestMapping(value = "/ingredientsstatus")
public class IngredientsStatusController {
    
    @Autowired
    private IngredientsStatusDao ingredientsStatusDao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<IngredientsStatus> getAllData(){
        return ingredientsStatusDao.findAll();
    }
}
