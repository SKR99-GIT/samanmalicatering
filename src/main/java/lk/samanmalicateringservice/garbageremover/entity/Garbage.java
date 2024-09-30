package lk.samanmalicateringservice.garbageremover.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lk.samanmalicateringservice.inventory.entity.Inventory;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "garbageremoval")
@Data
@NoArgsConstructor
@AllArgsConstructor

public class Garbage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true)
    private Integer id;

    @Column(name = "quntity")
    @NotNull
    private BigDecimal quntity;

    @Column(name = "reason")
    private String reason;

    @Column(name = "note")
    private String note;

    @Column(name = "batch_number")
    private String batch_number;
    
    @Column(name = "expiredate")
    private String expiredate;
    
    @Column(name = "addeduser_id")
    private Integer addeduser_id;

    @Column(name = "updateuser_id")
    private Integer updateuser_id;

    @Column(name = "deleteuser_id")
    private Integer deleteuser_id;

    @Column(name = "addeddatetime")
    @NotNull
    private LocalDateTime addeddatetime;

    @Column(name = "updatedatetime")
    private LocalDateTime updatedatetime;

    @Column(name = "deletedatetime")
    private LocalDateTime deletedatetime;
    
    @ManyToOne
    @JoinColumn(name = "garbageremovalstatus_id", referencedColumnName = "id")
    private GarbageStatus garbageremovalstatus_id;

    @ManyToOne
    @JoinColumn(name = "ingredientinvetory_id", referencedColumnName = "id")
    private Inventory ingredientinvetory_id;

}
