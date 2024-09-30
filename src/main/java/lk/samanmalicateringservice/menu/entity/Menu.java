package lk.samanmalicateringservice.menu.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Set;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lk.samanmalicateringservice.reservation.entity.FunctionType;
import lk.samanmalicateringservice.submenu.entity.SubMenu;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "menu")
@Data
@NoArgsConstructor
@AllArgsConstructor

public class Menu {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true)
    private Integer id;

    @Column(name = "name")
    @NotNull
    private String name;

    @Column(name = "pricewithouthall")
    @NotNull
    private BigDecimal pricewithouthall;

    @Column(name = "pricewithhall")
    @NotNull
    private BigDecimal pricewithhall;

    @ManyToOne
    @JoinColumn(name = "menucategory_id", referencedColumnName = "id")
    private MenuCategory menucategory_id;

    @ManyToOne
    @JoinColumn(name = "functiontype_id", referencedColumnName = "id")
    private FunctionType functiontype_id;

    @ManyToOne
    @JoinColumn(name = "menustatus_id", referencedColumnName = "id")
    private MenuStatus menustatus_id;

    @Column(name = "note")
    private String note;

    @ManyToMany
    @JoinTable(name = "menu_has_submenu", joinColumns = @JoinColumn(name = "menu_id"), inverseJoinColumns = @JoinColumn(name = "submenu_id"))
    private Set<SubMenu> submenus;

    @Column(name = "addeddatetime")
    private LocalDateTime addeddatetime;

    @Column(name = "updatedatetime")
    private LocalDateTime updatedatetime;

    @Column(name = "deletedatetime")
    private LocalDateTime deletedatetime;

    @Column(name = "addeduser_id")
    private Integer addeduser_id;

    @Column(name = "updateuser_id")
    private Integer updateuser_id;

    @Column(name = "deleteuser_id")
    private Integer deleteuser_id;

}
