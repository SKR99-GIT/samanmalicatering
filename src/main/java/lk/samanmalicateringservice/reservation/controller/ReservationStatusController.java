package lk.samanmalicateringservice.reservation.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lk.samanmalicateringservice.reservation.dao.ReservationStatusDao;
import lk.samanmalicateringservice.reservation.entity.ReservationStatus;

@RestController
@RequestMapping(value = "/reservationstatus")
public class ReservationStatusController {

    @Autowired
    private ReservationStatusDao reservationStatusDao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<ReservationStatus> getAllData(){
        return reservationStatusDao.findAll();
    }
    
}
