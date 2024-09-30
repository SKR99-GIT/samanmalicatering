package lk.samanmalicateringservice.suppayment.entity;

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
import lk.samanmalicateringservice.irn.entity.Irn;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "supplierpayment_has_irn")
@Data
@NoArgsConstructor
@AllArgsConstructor

public class SupplierpaymentHasIrn {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true)
    private Integer id;

    @ManyToOne(optional = false) // oni nmn optinal ek dagannd puluwn eken kiynn null ewath tiyenn puluwn kiyl
    @JsonIgnore//ignore property, mokd naththm meke infinity recurction ekk eno (many side eke tiyen forign key ek tmi block krnn)
    @JoinColumn(name = "supplierpayment_id", referencedColumnName = "id")
    private SupplierPayment supplierpayment_id;

    @ManyToOne(optional = false)// oni nmn optinal ek dagannd puluwn eken kiynn null ewath tiyenn puluwn kiyl
    @JoinColumn(name = "irn_id", referencedColumnName = "id")
    private Irn irn_id;

    @NotNull
    @Column(name = "totalamount")
    private BigDecimal totalamount;

    @NotNull
    @Column(name = "paidamount")
    private BigDecimal paidamount;

    @NotNull
    @Column(name = "balanceamount")
    private BigDecimal balanceamount;
}
