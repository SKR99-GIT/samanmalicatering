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

import lk.samanmalicateringservice.ingredient.dao.IngredientsDao;
import lk.samanmalicateringservice.ingredient.entity.Ingredients;
import lk.samanmalicateringservice.inventory.dao.InventoryDao;
import lk.samanmalicateringservice.inventory.entity.Inventory;
import lk.samanmalicateringservice.privilege.controller.PrivilegeController;
import lk.samanmalicateringservice.privilege.entity.Privilege;
import lk.samanmalicateringservice.reservation.dao.DeliveryStatusDao;
import lk.samanmalicateringservice.reservation.dao.ReservationDao;
import lk.samanmalicateringservice.reservation.entity.DeliveryStatus;
import lk.samanmalicateringservice.reservation.entity.Reservation;
import lk.samanmalicateringservice.reservation.entity.ReservationHasAdditionalSubmenu;
import lk.samanmalicateringservice.reservation.entity.ReservationHasIngredients;
import lk.samanmalicateringservice.reservation.entity.ReservationHasService;
import lk.samanmalicateringservice.user.dao.UserDao;

@RestController
@RequestMapping(value = "/kitchen")
public class KitchenController {

    @Autowired
    private ReservationDao reservationDao;

    @Autowired
    private UserDao userDao;

    @Autowired
    private InventoryDao inventoryDao;

    @Autowired
    private PrivilegeController privilegeController;

    @Autowired
    private DeliveryStatusDao deliveryStatusDao;

    @RequestMapping
    public ModelAndView kitchenUi() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        ModelAndView kitchenView = new ModelAndView();
        kitchenView.addObject("logusername", auth.getName());
        kitchenView.addObject("title", "Kitchen : Samanmali Catering");
        kitchenView.addObject("activeOne", "kitchen");
        kitchenView.setViewName("kitchen.html");
        return kitchenView;
    }

    @GetMapping("/getUpcomingKitchenReservation")
    public List<Reservation> getUpcomingKitchenReservation() {
        return reservationDao.getConfirmedReservation();
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

            DeliveryStatus pendingStatus = deliveryStatusDao.getReferenceById(1);
            reservation.setDelivery_status_id(pendingStatus);

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

            //set 
            for (ReservationHasIngredients resing : reservation.getReservationhasingredientslist()) {
                Inventory extInventory = inventoryDao.getByIng(resing.getIngredients_id().getId());

                // bigdecimal wl kawadawath +,-,/,* baa -- ekt .add,.multiple wge ewa tiyeno
                extInventory.setAvailableqty(extInventory.getAvailableqty().subtract(resing.getRequired_qty()));
                                                                                                  
                inventoryDao.save(extInventory);
                // garbage removale eketh me wge tmi wenn

            }

            return "OK";

        } catch (Exception e) {
            return "Kitchen Update not completed" + e.getMessage();
        }
    }

}
