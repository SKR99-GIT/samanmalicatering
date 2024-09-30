package lk.samanmalicateringservice.functionhall.dao;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.samanmalicateringservice.functionhall.entity.Hall;

public interface HallDao extends JpaRepository<Hall, Integer> {

    // define query for get hall by given name
    // mek jpql deafult query ekk
    // ? dann mek query ekk kiyl kiynn --- ?1 meke ilakkamen kiynn ahnn access krn parameter eke anke
    @Query(value = "select h from Hall h where h.name=?1")
    public Hall getHallByName(String name);

    @Query(value = "SELECT h.* FROM functionhall h WHERE h.maxparticipantcount >= ?4 AND h.id NOT IN (SELECT r.functionhall_id FROM reservation r WHERE r.functiondate = ?1 AND ((r.functionstarttime <= ?2 AND r.functionendtime >= ?3)));", nativeQuery = true)
    public List<Hall> getAvailableHall(LocalDate functiondate, LocalTime functionstarttime, LocalTime functionendtime, Integer maxparticipantcount);
}
