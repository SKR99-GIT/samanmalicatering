package lk.samanmalicateringservice.menu.entity;

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
@Table(name = "menu_has_submenu")
@Data
@NoArgsConstructor
@AllArgsConstructor

public class MenuHasSubMenu implements Serializable {
    
    @Id
    @ManyToOne
    @JoinColumn(name = "menu_id", referencedColumnName = "id")
    private Menu menu_id;

    @Id
    @ManyToOne
    @JoinColumn(name = "submenu_id", referencedColumnName = "id")
    private SubMenu submenu_id;
}
