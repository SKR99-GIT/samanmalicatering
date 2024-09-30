window.addEventListener('load', () => {
    //mek methanin load krnn form eke withrak nwi table eketh button tiyenonh privilege balal enable/disable wennd oni
    userPrivilege = ajaxGetRequest("/privilage/bymodule/MENU");

    refreshMenuTable();
    refreshMenuForm();
});

const refreshMenuTable = () => {

    //pass the data in db to the table 
    menus = ajaxGetRequest("/menu/printall")

    //text --> string, number, date
    //function --> object,array, boolean --> craete function 
    //column count == object count
    //piliwelata dann 
    const displayProperty = [
        { dataType: 'function', propertyName: getFunctionType },
        { dataType: 'function', propertyName: getMenuCategory },
        { dataType: 'text', propertyName: 'name' },
        { dataType: 'function', propertyName: getSelectedSubMenu },
        { dataType: 'function', propertyName: getPriceWithoutHall },
        { dataType: 'function', propertyName: getPriceWithHall },
        { dataType: 'function', propertyName: getMenuStatus }
    ];

    //call fillDataIntoTable function (tableId,dataList,displayPropertyArrayName,editFunctionName, deleteFuctionName,PrintFuctionName)
    fillDataIntoTable(tableMenu, menus, displayProperty, refillMenuForm, deleteMenu, printMenu, true, userPrivilege);


        //me ara delete krl tiyen ekk aaye delete krnnd bari wennd hadala tiyenn
       /*  employees.forEach((element, index) => {
            if (userPrivilege.prividelete && element.employeestatus_id.name == "Delete") {
                //table eke body ek allgen, eken table column ek allgen, eketh delete button ek allgnnd oni
                tableEmployee.children[1].children[index].children[10].children[1].disabled = "disabled";
                tableEmployee.children[1].children[index].children[10].children[1].style.cursor = "not-allowed";
            }
        }); */

        
    //basicma jquery datatable active krgnn widiha
    $('#tableMenu').dataTable();
}

const getFunctionType = (ob) => {
    return ob.functiontype_id.name;
}

const getMenuCategory = (ob) => {
    return ob.menucategory_id.name;
}

const getSelectedSubMenu = (ob) => {
    let submenus = "";
    for (const index in ob.submenus) {
        if (index == ob.submenus.length - 1) {
            submenus = submenus + ob.submenus[index].name;
        } else {
            submenus = submenus + ob.submenus[index].name + ", ";
        }
    }
    return submenus;
}

const getPriceWithoutHall = (ob) => {
    return parseFloat(ob.pricewithouthall).toFixed(2);
}

const getPriceWithHall = (ob) => {
    return parseFloat(ob.pricewithhall).toFixed(2);
}

const getMenuStatus = (ob) => {
    if (ob.menustatus_id.name == 'Available') {
        return '<span class="text-success fw-bold">Available</span>'
    } else {
        return '<span class="text-danger fw-bold">Delete</span>';
    }
}

//define fn ckeckerror
const checkFormError = () => {
    let errors = '';

    if (menu.name == null) {
        errors = errors + "Please Enter Menu Name \n";
        nameTxt.style.background = 'rgba(255,0,0,0.1)';
    }
    if (menu.menucategory_id == null) {
        errors = errors + "Please Select Menu Category \n";
        menuSlctCategory.style.background = 'rgba(255,0,0,0.1)';
    }
    if (menu.functiontype_id == null) {
        errors = errors + "Please Select Menu Category \n";
        slctFunctionType.style.background = 'rgba(255,0,0,0.1)';
    }
    if (menu.pricewithouthall == null) {
        errors = errors + "Please Enter Menu Price (Withot Hall) \n";
        PriceWithoutHallTxt.style.background = 'rgba(255,0,0,0.1)';
    }
    if (menu.pricewithhall == null) {
        errors = errors + "Please Enter Menu Price (With Hall) \n";
        PriceWithHallTxt.style.background = 'rgba(255,0,0,0.1)';
    }
    if (menu.menustatus_id == null) {
        errors = errors + "Please Select Menu Status \n";
        menuSlctStatus.style.background = 'rgba(255,0,0,0.1)';
    }
    if (menu.submenus.length == 0) {
        errors = errors + "Please Select Sub Menu \n";
        slctSubMenu.style.background = 'rgba(255,0,0,0.1)';
    }

    return errors;
}

