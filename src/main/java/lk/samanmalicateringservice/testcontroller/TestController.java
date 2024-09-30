package lk.samanmalicateringservice.testcontroller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

@RestController
public class TestController {
    
    @RequestMapping(value = "/test1")
    public ModelAndView test1Ui(){
      ModelAndView test1View = new ModelAndView();
      test1View.setViewName("navbar.html");
      return test1View;
    }

}
