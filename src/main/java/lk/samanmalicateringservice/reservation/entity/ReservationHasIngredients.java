package lk.samanmalicateringservice.reservation.entity;

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
import lk.samanmalicateringservice.ingredient.entity.Ingredients;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "reservation_has_ingredients")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReservationHasIngredients {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true)
    private Integer id;

    @ManyToOne(optional = false) // oni nmn optinal ek dagannd puluwn eken kiynn null ewath tiyenn puluwn kiyl
    @JsonIgnore // ignore property, mokd naththm meke infinity recurction ekk eno (many side eke
                // tiyen forign key ek tmi block krnn)
    @JoinColumn(name = "reservation_id", referencedColumnName = "id")
    private Reservation reservation_id;

    @ManyToOne(optional = false) // oni nmn optinal ek dagannd puluwn eken kiynn null ewath tiyenn puluwn kiyl
    @JoinColumn(name = "ingredients_id ", referencedColumnName = "id")
    private Ingredients ingredients_id;

     @Column(name = "required_qty")
    private BigDecimal required_qty;

     @Column(name = "available_qty")
    private BigDecimal available_qty;
}