const menuSubmit = () => {
    //1)check button 
    console.log("submit");

    //2)check errors 
    const errors = checkFormError();
    if (errors == "") {
        //3)get user confirmation 
        let userConfirm = confirm("Are you sure to Save following Menu Details..? \n" +
            "Menu Name : " + menu.name + "\n" +
            "Menu Category : " + menu.menucategory_id.name
        );
        if (userConfirm) {
            //4)call post request
            let postServerResponce = ajaxHTTPRequest("/menu", "POST", menu);
            //5)check post service responce
            if (postServerResponce == "OK") {
                alert("Save Successfully ✔");
                refreshMenuTable();
                formMenu.reset();
                refreshMenuForm();
                $('#offcanvasMenuAdd').offcanvas('hide');
            } else {
                alert("Fail to submit Menu ❌ \n" + postServerResponce);
            }
        }
    } else {
        alert("The form has following errors... please check the form again..\n" + errors);
    }
}

const refillMenuForm = (ob) => {
    //1)check button 
    console.log("refill");

    //disabled krl tibba update button ek enable krno
    btnMenuUpdate.disabled = false;

    //define menu n oldmenu objects
    //JSON. parse() : This method takes a JSON string and then transforms it into a JavaScript object.
    //assign table row object into hall object
    //object ek  string wlt covert kre hall ek update krddi oldHall ekath update nowi tiyennd oni nisa
    menu = JSON.parse(JSON.stringify(ob));
    oldMenu = JSON.parse(JSON.stringify(ob));

    //open menu form
    $('#offcanvasMenuAdd').offcanvas('show');

    //get submenus list for refill submenus
    fillDataIntoSelect(slctSubMenu, "", menu.submenus, "name")

    //set value into ui element
    //elementId.value = object.property
    nameTxt.value = menu.name;
    textNote.value = menu.note;
    PriceWithoutHallTxt.value = menu.pricewithouthall;
    PriceWithHallTxt.value = menu.pricewithhall;

    //fill wela tmi select wenn
    menuCategory = ajaxGetRequest("/menucategory/list");
    fillDataIntoSelect(slctMenuCategory, "Select Menu Category", menuCategory, "name", ob.menucategory_id.name);

    menuStatus = ajaxGetRequest("/menustatus/list");
    fillDataIntoSelect(slctMenuStatus, "Select Status", menuStatus, "name", ob.menustatus_id.name);

    functionType = ajaxGetRequest("/functiontype/list");
    fillDataIntoSelect(slctFunctionType, "Select Function Type", functionType, "name", ob.functiontype_id.name);

    btnMenuSubmit.disabled = "disabled";

    if (userPrivilege.priviupdate) {
        btnMenuUpdate.disabled = "";
    } else {
        btnMenuUpdate.disabled = "disabled"
    }
}

const checkFormUpdate = () => {
    let updates = "";

    if (menu.name != oldMenu.name) {
        updates = updates + "Menu name is changed " + oldMenu.name + " into " + menu.name + "\n";
    }
    if (menu.menucategory_id.name != oldMenu.menucategory_id.name) {
        updates = updates + "Menu Category is changed " + oldMenu.menucategory_id.name + " into " + menu.menucategory_id.name + "\n";
    }
    if (menu.functiontype_id.name != oldMenu.functiontype_id.name) {
        updates = updates + "Function Type is changed " + oldMenu.functiontype_id.name + " into " + menu.functiontype_id.name + "\n";
    }
    if (menu.pricewithouthall != oldMenu.pricewithouthall) {
        updates = updates + "Price (Without Hall) is changed " + oldMenu.pricewithouthall + " into " + menu.pricewithouthall + "\n";
    }
    if (menu.pricewithhall != oldMenu.pricewithhall) {
        updates = updates + "Price (With Hall) is changed " + oldMenu.pricewithhall + " into " + menu.pricewithhall + "\n";
    }
    if (menu.menustatus_id.name != oldMenu.menustatus_id.name) {
        updates = updates + "Menu Status is changed " + oldMenu.menustatus_id.name + " into " + menu.menustatus_id.name + "\n";
    }
    if (menu.note != oldMenu.note) {
        updates = updates + "Menu note is changed " + oldMenu.note + " into " + menu.note + "\n";
    }
    if (menu.submenus.length != oldMenu.submenus.length) {
        updates = updates + "Submenus Changed";
    }

    return updates;
}

