package lk.samanmalicateringservice.porder.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lk.samanmalicateringservice.porder.dao.PurchaseorderHasIngredientsDao;
import lk.samanmalicateringservice.porder.entity.PurchaseorderHasIngredients;

@RestController
@RequestMapping(value = "/porderhasIng")
public class PurchaseorderHasIngredientsController {
   
    @Autowired
    private PurchaseorderHasIngredientsDao purchaseorderHasIngredientsDao;
 
    // [ /porderhasIng/byprderingredient/1/2]
    @GetMapping(value = "/byprderingredient/{porderid}/{ingredientsid}")
    //path variable ek liyaddi warahan athule id ek denne 2k tiyedd, mokd gann mokkd kiyl eyalata kiynnd epai
    public PurchaseorderHasIngredients getIngredientbyPO(@PathVariable("porderid") Integer porderid,@PathVariable("ingredientsid") Integer ingredientsid){
        return purchaseorderHasIngredientsDao.getByPorderIngredient(porderid, ingredientsid);
    } 
}