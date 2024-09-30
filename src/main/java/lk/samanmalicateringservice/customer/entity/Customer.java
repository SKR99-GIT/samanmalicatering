package lk.samanmalicateringservice.customer.entity;

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
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "customer")
@Data

@AllArgsConstructor
@NoArgsConstructor

public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true)
    private Integer id;

    @Column(name = "cusnumber", unique = true)
    @NotNull
    private String cusnumber;

    @Column(name = "name")
    @NotNull
    private String name;

    @Column(name = "mobile")
    @NotNull
    private String mobile;

    @Column(name = "land")
    private String land;

    @Column(name = "address")
    @NotNull
    private String address;

    @Column(name = "email")
    private String email;

    @Column(name = "nic", unique = true)
    @NotNull
    private String nic;

    @Column(name = "gender")
    @NotNull
    private String gender;

    @Column(name = "note")
    private String note;

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

    @ManyToOne
    @JoinColumn(name = "customerstatus_id", referencedColumnName = "id")
    private CustomerStatus customerstatus_id;

}
