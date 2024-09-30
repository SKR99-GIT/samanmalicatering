package lk.samanmalicateringservice.payment.entity;

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
import lk.samanmalicateringservice.reservation.entity.Reservation;
import lk.samanmalicateringservice.suppayment.entity.PaymentMethod;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "payment")
@Data
@NoArgsConstructor
@AllArgsConstructor

public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true)
    private Integer id;

    @Column(name = "billnumber")
    @NotNull
    private String billnumber;

    @ManyToOne
    @JoinColumn(name = "paymentmethod_id", referencedColumnName = "id")
    private PaymentMethod paymentmethod_id;
 
    @Column(name = "payment_type")
    @NotNull
    private String payment_type;

    @Column(name = "totalamount")
    @NotNull
    private BigDecimal totalamount;

    @Column(name = "paidamount")
    @NotNull
    private BigDecimal paidamount;

    @Column(name = "balanceamount")
    @NotNull
    private BigDecimal balanceamount;

    @Column(name = "transfer_id")
    private String transfer_id;

    @Column(name = "transferdatetime")
    private LocalDateTime transferdatetime;

    @Column(name = "payment_note")
    private String payment_note;

    @ManyToOne
    @JoinColumn(name = "reservation_id", referencedColumnName = "id")
    private Reservation reservation_id;
    
    @Column(name = "addeddatetime")
    @NotNull
    private LocalDateTime addeddatetime;

    @Column(name = "addeduser_id")
    private Integer addeduser_id;


}
