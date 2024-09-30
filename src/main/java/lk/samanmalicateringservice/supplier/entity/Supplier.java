package lk.samanmalicateringservice.supplier.entity;

import java.time.*;
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
import lk.samanmalicateringservice.ingredient.entity.Ingredients;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "supplier")
@Data
@NoArgsConstructor
@AllArgsConstructor

public class Supplier {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true)
    private Integer id;

    @Column(name = "supnumber")
    @NotNull
    private String supnumber;

    @Column(name = "name")
    @NotNull
    private String name;

    @Column(name = "brn")
    private String brn;

    @Column(name = "mobile")
    @NotNull
    private String mobile;

    @Column(name = "address")
    @NotNull
    private String address;

    @Column(name = "contactpersonename")
    @NotNull
    private String contactpersonename;

    @Column(name = "email")
    @NotNull
    private String email;

    @Column(name = "landnumber")
    private String landnumber;

    @Column(name = "note")
    private String note;

    @ManyToOne
    @JoinColumn(name = "supplierstatus_id", referencedColumnName = "id")
    private SupplierStatus supplierstatus_id;

    @ManyToMany
    @JoinTable(name = "supplier_has_ingredients", joinColumns = @JoinColumn(name = "supplier_id"), inverseJoinColumns = @JoinColumn(name = "ingredients_id"))
    private Set<Ingredients> ingredients;

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

}
