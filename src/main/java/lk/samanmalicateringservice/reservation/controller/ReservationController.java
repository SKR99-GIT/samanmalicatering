package lk.samanmalicateringservice.reservation.controller;

import java.util.ArrayList;
import java.util.List;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import lk.samanmalicateringservice.privilege.controller.PrivilegeController;
import lk.samanmalicateringservice.privilege.entity.Privilege;
import lk.samanmalicateringservice.reservation.dao.KitchenStatusDao;
import lk.samanmalicateringservice.reservation.dao.ReservationDao;
import lk.samanmalicateringservice.reservation.dao.ReservationStatusDao;
import lk.samanmalicateringservice.reservation.entity.KitchenStatus;
import lk.samanmalicateringservice.reservation.entity.Reservation;
import lk.samanmalicateringservice.reservation.entity.ReservationHasAdditionalSubmenu;
import lk.samanmalicateringservice.reservation.entity.ReservationHasIngredients;
import lk.samanmalicateringservice.reservation.entity.ReservationHasService;
import lk.samanmalicateringservice.reservation.entity.ReservationStatus;
import lk.samanmalicateringservice.user.dao.UserDao;

@RestController
@RequestMapping(value = "/reservation")
public class ReservationController {

    @Autowired
    private ReservationDao reservationDao;

    @Autowired
    private ReservationStatusDao reservationStatusDao;

    @Autowired
    private UserDao userDao;

    @Autowired
    private PrivilegeController privilegeController;

    @Autowired
    private KitchenStatusDao kitchenStatusDao;

    @GetMapping(value = "/printall", produces = "application/json")
    public List<Reservation> getAllData() {
        // get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // get privilege object using log user and relavent module
        Privilege logUserPrivilege = privilegeController.getPrivilegeByUsernameModule(auth.getName(), "RESERVATION");
        // check privilege
        if (!logUserPrivilege.getPriviselect()) {
            return new ArrayList<Reservation>();
        }
        return reservationDao.findAll(Sort.by(Direction.DESC, "id"));
    }

