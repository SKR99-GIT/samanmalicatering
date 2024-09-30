package lk.samanmalicateringservice.supplier.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lk.samanmalicateringservice.supplier.dao.SupplierStatusDao;
import lk.samanmalicateringservice.supplier.entity.SupplierStatus;

@RestController
@RequestMapping(value = "/supplierstatus")
public class SupplierStatusController {
    
    @Autowired
    private SupplierStatusDao supplierStatusDao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<SupplierStatus> getAllData(){
        return supplierStatusDao.findAll();
    }
}