const menuUpdate = () => {
    //1) check update button 
    console.log("update");
    console.log(menu);
    console.log(oldMenu);
    //2) check form errors
    let errors = checkFormError();
    if (errors == "") {
        //3) check what we have to update
        let updates = checkFormUpdate();
        if (updates == "") {
            alert("Nothing to Update..!");
        } else {
            //4)get user confirm
            let userConfirm = confirm("Are you sure to UPDATE following record? \n" + updates);
            if (userConfirm) {
                //5)call put service
                let putServiceResponce = ajaxHTTPRequest("/menu", "PUT", menu);
                //6)check put service responce
                if (putServiceResponce == "OK") {
                    alert("Update Successfully ✔");
                    refreshMenuTable();
                    formMenu.reset();
                    refreshMenuForm();
                    $('#offcanvasMenuAdd').offcanvas('hide');
                } else {
                    alert("Fail to Update Menu Details ❌ \n" + putServiceResponce);
                }
            }
        }
    } else {
        alert("Form has some errors... please check the form again..\n" + errors);
    }
}

const deleteMenu = (ob) => {
    //1)check the button 
    console.log("delete");
    //2)get user confirmation
    let userConfirm = confirm("Are you sure to DELETE following Menu Details..? \n" +
        "Menu Name : " + ob.name + "\n" +
        "Menu Category : " + ob.menucategory_id.name
    );
    if (userConfirm) {
        //3)call delete request
        let deleteServerResponce = ajaxHTTPRequest("/menu", "DELETE", ob);
        //check delete service responce 
        if (deleteServerResponce == "OK") {
            alert("Delete Successfully ✔");
            refreshMenuTable();
        } else {
            alert("Fail to delete Menu ❌ \n" + deleteServerResponce);
        }
    }
}

const printMenu = (ob) => {
    console.log("print");
    let newWindow = window.open();
    newWindow.document.write(
        "<head>" +
        " <link rel='stylesheet' href='resources/bootstrap-5.3.1-dist/bootstrap-5.3.1-dist/css/bootstrap.min.css'></link>"
        + "</head>" +
        "<body>" + "<table class='table table-primary table-bordered'>" +
        "<thead>" +
        "<tr>" +
        "<th>Menu Name</th>" +
        "<th>Menu Category</th>" +
        "<th>Sub Menu Items</th>" +
        "<th>Price without Hall</th>" +
        "<th>Price with Hall</th>" +
        "<th>Menu Status</th>" +
        "</tr>" +
        "</thead>" +
        "<tbody>" +
        "<tr>" +
        "<td>" + ob.name + "</td>" +
        "<td>" + ob.menucategory_id.name + "</td>" +
        "<td>" + ob.submenus.name + "</td>" +
        "<td>" + ob.menu.pricewithouthall + "</td>" +
        "<td>" + ob.menu.pricewithhall + "</td>" +
        "<td>" + ob.menustatus_id.name + "</td>" +
        "</tbody>" +
        "</table>" +
        "</body>"
    );
    setTimeout(function () {
        newWindow.print()
    }, 500)
}

const refreshMenuForm = () => {

    menu = {};
    oldMenu = null;

    menu.submenus = [];

    allSubmenus = ajaxGetRequest("/submenu/printall");

    submenuCategory = ajaxGetRequest("/submenucategory/list");
    fillDataIntoSelect(slctSubMenuCategory, "Select Sub Menu Category", submenuCategory, "name");

    menuCategory = ajaxGetRequest("/menucategory/list");
    fillDataIntoSelect(slctMenuCategory, "Select Menu Category", menuCategory, "name");

    menuStatus = ajaxGetRequest("/menustatus/list");
    fillDataIntoSelect(slctMenuStatus, "Select Status", menuStatus, "name");

    functionType = ajaxGetRequest("/functiontype/list");
    fillDataIntoSelect(slctFunctionType, "Select Function Type", functionType, "name");

    //reset form
    nameTxt.style.border = "1px solid #ced4da";
    slctMenuCategory.style.border = "1px solid #ced4da";
    slctMenuStatus.style.border = "1px solid #ced4da";
    slctSubMenuCategory.style.border = "1px solid #ced4da";
    PriceWithoutHallTxt.style.border = "1px solid #ced4da";
    PriceWithHallTxt.style.border = "1px solid #ced4da";
    allSubMenu.style.border = "1px solid #ced4da";
    slctSubMenu.style.border = "1px solid #ced4da";
    slctFunctionType.style.border = "1px solid #ced4da";

    if (userPrivilege.priviinsert) {
        btnMenuSubmit.disabled = "";
    } else {
        btnMenuSubmit.disabled = "disabled"
    }
}

