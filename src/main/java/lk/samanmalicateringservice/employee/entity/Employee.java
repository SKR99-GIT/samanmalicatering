package lk.samanmalicateringservice.employee.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;

import org.hibernate.validator.constraints.Length;

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

@Entity // meken kiynn jpa entity ekk kiyl (ORM krnn ehemnh ek nisa ek oni)
@Table(name = "employee")

@Data // getter setter autom enn meken (lombok eke me annoutation 3nm oni weno ekt)
@NoArgsConstructor
@AllArgsConstructor

public class Employee {

    @Id // this is a primary key of a table
    @GeneratedValue(strategy = GenerationType.IDENTITY) // auto incremant id(db eken wada krn ekt)
    @Column(name = "id", unique = true) // column name mapping
    private Integer id;

    @Column(name = "empnumber", unique = true)
    @NotNull
    private String empnumber;

    @Column(name = "fullname")
    @NotNull
    private String fullname;

    @Column(name = "callingname")
    @NotNull
    private String callingname;

    @Column(name = "nic", unique = true)
    @NotNull
    @Length(max = 12, min = 10)
    private String nic;

    @Column(name = "gender")
    @NotNull
    private String gender;

    @Column(name = "dob")
    @NotNull
    private LocalDate dob;

    @Column(name = "email", unique = true)
    @NotNull
    private String email;

    @Column(name = "mobile")
    @NotNull
    private String mobile;

    @Column(name = "landno")
    private String landno;

    @Column(name = "address")
    @NotNull
    private String address;

    @Column(name = "note")
    private String note;

    @Column(name = "civilstatus")
    @NotNull
    private String civilstatus;

    @Column(name = "employee_photo")
    private byte[] employee_photo;

    @Column(name = "employee_photo_name")
    private String employee_photo_name;

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

    // forigen key

    @ManyToOne
    @JoinColumn(name = "designation_id", referencedColumnName = "id")
    private Designation designation_id;

    @ManyToOne
    @JoinColumn(name = "employeestatus_id", referencedColumnName = "id")
    private EmployeeStatus employeestatus_id;
}
