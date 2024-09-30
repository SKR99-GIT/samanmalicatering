package lk.samanmalicateringservice.porder.entity;

import java.math.BigDecimal;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lk.samanmalicateringservice.ingredient.entity.Ingredients;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "purchaseorder_has_ingredients")
@Data
@NoArgsConstructor
@AllArgsConstructor

public class PurchaseorderHasIngredients {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id",unique = true)
    private Integer id;

    @ManyToOne(optional = false)
    @JsonIgnore//ignore property, mokd naththm meke infinity recurction ekk eno (many side eke tiyen forign key ek tmi block krnn)
    @JoinColumn(name = "purchaseorder_id", referencedColumnName = "id")
    private Porder purchaseorder_id;

    @ManyToOne(optional = false)// oni nmn optinal ek dagannd puluwn eken kiynn null ewath tiyenn puluwn kiyl
    @JoinColumn(name = "ingredients_id", referencedColumnName = "id")
    private Ingredients ingredients_id;

    @NotNull
    @Column(name = "unit_price")
    private BigDecimal unit_price;

    @NotNull
    @Column(name = "quntity")
    private BigDecimal quntity;

    @NotNull
    @Column(name = "line_price")
    private BigDecimal line_price;
}
