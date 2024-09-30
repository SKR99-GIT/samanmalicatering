package lk.samanmalicateringservice.privilege.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lk.samanmalicateringservice.user.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "privilege")
@Data
@NoArgsConstructor
@AllArgsConstructor

public class Privilege {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "priviselect")
    @NotNull
    private Boolean priviselect; 

    @Column(name = "priviinsert")
    @NotNull
    private Boolean priviinsert;

    @Column(name = "priviupdate")
    @NotNull
    private Boolean priviupdate;

    @Column(name = "prividelete")
    @NotNull
    private Boolean prividelete;
    

    @ManyToOne
    @JoinColumn(name = "module_id" , referencedColumnName = "id")
    private Module module_id;

    @ManyToOne
    @JoinColumn(name = "role_id" , referencedColumnName = "id")
    private Role role_id;   

     //me constructor ek hdnn object ekk gnnd oni nisa --->  authentication part ekt oni wenn
     public Privilege(Boolean priviselect, Boolean priviinsert, Boolean priviupdate, Boolean prividelete){
        this.priviselect = priviselect;
        this.priviinsert = priviinsert;
        this.priviupdate = priviupdate;
        this.prividelete = prividelete;  
    }

}
