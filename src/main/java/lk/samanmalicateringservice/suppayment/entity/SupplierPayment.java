package lk.samanmalicateringservice.suppayment.entity;

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
import lk.samanmalicateringservice.supplier.entity.Supplier;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "supplierpayment")
@Data
@NoArgsConstructor
@AllArgsConstructor

public class SupplierPayment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true)
    private Integer id;

    @Column(name = "totalamount")
    private BigDecimal totalamount;

    @Column(name = "totalpaidamount")
    private BigDecimal totalpaidamount;

    @Column(name = "totalbalanceamount")
    private BigDecimal totalbalanceamount;

    @Column(name = "billnumber")
    private String billnumber;

    @Column(name = "addeduser_id")
    private Integer addeduser_id;

    @Column(name = "addeddatetime")
    private LocalDateTime addeddatetime;

    @Column(name = "note")
    private String note;

    @Column(name = "chequenumber")
    private String chequenumber;

    @Column(name = "chequedate")
    private LocalDate chequedate;

    @Column(name = "transfer_id")
    private String transfer_id;

    @Column(name = "transfer_datetime")
    private LocalDateTime transfer_datetime;

    @Column(name = "bankname")
    private String bankname;

    @ManyToOne
    @JoinColumn(name = "supplier_id", referencedColumnName = "id")
    private Supplier supplier_id;

    @ManyToOne
    @JoinColumn(name = "paymentmethod_id", referencedColumnName = "id")
    private PaymentMethod paymentmethod_id;

    @OneToMany(mappedBy = "supplierpayment_id", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SupplierpaymentHasIrn> supplierpaymenthasirnlist;

}
