package lk.samanmalicateringservice.inventory.dao;

import java.math.BigDecimal;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.samanmalicateringservice.inventory.entity.Inventory;

public interface InventoryDao extends JpaRepository<Inventory, Integer>{

    @Query(value = "select ii from Inventory ii where ii.ingredients_id.id=?1")
    Inventory getByIng(Integer ingredientsid);

    @Query(value = "select ii.availableqty from Inventory ii where ii.ingredients_id.id=?1")
    public BigDecimal getAvtQtyByIngredient(Integer ingredientsid);

}
