package lk.samanmalicateringservice.menu.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "menucategory")
@Data
@NoArgsConstructor
@AllArgsConstructor

public class MenuCategory {
    
@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)    
@Column(name = "id", unique = true)    
private Integer id;

@Column(name = "name")
@NotNull    
private String name;
}