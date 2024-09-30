package lk.samanmalicateringservice.ingredient.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.samanmalicateringservice.ingredient.entity.Ingredients;

public interface IngredientsDao extends JpaRepository<Ingredients, Integer> {

    @Query(value = "select i from Ingredients i where i.name=?1")
    public Ingredients getIngredientsByName(String name);

    @Query(value = "SELECT concat('ING', lpad(substring(max(i.code), 5)+1 ,4 ,0)) as code FROM samanmalicateringservice.ingredients as i;", nativeQuery = true)
    public String getNextIngNumber();

    //supplier form eke ingredient category eken ingredients fiiter krgnn query ek 
    @Query(value = "select i from Ingredients i where i.ingredientcategory_id.id=?1")
    public List<Ingredients> getIngredientsByCategory(Integer ingredientscategoryid);

    //IRN ekedi purchase order ekt adala ingredients genn gannd oni query ek
    @Query(value = "select i from Ingredients i where i.id in (select pohi.ingredients_id.id from PurchaseorderHasIngredients pohi where pohi.purchaseorder_id.id=?1)")
    public List<Ingredients> getIngByPorder(Integer porderid);

    @Query(value = "SELECT i FROM Ingredients i where i.id in (select shi.ingredients_id.id from SupplierHasIngredients shi where shi.supplier_id.id=?1)")
    public List<Ingredients> getIngBySupplier(Integer supplierid);
}