    @RequestMapping
    public ModelAndView reservationUi() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        ModelAndView reservationView = new ModelAndView();
        reservationView.addObject("logusername", auth.getName());
        reservationView.addObject("title", "Reservation : Samanmali Catering");
        reservationView.addObject("activeOne", "reservation");
        reservationView.setViewName("reservation.html");
        return reservationView;
    }

    @GetMapping("/getUpcomingPaymentReservation")
    public List<Reservation> getUpcomingPaymentReservation() {
        return reservationDao.getUpcomingReservation();
    }

    @PostMapping
    public String saveReservation(@RequestBody Reservation reservation) {
        // 1) log user authentication and authorization
        // get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // get privilege object using log user and relavent module
        Privilege logUserPrivilege = privilegeController.getPrivilegeByUsernameModule(auth.getName(), "RESERVATION");
        // check privilege
        if (!logUserPrivilege.getPriviinsert()) {
            return "Save not Completed... :you haven't permission..!";
        }
        // 2) duplicate check --> meke mokend mm duplicate check krnn (aththama kathawa
        // meke duplicate check krnnd baa itim customer knkt oni tharam reservation dann
        // puluwnh)
        // lombok eken hdn getter setters wlin

        // methana error ekk aawoth ek catch krl lssanata error msg ek pennd oni nisa
        // tmi try catch ek dagann
        try {
            // set added date time
            reservation.setAddeddatetime(LocalDateTime.now());
            reservation.setAddeduser_id(userDao.getByUserName(auth.getName()).getId());

            // set reservation code
            String nextResNumber = reservationDao.getNextResNumber();
            if (nextResNumber.equals(null) || nextResNumber.equals("")) {
                reservation.setReservationcode(LocalDate.now().getYear() + "00001");
            } else {
                reservation.setReservationcode(nextResNumber);
            }

            reservation.setPaidamount(BigDecimal.ZERO);
           /*  BigDecimal advaceAmount = reservation.getTotalprice().multiply(BigDecimal.valueOf(1.2));
            reservation.setAdvanceamount(advaceAmount); */
            KitchenStatus notStartedStatus = kitchenStatusDao.getReferenceById(1);
            reservation.setKitchen_status_id(notStartedStatus);

            for (ReservationHasAdditionalSubmenu ressub : reservation.getReservationhasadditionalsubmenulist()) {
                ressub.setReservation_id(reservation);
            }

            for (ReservationHasService resser : reservation.getReservationhasservicelist()) {
                resser.setReservation_id(reservation);
            }

            for (ReservationHasIngredients resing : reservation.getReservationhasingredientslist()) {
                resing.setReservation_id(reservation);
            }

            reservationDao.save(reservation);
            return "OK";
        } catch (Exception e) {
            return "save not completed: " + e.getMessage();
        }
    }

    @PutMapping
    public String updateReservation(@RequestBody Reservation reservation) {
        // 1) log user authentication and authorization
        // get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // get privilege object using log user and relavent module
        Privilege logUserPrivilege = privilegeController.getPrivilegeByUsernameModule(auth.getName(), "RESERVATION");
        // check privilege
        if (!logUserPrivilege.getPriviinsert()) {
            return "Update not Completed... :you haven't permission..!";
        }
        // 2) existing check
        Reservation extReservation = reservationDao.getReferenceById(reservation.getId());
        if (extReservation == null) {
            return "Update not completed : This Resevation Details not exist..!!!";
        }
        // 3)duplicate check

        try {
            reservation.setUpdatedatetime(LocalDateTime.now());
            reservation.setUpdateuser_id(userDao.getByUserName(auth.getName()).getId());

            for (ReservationHasAdditionalSubmenu ressub : reservation.getReservationhasadditionalsubmenulist()) {
                ressub.setReservation_id(reservation);
            }

            for (ReservationHasService resser : reservation.getReservationhasservicelist()) {
                resser.setReservation_id(reservation);
            }

            for (ReservationHasIngredients resing : reservation.getReservationhasingredientslist()) {
                resing.setReservation_id(reservation);
            }

            reservationDao.save(reservation);
            return "OK";

        } catch (Exception e) {
            return "Update not completed" + e.getMessage();
        }
    }

    // delete mapping for delete reservation
    @DeleteMapping
    public String deleteReservation(@RequestBody Reservation reservation) {

        // 1) user authentication and authorizaion
        // get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // get privilege object using log user and relavent module
        Privilege logUserPrivilege = privilegeController.getPrivilegeByUsernameModule(auth.getName(), "RESERVATION");
        // check privilege
        if (!logUserPrivilege.getPriviinsert()) {
            return "Delete not Completed... :you haven't permission..!";
        }
        // 2)check ext
        Reservation extReservation = reservationDao.getReferenceById(reservation.getId());
        if (extReservation == null) {
            return "Delete not Completed : This Reservation not ext...!!";
        }
        try {
            extReservation.setDeletedatetime(LocalDateTime.now());
            extReservation.setDeleteuser_id(userDao.getByUserName(auth.getName()).getId());
            // soft delete
            // meken db eken data ek permanatlt delete wenn naa, data ek tiyeno status maaru
            // krno dele6e kiyl
            ReservationStatus deleteStatus = reservationStatusDao.getReferenceById(3);
            extReservation.setReservationstatus_id(deleteStatus);

            for (ReservationHasAdditionalSubmenu ressub : reservation.getReservationhasadditionalsubmenulist()) {
                ressub.setReservation_id(reservation);
            }

            for (ReservationHasService resser : reservation.getReservationhasservicelist()) {
                resser.setReservation_id(reservation);
            }

            for (ReservationHasIngredients resing : reservation.getReservationhasingredientslist()) {
                resing.setReservation_id(reservation);
            }
            // ar status maaru krn ek save krnn oni .save eken, mokd mek hard delete ekk
            // nowana nisa
            reservationDao.save(extReservation);
            return "OK";

        } catch (Exception e) {
            return "Delete not Completed :" + e.getMessage();
        }
    }

    //for reports
    @GetMapping("/getreservationbydaterange/{startDate}/{endDate}")
    public List<Reservation> getReservationByDates(@PathVariable String startDate, @PathVariable String endDate){
        return reservationDao.getReservationByDateRange(startDate, endDate);
    }

    //for dashboard reports
    @GetMapping(value = "/getresbydatesandfunctiontype",params =  {"startDate","endDate", "functiontype"},produces = "application/json")
    public List<Reservation> getResByDatesAndFunType(@RequestParam("startDate") LocalDate startDate, @RequestParam("endDate") LocalDate endDate, @RequestParam("functiontype") int functiontype){
        return reservationDao.getReseByDatesAndFunctionType(startDate, endDate, functiontype);
    }
}
