package lk.samanmalicateringservice.functionhall.entity;

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
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "functionhall")
@Data
@NoArgsConstructor
@AllArgsConstructor

public class Hall {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "name", unique = true)
    @NotNull
    private String name;

    @Column(name = "maxparticipantcount")
    @NotNull
    private Integer maxparticipantcount;

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

    @ManyToOne
    @JoinColumn(name = "hallstatus_id", referencedColumnName = "id")
    private HallStatus hallstatus_id;

    @ManyToMany
    @JoinTable(name = "functionhall_has_hallfeatures", joinColumns = @JoinColumn(name = "functionhall_id"), inverseJoinColumns = @JoinColumn(name = "hallfeatures_id"))
    private Set<HallFeatures> features;

}
