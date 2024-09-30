package lk.samanmalicateringservice.porder.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lk.samanmalicateringservice.porder.dao.PorderStatusDao;
import lk.samanmalicateringservice.porder.entity.PorderStatus;

@RestController
@RequestMapping(value = "/porderstatus")
public class PorderStatusController {

    @Autowired
    private PorderStatusDao porderStatusDao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<PorderStatus> getAllData() {
        return porderStatusDao.findAll();
    }
}
