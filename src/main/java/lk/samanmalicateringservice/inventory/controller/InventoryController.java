package lk.samanmalicateringservice.inventory.controller;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import lk.samanmalicateringservice.inventory.dao.InventoryDao;
import lk.samanmalicateringservice.inventory.entity.Inventory;

@RestController
@RequestMapping(value = "/inventory")
public class InventoryController {
    
    @Autowired
    private InventoryDao inventoryDao;

    @GetMapping(value = "/printall", produces = "application/json")
    public List<Inventory> getAllData(){
        return inventoryDao.findAll();
    }

    @GetMapping(value = "/byingredient/{ingredientsid}")
    public BigDecimal getAvtQtyByIng(@PathVariable Integer ingredientsid){
        return inventoryDao.getAvtQtyByIngredient(ingredientsid);
    }

    @RequestMapping
    public ModelAndView inventoryUi(){
         Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        ModelAndView inventoryView = new ModelAndView();
        inventoryView.addObject("logusername", auth.getName());
        inventoryView.addObject("title", "Inventory : Samanmali Catering");
        inventoryView.addObject("activeOne", "inventory");
        inventoryView.setViewName("inventory.html");
        return inventoryView;
    }
}
