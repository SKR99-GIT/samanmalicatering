package lk.samanmalicateringservice.reservation.entity;

import java.io.Serializable;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lk.samanmalicateringservice.submenu.entity.SubMenu;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "reservation_has_submenu")
@Data
@NoArgsConstructor
@AllArgsConstructor

public class ReservationHasSubmenu implements Serializable{

    @Id
    @ManyToOne
    @JoinColumn(name = "reservation_id", referencedColumnName = "id")
    private Reservation reservation_id;

    @Id
    @ManyToOne
    @JoinColumn(name = "submenu_id", referencedColumnName = "id")
    private SubMenu submenu_id;

}