const getSubMenuByCategory = () => {
    const currentSubMenuCategoryId = JSON.parse(slctSubMenuCategory.value).id;
    slctSubMenuCategory.style.border = "2px solid green";
    //methana const ek ainnn kraa!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! Aulk nadd????????????????????????????????????????????
    submenusfilter = ajaxGetRequest("/submenu/getsubmenubycategory" + currentSubMenuCategoryId);
    fillDataIntoSelect(allSubMenu, "", submenusfilter, "name")
}

//function for add selected item (>)
const btnAddSelectSubMenu = () => {

    //check duplicate when clicking add btn
    let selectedSMenu = JSON.parse(allSubMenu.value);
    let extSMenu = false;

    //global level variable
    totalPrice = 0;


    for (const smenu of menu.submenus) {
        if (selectedSMenu.id == smenu.id) {
            extSMenu = true;
            break;
        }
    }
    if (extSMenu) {
        alert("This Submenu is already selected");
    } else {
        //all tiyen ek isslla variable ekkt daagannwa(select krgnnw eken 1k)
        let selectedSubmenu = JSON.parse(allSubMenu.value);

        //eken select krl ewa btn ek click krama ek selected list ekt dagann oni
        menu.submenus.push(selectedSubmenu);
        fillDataIntoSelect(slctSubMenu, "", menu.submenus, "name");

        //all list eken e selected list ekt giyapu ek ainn krgnnwa
        let extIndex = submenusfilter.map(submenu => submenu.name).indexOf(selectedSubmenu.name);
        if (extIndex != -1) {
            submenusfilter.splice(extIndex, 1);
        }
        //remove ewa ainn krl all list refresh krnw
        fillDataIntoSelect(allSubMenu, "", submenusfilter, "name");

        menu.submenus.forEach(subMenu => {
            totalPrice += subMenu.priceforoneportion;
        });
        
        //show price
        PriceWithoutHallTxt.value = parseFloat(totalPrice).toFixed(2);
        PriceWithHallTxt.value = parseFloat(totalPrice * 1.2).toFixed(2);
        menu.pricewithhall = PriceWithHallTxt.value;
        menu.pricewithouthall = PriceWithoutHallTxt.value;
        
    }

}

//function for add all items (>>)
const btnAddAll = () => {

    //check duplicate when clicking add btn
    let selectedSMenu = JSON.parse(allSubMenu.value);
    let extSMenu = false;

    for (const smenu of menu.submenus) {
        if (selectedSMenu.id == smenu.id) {
            extSMenu = true;
            break;
        }
    }
    if (extSMenu) {
        alert("This Submenu is already selected");
    } else {
        //for loop ekk dala okkom ekin ek anith paththata push krnw
        for (const submenu of submenusfilter) {
            menu.submenus.push(submenu);
        }
        //filldataintoselect eken e paththe items tika select eke pennawa
        fillDataIntoSelect(slctSubMenu, "", menu.submenus, "name");

        //tibba array ek empty krla ek mukuth nathi ek pennada oni nisa filldataintoselect ek dagannwa
        submenusfilter = [];
        fillDataIntoSelect(allSubMenu, "", submenusfilter, "name")
    }
}

//function for remove selected item (<)
const btnRemoveSelectSubMenu = () => {
    let selectedSubmenuForRemove = JSON.parse(slctSubMenu.value);

    submenusfilter.push(selectedSubmenuForRemove);
    fillDataIntoSelect(allSubMenu, "", submenusfilter, "name");

    let extIndex = menu.submenus.map(submenu => submenu.name).indexOf(selectedSubmenuForRemove.name);
    if (extIndex != -1) {
        menu.submenus.splice(extIndex, 1)
    }
    fillDataIntoSelect(slctSubMenu, "", menu.submenus, "name");
}

//function for remove all item (<<)
const btnRemoveAll = () => {
    for (const submenu of menu.submenus) {
        submenusfilter.push(submenu);
    }
    fillDataIntoSelect(allSubMenu, "", submenusfilter, "name");

    menu.submenus = [];
    fillDataIntoSelect(slctSubMenu, "", menu.submenus, "name");

}

//generate menu name for function type

const generateMenuName = ()=>{
    let selectedFunctionType = slctFunctionType.value;
    let selctedMenuCate = slctMenuCategory.value;
    let menuName;

    if(selectedFunctionType!=='Select Function Type' && selctedMenuCate!=='Select Menu Category'){
         menuName = JSON.parse(selectedFunctionType).name +" "+JSON.parse(selctedMenuCate).name
         //show genrated value
         nameTxt.value = menuName;
         //bind data
         menu.name = menuName;
    }

    nameTxt.style.border = "2px solid green";
}