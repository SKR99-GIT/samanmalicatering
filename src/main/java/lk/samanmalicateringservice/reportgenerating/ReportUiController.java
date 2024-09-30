package lk.samanmalicateringservice.reportgenerating;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

@RestController
@RequestMapping(value = "/report")
public class ReportUiController {

    @RequestMapping
    public ModelAndView reportMainUi() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        ModelAndView reportMainView = new ModelAndView();
        reportMainView.addObject("logusername", auth.getName());
        reportMainView.addObject("title", "Report : Samanmali Catering");
        reportMainView.setViewName("reportmain.html");
        return reportMainView;
    }

    @RequestMapping(value = "/pendingemployee")
    public ModelAndView pendingEmployeeUi() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        ModelAndView pendingEmployeeView = new ModelAndView();
        pendingEmployeeView.addObject("logusername", auth.getName());
        pendingEmployeeView.addObject("title", "Report : Samanmali Catering");
        pendingEmployeeView.setViewName("systemuserreport.html");
        return pendingEmployeeView;
    }

    @RequestMapping(value = "/paymentreport")
    public ModelAndView paymentReportUi() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        ModelAndView paymentReportView = new ModelAndView();
        paymentReportView.addObject("logusername", auth.getName());
        paymentReportView.addObject("title", "Report : Samanmali Catering");
        paymentReportView.setViewName("paymentreport.html");
        return paymentReportView;
    }

    @RequestMapping(value = "/dailypaymentreport")
    public ModelAndView dailyPaymentReportUi() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        ModelAndView dailyPaymentReportView = new ModelAndView();
        dailyPaymentReportView.addObject("logusername", auth.getName());
        dailyPaymentReportView.addObject("title", "Report : Samanmali Catering");
        dailyPaymentReportView.setViewName("dailypaymentreport.html");
        return dailyPaymentReportView;
    }

    @RequestMapping(value = "/monthlypaymentreport")
    public ModelAndView monthlyPaymentReportUi() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        ModelAndView monthlyPaymentReportView = new ModelAndView();
        monthlyPaymentReportView.addObject("logusername", auth.getName());
        monthlyPaymentReportView.addObject("title", "Report : Samanmali Catering");
        monthlyPaymentReportView.setViewName("monthlypaymentreport.html");
        return monthlyPaymentReportView;
    }

    @RequestMapping(value = "/reservationreport")
    public ModelAndView reservationReportUi() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        ModelAndView reservationReportView = new ModelAndView();
        reservationReportView.addObject("logusername", auth.getName());
        reservationReportView.addObject("title", "Report : Samanmali Catering");
        reservationReportView.setViewName("reservationreport.html");
        return reservationReportView;
    }

    @RequestMapping(value = "/resereportfunctiontype")
    public ModelAndView reseFunTypeReportUi() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        ModelAndView reseFunTypeReporttView = new ModelAndView();
        reseFunTypeReporttView.addObject("logusername", auth.getName());
        reseFunTypeReporttView.addObject("title", "Report : Samanmali Catering");
        reseFunTypeReporttView.setViewName("reservationreportfuntype.html");
        return reseFunTypeReporttView;
    }

    @RequestMapping(value = "/monthlyreservationreport")
    public ModelAndView monthlyReseReportUi() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        ModelAndView monthlyReseReportView = new ModelAndView();
        monthlyReseReportView.addObject("logusername", auth.getName());
        monthlyReseReportView.addObject("title", "Report : Samanmali Catering");
        monthlyReseReportView.setViewName("monthlyreservation.html");
        return monthlyReseReportView;
    }
}
