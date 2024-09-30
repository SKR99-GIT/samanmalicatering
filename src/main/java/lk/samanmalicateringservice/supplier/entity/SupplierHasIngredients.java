package lk.samanmalicateringservice.supplier.entity;

import java.io.Serializable;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lk.samanmalicateringservice.ingredient.entity.Ingredients;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "supplier_has_ingredients")
@Data
@NoArgsConstructor
@AllArgsConstructor

public class SupplierHasIngredients implements Serializable{
    
    @Id
    @ManyToOne
    @JoinColumn(name = "supplier_id", referencedColumnName = "id")
    private Supplier supplier_id;

    @Id
    @ManyToOne
    @JoinColumn(name = "ingredients_id", referencedColumnName = "id")
    private Ingredients ingredients_id;
}
