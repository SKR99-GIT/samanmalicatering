package lk.samanmalicateringservice.reservation.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.List;

import lk.samanmalicateringservice.reservation.entity.Reservation;

public interface ReservationDao extends JpaRepository<Reservation, Integer>{

    @Query(value = "SELECT concat('R',year(current_date()), lpad(substring(max(r.reservationcode), 6) +1, 5, 0)) FROM samanmalicateringservice.reservation as r where year(r.addeddatetime) = year(current_date());", nativeQuery = true)
    String getNextResNumber();

    @Query(value = "select r from Reservation r where r.reservationstatus_id.id=1 or r.reservationstatus_id.id=2")
    List<Reservation> getUpcomingReservation();

    @Query(value = "select * from reservation r where (r.kitchen_status_id=1 and (r.reservationstatus_id=2 or r.reservationstatus_id=4)) order by functiondate ASC", nativeQuery = true)
    List<Reservation> getConfirmedReservation();

    @Query(value = "select r from Reservation r where r.kitchen_status_id.id=2 and r.functionhall_id.id=null")
    List<Reservation> getInpreparationReservation();

    //for reports
    @Query(value = "select * from reservation where date(functiondate) >=?1 and date(functiondate) <=?2", nativeQuery = true)
    List<Reservation> getReservationByDateRange(String startDate, String endDate);

    //for report (feild 3)
    @Query(value = "select r from Reservation r where r.functiontype_id.id=?3 and (date(functiondate) >=?1 and date(functiondate) <=?2)")
    List<Reservation> getReseByDatesAndFunctionType(LocalDate startDate, LocalDate endDate, int functiontype);
    
}
