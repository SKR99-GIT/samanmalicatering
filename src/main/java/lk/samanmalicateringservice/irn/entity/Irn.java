package lk.samanmalicateringservice.irn.entity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lk.samanmalicateringservice.porder.entity.Porder;
import lk.samanmalicateringservice.supplier.entity.Supplier;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "irn")
@Data
@NoArgsConstructor
@AllArgsConstructor

public class Irn {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true)
    private Integer id;

    @Column(name = "irncode")
    @NotNull
    private String irncode;

    @Column(name = "reservedate")
    @NotNull
    private LocalDate reservedate;

    @Column(name = "totalamount")
    @NotNull
    private BigDecimal totalamount;

    @Column(name = "discountrate")
    @NotNull
    private BigDecimal discountrate;

    @Column(name = "netamount")
    @NotNull
    private BigDecimal netamount;

    @Column(name = "paidamount")
    private BigDecimal paidamount;

    @Column(name = "note")
    private String note;

    @Column(name = "supplierbillnumber")
    @NotNull
    private String supplierbillnumber;

    @ManyToOne
    @JoinColumn(name = "supplier_id", referencedColumnName = "id")
    private Supplier supplier_id;

    @ManyToOne
    @JoinColumn(name = "purchaseorder_id", referencedColumnName = "id")
    private Porder purchaseorder_id;

    @ManyToOne
    @JoinColumn(name = "irnstatus_id", referencedColumnName = "id")
    private IrnStatus irnstatus_id;

    @Column(name = "addeddatetime")
    @NotNull
    private LocalDateTime addeddatetime;

    @Column(name = "updatedatetime")
    private LocalDateTime updatedatetime;

    @Column(name = "deletedatetime")
    private LocalDateTime deletedatetime;

    @Column(name = "addeduser_id")
    @NotNull
    private Integer addeduser_id;

    @Column(name = "updateuser_id")
    private Integer updateuser_id;

    @Column(name = "deleteuser_id")
    private Integer deleteuser_id;

    @OneToMany(mappedBy = "irn_id", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<IrnHasIngredients> irnhasingredientslist;

}
