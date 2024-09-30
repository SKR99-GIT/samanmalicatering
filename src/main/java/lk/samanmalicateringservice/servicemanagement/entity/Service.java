package lk.samanmalicateringservice.servicemanagement.entity;

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
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "service")
@Data
@NoArgsConstructor
@AllArgsConstructor

public class Service {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true)
    private Integer id;

    @Column(name = "name")
    @NotNull
    private String name;

    @Column(name = "mobile")
    @NotNull
    private String mobile;

    @Column(name = "nic")
    @NotNull
    private String nic;

    @Column(name = "servicecharge")
    @NotNull
    private BigDecimal servicecharge;

    @Column(name = "note")
    private String note;

    @ManyToOne
    @JoinColumn(name = "servicecategory_id", referencedColumnName = "id")
    private ServiceCategory servicecategory_id;

    @ManyToOne
    @JoinColumn(name = "servicestatus_id", referencedColumnName = "id")
    private ServiceStatus servicestatus_id;

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
