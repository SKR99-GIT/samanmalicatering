package lk.samanmalicateringservice.reservation.entity;

import java.math.BigDecimal;
import java.time.*;
import java.util.List;
import java.util.Set;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lk.samanmalicateringservice.customer.entity.Customer;
import lk.samanmalicateringservice.functionhall.entity.Hall;
import lk.samanmalicateringservice.menu.entity.Menu;
import lk.samanmalicateringservice.submenu.entity.SubMenu;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "reservation")
@Data
@NoArgsConstructor
@AllArgsConstructor

public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true)
    private Integer id;

    @Column(name = "reservationcode")
    @NotNull
    private String reservationcode;

    @Column(name = "participatecount")
    @NotNull
    private Integer participatecount;

    @Column(name = "functiondate")
    @NotNull
    private LocalDate functiondate;

    @Column(name = "functionstarttime")
    @NotNull
    private LocalTime functionstarttime;

    @Column(name = "functionendtime")
    @NotNull
    private LocalTime functionendtime;

    @Column(name = "menuprice")
    @NotNull
    private BigDecimal menuprice;

    @Column(name = "totalmenuprice")
    @NotNull
    private BigDecimal totalmenuprice;

    @Column(name = "serviceprice")
    private BigDecimal serviceprice;

    @Column(name = "additionalsubmenuprice")
    private BigDecimal additionalsubmenuprice;

    @Column(name = "afterdiscountmenutotal")
    private BigDecimal afterdiscountmenutotal;

    @Column(name = "totalprice")
    @NotNull
    private BigDecimal totalprice;

    @Column(name = "paidamount")
    private BigDecimal paidamount;

    /* @Column(name = "advanceamount")
    private BigDecimal advanceamount; */

    @Column(name = "note")
    private String note;

    @ManyToOne
    @JoinColumn(name = "customer_id", referencedColumnName = "id")
    private Customer customer_id;

    @ManyToOne
    @JoinColumn(name = "functionhall_id", referencedColumnName = "id")
    private Hall functionhall_id;

    @ManyToOne
    @JoinColumn(name = "menu_id", referencedColumnName = "id")
    private Menu menu_id;

    @ManyToOne
    @JoinColumn(name = "functiontype_id", referencedColumnName = "id")
    private FunctionType functiontype_id;

    @ManyToOne
    @JoinColumn(name = "reservationstatus_id", referencedColumnName = "id")
    private ReservationStatus reservationstatus_id;

    @ManyToOne
    @JoinColumn(name = "lorry_id", referencedColumnName = "id")
    private Lorry lorry_id;

    @ManyToOne
    @JoinColumn(name = "delivery_status_id", referencedColumnName = "id")
    private DeliveryStatus delivery_status_id;

    @ManyToOne
    @JoinColumn(name = "kitchen_status_id", referencedColumnName = "id")
    private KitchenStatus kitchen_status_id;

    @Column(name = "addeduser_id")
    @NotNull
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

    @ManyToMany
    @JoinTable(name = "reservation_has_submenu", joinColumns = @JoinColumn(name = "reservation_id"), inverseJoinColumns = @JoinColumn(name = "submenu_id"))
    private Set<SubMenu> submenus;

    @OneToMany(mappedBy = "reservation_id", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ReservationHasService> reservationhasservicelist;

    @OneToMany(mappedBy = "reservation_id", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ReservationHasAdditionalSubmenu> reservationhasadditionalsubmenulist;

    @OneToMany(mappedBy = "reservation_id", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ReservationHasIngredients> reservationhasingredientslist;

}
