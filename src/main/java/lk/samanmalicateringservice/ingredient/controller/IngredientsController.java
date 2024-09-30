package lk.samanmalicateringservice.ingredient.controller;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

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

import lk.samanmalicateringservice.ingredient.dao.IngredientsDao;
import lk.samanmalicateringservice.ingredient.dao.IngredientsStatusDao;
import lk.samanmalicateringservice.ingredient.entity.Ingredients;
import lk.samanmalicateringservice.ingredient.entity.IngredientsStatus;
import lk.samanmalicateringservice.privilege.controller.PrivilegeController;
import lk.samanmalicateringservice.privilege.entity.Privilege;
import lk.samanmalicateringservice.user.dao.UserDao;

@RestController
@RequestMapping(value = "/ingredients")
public class IngredientsController {

    @Autowired
    private IngredientsDao ingredientsDao;

    @Autowired
    private IngredientsStatusDao ingredientsStatusDao;

    @Autowired
    private UserDao userDao;

    @Autowired
    private PrivilegeController privilegeController;

    @GetMapping(value = "/printall", produces = "application/json")
    public List<Ingredients> getAllData() {
        // get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // get privilege object using log user and relavent module
        Privilege logUserPrivilege = privilegeController.getPrivilegeByUsernameModule(auth.getName(), "INGREDIENT");
        // check privilege
        if (!logUserPrivilege.getPriviselect()) {
            return new ArrayList<Ingredients>();
        }
        return ingredientsDao.findAll(Sort.by(Direction.DESC, "id"));
    }

    // supplier form eke ingredient select krganiddi category eken select krgnn
    // widihata haduwa leesi wenn
    @GetMapping(value = "/getingredientscategory/{ingredientscategoryid}")
    public List<Ingredients> getIngredientsByCat(@PathVariable Integer ingredientscategoryid) {
        return ingredientsDao.getIngredientsByCategory(ingredientscategoryid);
    }

    // IRN form ekedi porder ekt adaala ingrediants tika gann oni nisa tmi mek
    // haduwe
    // [ /ingredients/getbyporder/1]
    @GetMapping(value = "/getbyporder/{porderid}", produces = "application/json")
    public List<Ingredients> getIngredientsByPorder(@PathVariable Integer porderid) {
        return ingredientsDao.getIngByPorder(porderid);
    }

    //porder eke supplier adala ingredients tika genn gannd oni mapping ek 
    @GetMapping(value = "/getbysupplier", params = {"id"},produces="application/json")
    public List<Ingredients> getIngredientsBySup(@RequestParam("id") Integer supplierid){
        return ingredientsDao.getIngBySupplier(supplierid);
    }

    @RequestMapping
    public ModelAndView ingredientsUi() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        ModelAndView ingredientsView = new ModelAndView();
        ingredientsView.addObject("logusername", auth.getName());
        ingredientsView.addObject("title", "Ingredients : Samanmali Catering");
        ingredientsView.addObject("activeOne", "ingredients");
        ingredientsView.setViewName("ingredient.html");
        return ingredientsView;
    }

    @PostMapping
    public String saveIngredient(@RequestBody Ingredients ingredients) {
        // 1) log user authentication and authorization
        // get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // get privilege object using log user and relavent module
        Privilege logUserPrivilege = privilegeController.getPrivilegeByUsernameModule(auth.getName(), "INGREDIENT");
        // check privilege
        if (!logUserPrivilege.getPriviinsert()) {
            return "Save not Completed... :you haven't permission..!";
        }
        // 2) duplicate check
        // lombok eken hdn getter setters wlin
        Ingredients extIngredientsByName = ingredientsDao.getIngredientsByName(ingredients.getName());
        if (extIngredientsByName != null) {
            return "Save Not completed :\n Following Ingredient " + ingredients.getName() + " already Ext!";
        }
        // methana error ekk aawoth ek catch krl lssanata error msg ek pennd oni nisa
        // tmi try catch ek dagann
        try {
            // 3)set auto generated items
            // set date time
            ingredients.setAddeddatetime(LocalDateTime.now());
            ingredients.setAddeduser_id(userDao.getByUserName(auth.getName()).getId());

            // set code
            String nextIngCode = ingredientsDao.getNextIngNumber();
            if (nextIngCode.equals(null) || nextIngCode.equals("")) {
                ingredients.setCode("ING0001");
            } else {
                ingredients.setCode(nextIngCode);
            }

            ingredientsDao.save(ingredients);
            return "OK";
        } catch (Exception e) {
            return "save not completed: " + e.getMessage();
        }
    }

    @PutMapping
    public String updateIngredient(@RequestBody Ingredients ingredients) {
        // 1) log user authentication and authorization
        // get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // get privilege object using log user and relavent module
        Privilege logUserPrivilege = privilegeController.getPrivilegeByUsernameModule(auth.getName(), "INGREDIENT");
        // check privilege
        if (!logUserPrivilege.getPriviupdate()) {
            return "Update not Completed... :you haven't permission..!";
        }
        // 2) existing check
        Ingredients exIngredients = ingredientsDao.getReferenceById(ingredients.getId());
        if (exIngredients == null) {
            return "Update not completed : This Ingredient Detail not exist..!!!";
        }
        // duplicate check
        Ingredients extIngredientsByName = ingredientsDao.getIngredientsByName(ingredients.getName());
        if (extIngredientsByName != null && extIngredientsByName.getId() != ingredients.getId()) {
            return "Update Not completed :\n Following Ingredient " + ingredients.getName() + " already Ext!";
        }
        try {
            ingredients.setUpdatedatetime(LocalDateTime.now());
            ingredients.setUpdateuser_id(userDao.getByUserName(auth.getName()).getId());
            ingredientsDao.save(ingredients);
            return "OK";
        } catch (Exception e) {
            return "Update not completed" + e.getMessage();
        }
    }

    @DeleteMapping
    public String deleteIngredient(@RequestBody Ingredients ingredients) {
        // get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // get privilege object using log user and relavent module
        Privilege logUserPrivilege = privilegeController.getPrivilegeByUsernameModule(auth.getName(), "INGREDIENT");
        // check privilege
        if (!logUserPrivilege.getPriviupdate()) {
            return "Delete not Completed... :you haven't permission..!";
        }
        // 1)check that Ingredient ext
        Ingredients exIngredients = ingredientsDao.getReferenceById(ingredients.getId());
        if (exIngredients == null) {
            return "Delete NOT completed : This Ingredient does not exist";
        }
        try {
            exIngredients.setDeletedatetime(LocalDateTime.now());
            exIngredients.setDeleteuser_id(userDao.getByUserName(auth.getName()).getId());
            // 2)soft delete
            IngredientsStatus deleteStatus = ingredientsStatusDao.getReferenceById(2);
            exIngredients.setIngredientstatus_id(deleteStatus);

            ingredientsDao.save(exIngredients);
            return "OK";
        } catch (Exception e) {
            return "Delete not Completed :" + e.getMessage();
        }
    }
}
