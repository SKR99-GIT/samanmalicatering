package lk.samanmalicateringservice.reservation.controller;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import lk.samanmalicateringservice.privilege.controller.PrivilegeController;
import lk.samanmalicateringservice.privilege.entity.Privilege;
import lk.samanmalicateringservice.reservation.dao.DeliveryStatusDao;
import lk.samanmalicateringservice.reservation.dao.KitchenStatusDao;
import lk.samanmalicateringservice.reservation.dao.ReservationDao;
import lk.samanmalicateringservice.reservation.entity.DeliveryStatus;
import lk.samanmalicateringservice.reservation.entity.KitchenStatus;
import lk.samanmalicateringservice.reservation.entity.Reservation;
import lk.samanmalicateringservice.reservation.entity.ReservationHasAdditionalSubmenu;
import lk.samanmalicateringservice.reservation.entity.ReservationHasIngredients;
import lk.samanmalicateringservice.reservation.entity.ReservationHasService;
import lk.samanmalicateringservice.user.dao.UserDao;

@RestController
@RequestMapping(value = "/delivery")
public class DeliveryController {

    @Autowired
    private ReservationDao reservationDao;

    @Autowired
    private PrivilegeController privilegeController;

    @Autowired
    private UserDao userDao;

    @Autowired
    private KitchenStatusDao kitchenStatusDao;

    @Autowired
    private DeliveryStatusDao deliveryStatusDao;

    @RequestMapping
    public ModelAndView deliveryUi() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        ModelAndView deliveryView = new ModelAndView();
        deliveryView.addObject("logusername", auth.getName());
        deliveryView.addObject("title", "Delivery : Samanmali Catering");
        deliveryView.addObject("activeOne", "delivery");
        deliveryView.setViewName("delivery.html");
        return deliveryView;
    }

    @GetMapping(value = "/getinpreparationreservation")
    public List<Reservation> getInpreparReservation() {
        return reservationDao.getInpreparationReservation();
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

            KitchenStatus completeStatus = kitchenStatusDao.getReferenceById(4);
            reservation.setKitchen_status_id(completeStatus);

             DeliveryStatus completeDisStatus = deliveryStatusDao.getReferenceById(3);
            reservation.setDelivery_status_id(completeDisStatus);

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
            return "Delivery Update not completed" + e.getMessage();
        }
    }

}
