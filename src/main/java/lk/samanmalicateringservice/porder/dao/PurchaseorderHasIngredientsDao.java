package lk.samanmalicateringservice.porder.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.samanmalicateringservice.porder.entity.PurchaseorderHasIngredients;

public interface PurchaseorderHasIngredientsDao extends JpaRepository<PurchaseorderHasIngredients, Integer> {

    @Query(value = "select pohi from PurchaseorderHasIngredients pohi where pohi.purchaseorder_id.id=?1 and pohi.ingredients_id.id=?2")
    public PurchaseorderHasIngredients getByPorderIngredient(Integer porderid, Integer ingredientsid);
}
