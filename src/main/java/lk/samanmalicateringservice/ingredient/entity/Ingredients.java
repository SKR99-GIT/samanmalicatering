package lk.samanmalicateringservice.ingredient.entity;

import java.math.BigDecimal;
import java.time.*;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "ingredients")
@Data
@NoArgsConstructor
@AllArgsConstructor

public class Ingredients {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true)
    private Integer id;
    
    @Column(name = "name")
    @NotNull
    private String name;
    
    @Column(name = "code")
    @NotNull
    private String code;
    
    @Column(name = "unitprice")
    private BigDecimal unitprice; 
    
    @Column(name = "note")
    private String note; 

     @ManyToOne
    @JoinColumn(name = "ingredientcategory_id", referencedColumnName = "id")
    private IngredientsCategory ingredientcategory_id;

     @ManyToOne
    @JoinColumn(name = "ingredientstatus_id", referencedColumnName = "id")
    private IngredientsStatus ingredientstatus_id;
    

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
