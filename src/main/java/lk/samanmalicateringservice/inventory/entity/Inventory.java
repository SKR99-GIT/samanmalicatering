package lk.samanmalicateringservice.inventory.entity;

import java.math.BigDecimal;
import java.time.LocalDate;

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
import lk.samanmalicateringservice.irn.entity.Irn;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "ingredientinventory")
@Data
@NoArgsConstructor
@AllArgsConstructor

public class Inventory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true)
    private Integer id;

    @Column(name = "reservedate")
    @NotNull
    private LocalDate reservedate;

    @Column(name = "expiredate")
    private LocalDate expiredate;

    @Column(name = "totalqty")
    @NotNull
    private BigDecimal totalqty;

    @Column(name = "availableqty")
    @NotNull
    private BigDecimal availableqty;

    @Column(name = "removeqty")
    @NotNull
    private BigDecimal removeqty;

    @Column(name = "batch_number")
    private String batch_number;

    @ManyToOne
    @JoinColumn(name = "irn_id", referencedColumnName = "id")
    private Irn irn_id;

    @ManyToOne
    @JoinColumn(name = "ingredients_id", referencedColumnName = "id")
    private Ingredients ingredients_id;

}
