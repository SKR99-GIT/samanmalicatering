package lk.samanmalicateringservice.reservation.dao;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.samanmalicateringservice.reservation.entity.Lorry;

public interface LorryDao extends JpaRepository<Lorry, Integer>{
    
    @Query(value = "select * from lorry l where l.id NOT IN (select r.lorry_id from reservation r where r.functiondate =?1);", nativeQuery = true)
    public List<Lorry> getAvailableLorry(LocalDate functiondate);
}
