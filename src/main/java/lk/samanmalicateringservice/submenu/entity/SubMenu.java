package lk.samanmalicateringservice.submenu.entity;

import java.math.BigDecimal;
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
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "submenu")
@Data
@NoArgsConstructor
@AllArgsConstructor

public class SubMenu {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true)
    private Integer id;

    @Column(name = "name")
    @NotNull
    private String name;

    @Column(name = "priceforoneportion")
    @NotNull
    private BigDecimal priceforoneportion;

    @ManyToOne(optional = true) // oni nmn optinal ek dagannd puluwn eken kiynn null ewath tiyenn puluwn kiyl
    @JoinColumn(name = "submenucategory_id", referencedColumnName = "id")
    private SubMenuCategory submenucategory_id;

    @ManyToOne
    @JoinColumn(name = "submenustatus_id", referencedColumnName = "id")
    private SubMenuStatus submenustatus_id;

    @Column(name = "note")
    private String note;

    @Column(name = "addeduser_id")
    private Integer addeduser_id;

    @Column(name = "updateuser_id")
    private Integer updateuser_id;

    @Column(name = "deleteuser_id")
    private Integer deleteuser_id;

    @Column(name = "addeddatetime")
    private LocalDateTime addeddatetime;

    @Column(name = "updatedatetime")
    private LocalDateTime updatedatetime;

    @Column(name = "deletedatetime")
    private LocalDateTime deletedatetime;

    @OneToMany(mappedBy = "submenu_id", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SubmenuHasIngredients> submenuhasingredientslist;
}
