package lk.samanmalicateringservice.payment.controller;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import lk.samanmalicateringservice.payment.dao.PaymentDao;
import lk.samanmalicateringservice.payment.entity.Payment;
import lk.samanmalicateringservice.privilege.controller.PrivilegeController;
import lk.samanmalicateringservice.privilege.entity.Privilege;
import lk.samanmalicateringservice.reservation.dao.ReservationDao;
import lk.samanmalicateringservice.reservation.dao.ReservationStatusDao;
import lk.samanmalicateringservice.reservation.entity.Reservation;
import lk.samanmalicateringservice.reservation.entity.ReservationStatus;
import lk.samanmalicateringservice.user.dao.UserDao;

@RestController
@RequestMapping(value = "/payment")
public class PaymentController {

    @Autowired
    private PaymentDao paymentDao;

    @Autowired
    private UserDao userDao;

    @Autowired
    private PrivilegeController privilegeController;

    @Autowired
    private ReservationDao reservationDao;

    @Autowired
    private ReservationStatusDao reservationStatusDao;

    @GetMapping(value = "/printall", produces = "application/json")
    public List<Payment> getAllData() {
        // get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // get privilege object using log user and relavent module
        Privilege logUserPrivilege = privilegeController.getPrivilegeByUsernameModule(auth.getName(), "PAYMENT");
        // check privilege
        if (!logUserPrivilege.getPriviselect()) {
            return new ArrayList<Payment>();
        }
        return paymentDao.findAll(Sort.by(Direction.DESC, "id"));
    }

    @RequestMapping
    public ModelAndView paymentUi() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        ModelAndView paymentView = new ModelAndView();
        paymentView.addObject("logusername", auth.getName());
        paymentView.addObject("title", "Payment : Samanmali Catering");
        paymentView.addObject("activeOne", "payment");
        paymentView.setViewName("payment.html");
        return paymentView;
    }

    @PostMapping
    public String savePayment(@RequestBody Payment payment) {
        // 1) log user authentication and authorization
        // get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // get privilege object using log user and relavent module
        Privilege logUserPrivilege = privilegeController.getPrivilegeByUsernameModule(auth.getName(),
                "PAYMENT");
        // check privilege
        if (!logUserPrivilege.getPriviinsert()) {
            return "Save not Completed... :you haven't permission..!";
        }
        try {
            // 3)set auto generated items
            // set date time
            payment.setAddeddatetime(LocalDateTime.now());
            payment.setAddeduser_id(userDao.getByUserName(auth.getName()).getId());

            // set billnumber
            String nextPayBillNumber = paymentDao.getNextPaymentBillNumber();
            if (nextPayBillNumber.equals(null) || nextPayBillNumber.equals("")) {
                payment.setBillnumber("RB2024001");
            } else {
                payment.setBillnumber(nextPayBillNumber);
            }

            Payment savedPayment = paymentDao.save(payment);
            // dependencies
            if (savedPayment != null) {

                // reservation eke paid amount ek update krnnd oni
                Reservation paidReservation = reservationDao.getReferenceById(savedPayment.getReservation_id().getId());
                paidReservation.setPaidamount(paidReservation.getPaidamount().add(savedPayment.getPaidamount()));

                if (paidReservation.getTotalprice().compareTo(paidReservation.getPaidamount()) == 0) {
                    ReservationStatus paidStatus = reservationStatusDao.getReferenceById(4);
                    paidReservation.setReservationstatus_id(paidStatus);
                } else {
                    ReservationStatus paidStatus = reservationStatusDao.getReferenceById(2);
                    paidReservation.setReservationstatus_id(paidStatus);
                }

                reservationDao.save(paidReservation);
            }

            return "OK";
        } catch (Exception e) {
            return "save not completed: " + e.getMessage();
        }
    }

    // for reports
    @GetMapping("/getPaymentsByDateRange/{startDate}/{endDate}")
    public List<Payment> getPaymentsByDateRange(@PathVariable String startDate, @PathVariable String endDate) {
        return paymentDao.getPaymentsByDateRange(startDate, endDate);
    }
}
