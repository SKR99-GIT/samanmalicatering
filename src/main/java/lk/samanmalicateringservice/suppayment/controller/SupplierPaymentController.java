package lk.samanmalicateringservice.suppayment.controller;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import lk.samanmalicateringservice.irn.dao.IrnDao;
import lk.samanmalicateringservice.irn.dao.IrnStatusDao;
import lk.samanmalicateringservice.irn.entity.Irn;
import lk.samanmalicateringservice.irn.entity.IrnHasIngredients;
import lk.samanmalicateringservice.irn.entity.IrnStatus;
import lk.samanmalicateringservice.privilege.controller.PrivilegeController;
import lk.samanmalicateringservice.privilege.entity.Privilege;
import lk.samanmalicateringservice.suppayment.dao.SupplierPaymentDao;
import lk.samanmalicateringservice.suppayment.entity.SupplierPayment;
import lk.samanmalicateringservice.suppayment.entity.SupplierpaymentHasIrn;
import lk.samanmalicateringservice.user.dao.UserDao;

@RestController
@RequestMapping(value = "/supplierpayment")
public class SupplierPaymentController {

    @Autowired
    private SupplierPaymentDao supplierPaymentDao;

    @Autowired
    private UserDao userDao;

    @Autowired
    private PrivilegeController privilegeController;

    @Autowired
    private IrnDao irnDao;

    @Autowired
    private IrnStatusDao irnStatusDao;

    @GetMapping(value = "/printall", produces = "application/json")
    public List<SupplierPayment> getAllData() {
        // get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // get privilege object using log user and relavent module
        Privilege logUserPrivilege = privilegeController.getPrivilegeByUsernameModule(auth.getName(),
                "SUPPLIERPAYMENT");
        // check privilege
        if (!logUserPrivilege.getPriviselect()) {
            return new ArrayList<SupplierPayment>();
        }
        return supplierPaymentDao.findAll(Sort.by(Direction.DESC, "id"));
    }

    @RequestMapping
    public ModelAndView supplierPaymentUi() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        ModelAndView supPaymentView = new ModelAndView();
        supPaymentView.addObject("logusername", auth.getName());
        supPaymentView.addObject("title", "Supplier Payment : Samanmali Catering");
        supPaymentView.addObject("activeOne", "supplierpayment");
        supPaymentView.setViewName("supplierpayment.html");
        return supPaymentView;
    }

    @PostMapping
    public String saveSupplierPaymnet(@RequestBody SupplierPayment supplierPayment) {
        // 1) log user authentication and authorization
        // get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // get privilege object using log user and relavent module
        Privilege logUserPrivilege = privilegeController.getPrivilegeByUsernameModule(auth.getName(),
                "SUPPLIERPAYMENT");
        // check privilege
        if (!logUserPrivilege.getPriviinsert()) {
            return "Save not Completed... :you haven't permission..!";
        }
        // 2) duplicate check
        // lombok eken hdn getter setters wlin
        try {
            // 3)set auto generated items
            // set date time
            supplierPayment.setAddeddatetime(LocalDateTime.now());
            supplierPayment.setAddeduser_id(userDao.getByUserName(auth.getName()).getId());

            // set billnumber
            String nextBillNumber = supplierPaymentDao.getNextBillNumber();
            if (nextBillNumber.equals(null) || nextBillNumber.equals("")) {
                supplierPayment.setBillnumber("B2024001");
            } else {
                supplierPayment.setBillnumber(nextBillNumber);
            }

            // mek dann isslla purchaceorder_id ek block krnonh infinity recursion ekk ena
            // nisa, ek block krlm tibila hariyann naa save krgnnd ek required nisa, itim me
            // widihata ek dala save krgnnd oni
            for (SupplierpaymentHasIrn supsuppayirn : supplierPayment.getSupplierpaymenthasirnlist()) {
                supsuppayirn.setSupplierpayment_id(supplierPayment);
                ;
            }

            SupplierPayment newSupPay = supplierPaymentDao.save(supplierPayment);
            // dependency
            for (SupplierpaymentHasIrn newSupPayIrn : newSupPay.getSupplierpaymenthasirnlist()) {

                // irn eke paid amount ek update krnnd oni krn paymet ekt adalawa
                Irn paidIrn = irnDao.getReferenceById(newSupPayIrn.getIrn_id().getId());
                paidIrn.setPaidamount(paidIrn.getPaidamount().add(newSupPayIrn.getPaidamount()));

                //irn status ek set krno complete kiyala
                if (paidIrn.getNetamount().compareTo(paidIrn.getPaidamount())== 0 ) {
                    IrnStatus completeStatus = irnStatusDao.getReferenceById(2);
                    paidIrn.setIrnstatus_id(completeStatus);
                }
                // mek dann isslla purchaceorder_id ek block krnonh infinity recursion ekk ena
                // nisa, ek block krlm tibila hariyann naa save krgnnd ek required nisa, itim me
                // widihata ek dala save krgnnd oni
                for (IrnHasIngredients irning : paidIrn.getIrnhasingredientslist()) {
                    irning.setIrn_id(paidIrn);
                }
                irnDao.save(paidIrn);
            }

            return "OK";
        } catch (Exception e) {
            return "save not completed: " + e.getMessage();
        }
    }

}
