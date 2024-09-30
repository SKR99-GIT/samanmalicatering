window.addEventListener('load', () => {

    //mek methanin load krnn form eke withrak nwi table eketh button tiyenonh privilege balal enable/disable wennd oni
    userPrivilege = ajaxGetRequest("/privilage/bymodule/SUBMENU");
    refershSubMenuTable();

    refershSubMenuForm();

});

const refershSubMenuTable = () => {
    //pass  the data in db to the table 
    submenus = ajaxGetRequest("/submenu/printall");

    //text --> string, number, date
    //function --> object,array, boolean --> craete function 
    //column count == object count
    //piliwelata dann 
    const displayProperty = [
        { dataType: 'function', propertyName: getSubMenuCategory },
        { dataType: 'text', propertyName: 'name' },
        { dataType: 'function', propertyName: getSubMenuPrice },
        { dataType: 'function', propertyName: getSubMenuStatus }
    ];

    //call fillDataIntoTable function (tableId,dataList,displayPropertyArrayName,editFunctionName, deleteFuctionName,PrintFuctionName)
    fillDataIntoTable(tableSubMenu, submenus, displayProperty, refillSubMenu, deleteSubMenu, printSubMenu, true, userPrivilege);

    //me ara delete krl tiyen ekk aaye delete krnnd bari wennd hadala tiyenn
    /*  employees.forEach((element, index) => {
        if (userPrivilege.prividelete && element.employeestatus_id.name == "Delete") {
            //table eke body ek allgen, eken table column ek allgen, eketh delete button ek allgnnd oni
            tableEmployee.children[1].children[index].children[10].children[1].disabled = "disabled";
            tableEmployee.children[1].children[index].children[10].children[1].style.cursor = "not-allowed";
        }
    }); */

    //basicma jquery datatable active krgnn widiha
    $('#tableSubMenu').dataTable();
}

const getSubMenuCategory = (ob) => {
    return ob.submenucategory_id.name;
}
const getSubMenuPrice = (ob) => {
    if (ob.priceforoneportion) {
        return parseFloat(ob.priceforoneportion).toFixed(2);
    }
}
const getSubMenuStatus = (ob) => {
    if (ob.submenustatus_id.name == 'Available') {
        return '<span class="text-success fw-bold">Available</span>'
    } else {
        return '<span class="text-danger fw-bold">Delete</span>';
    }
}

const checkFormError = () => {
    let errors = "";

    if (submenu.name == null) {
        errors = errors + "Please Enter Sub Menu Name \n";
        nameTxt.style.background = 'rgba(255,0,0,0.1)';
    }
    if (submenu.priceforoneportion == null) {
        errors = errors + "Please Enter Sub Menu Price \n";
        subMenuPriceTxt.style.background = 'rgba(255,0,0,0.1)';
    }
    if (submenu.submenucategory_id == null) {
        errors = errors + "Please Select Sub Menu Category \n";
        slctSubMenuCategory.style.background = 'rgba(255,0,0,0.1)';
    }
    if (submenu.submenustatus_id == null) {
        errors = errors + "Please Select Sub Menu Status \n";
        slctSubMenuStatus.style.background = 'rgba(255,0,0,0.1)';
    }

    return errors;
}

const submenuSubmit = () => {
    //3)check button 
    console.log("submit");

    // Check form error
    const errors = checkFormError();
    // If no errors
    if (errors == '') {
        // Get user confirmation using SweetAlert2
        Swal.fire({
            title: 'Confirm Addition',
            html: 'Are you sure to Save following Sub Menu Details..? <br>'
                + '<br> Sub Menu Name: ' + submenu.name
                + '<br> Sub Menu Category: ' + submenu.submenucategory_id.name,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, add it!',
            cancelButtonText: 'No, cancel',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                // Call POST service
                let postServerResponce = ajaxHTTPRequest("/submenu", "POST", submenu);
                // Check post service response
                if (postServerResponce == "OK") {
                    refershSubMenuTable();
                    formSubMenu.reset();
                    refershSubMenuForm();
                    $('#offcanvasSubMenuAdd').offcanvas('hide');

                    Swal.fire({
                        title: 'Success',
                        html: 'Save successfully!',
                        icon: 'success'
                    });
                } else {
                    Swal.fire({
                        title: 'Form Error',
                        html: 'Failed to submit Sub Menu \n' + postServerResponce,
                        icon: 'error'
                    });
                }
            }
        });
    } else {
        Swal.fire({
            title: 'Form Error',
            html: 'The form has the following errors. Please check the form again:\n' + errors,
            icon: 'error'
        });
    }
}

const refillSubMenu = (ob) => {
    //1)check refill button
    console.log("refill");

    //disabled krl tibba update button ek enable krno
    btnSubmenuUpdate.disabled = false;

    //define menu n oldmenu objects
    //JSON. parse() : This method takes a JSON string and then transforms it into a JavaScript object.
    //assign table row object into hall object
    //object ek  string wlt covert kre hall ek update krddi oldHall ekath update nowi tiyennd oni nisa
    submenu = JSON.parse(JSON.stringify(ob));
    oldSubmenu = JSON.parse(JSON.stringify(ob));

    //open submenu form 
    $('#offcanvasSubMenuAdd').offcanvas('show');

    //set value into ui element
    //elementId.value = object.property
    nameTxt.value = submenu.name;
    subMenuPriceTxt.value = submenu.priceforoneportion;
    textNote.value = submenu.note;

    //fill wela tmi select wenn
    submenuCategory = ajaxGetRequest("/submenucategory/list");
    fillDataIntoSelect(slctSubMenuCategory, "Select Category..", submenuCategory, "name", ob.submenucategory_id.name);

    submneuStatus = ajaxGetRequest("/submenustatus/list");
    fillDataIntoSelect(slctSubMenuStatus, "Select Status...", submneuStatus, "name", ob.submenustatus_id.name);

    btnSubmenuSubmit.disabled = "disabled";

    if (userPrivilege.priviupdate) {
        btnSubmenuUpdate.disabled = "";
    } else {
        btnSubmenuUpdate.disabled = "disabled"
    }

    refreshInnerFormAndTable();
}

const checkFormUpdate = () => {
    let updates = "";

    if (submenu.name != oldSubmenu.name) {
        updates = updates + "Sub Menu name is changed " + oldSubmenu.name + " into " + submenu.name + "\n";
    }
    if (submenu.priceforoneportion != oldSubmenu.priceforoneportion) {
        updates = updates + "Subb Menu Price is changed " + oldSubmenu.priceforoneportion + " into " + submenu.priceforoneportion + "\n";
    }
    if (submenu.note != oldSubmenu.note) {
        updates = updates + "Subb Menu Note is changed " + oldSubmenu.note + " into " + submenu.note + "\n";
    }
    if (submenu.submenucategory_id.name != oldSubmenu.submenucategory_id.name) {
        updates = updates + "Sub Menu Category is changed " + oldSubmenu.submenucategory_id.name + " into " + submenu.submenucategory_id.name + "\n";
    }
    if (submenu.submenustatus_id.name != oldSubmenu.submenustatus_id.name) {
        updates = updates + "Sub Menu Status is changed " + oldSubmenu.submenustatus_id.name + " into " + submenu.submenustatus_id.name + "\n";
    }
    return updates;
}

const submenuUpdate = () => {
    //1) check update button
    console.log("update");
    console.log(submenu);
    console.log(oldSubmenu);

    //2) check form errors
    let errors = checkFormError();
    if (errors == "") {
        //3) check what we have to update
        let updates = checkFormUpdate();
        if (updates == "") {
            Swal.fire({
                icon: 'info',
                html: 'Nothing to Update..!',
                showConfirmButton: true,
            });
        } else {
            //4) get user confirmation
            Swal.fire({
                title: 'Are you sure to UPDATE the following record?',
                html: updates,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, update it!'
            }).then((result) => {
                if (result.isConfirmed) {
                    //5) call put service
                    let putServiceResponce = ajaxHTTPRequest("/submenu", "PUT", submenu)
                    //6) check put service response
                    if (putServiceResponce == "OK") {
                        Swal.fire({
                            icon: 'success',
                            html: 'Update Successfully',
                            showConfirmButton: true,
                        }).then(() => {
                            refershSubMenuTable();
                            formSubMenu.reset();
                            refershSubMenuForm();
                            $('#offcanvasSubMenuAdd').offcanvas('hide');
                        });
                    } else {
                        Swal.fire({
                            icon: 'error',
                            html: 'Failed to Update Sub Menu Details',
                            text: putServiceResponce,
                            showConfirmButton: true,
                        });
                    }
                }
            });
        }
    } else {
        Swal.fire({
            icon: 'error',
            html: 'Form has some errors... please check the form again..',
            text: errors,
            showConfirmButton: true,
        });
    }
}

const deleteSubMenu = (ob) => {
    //1)check button 
    console.log("delete");

    //2) get user confirmation
    // Get user confirmation using SweetAlert2
    Swal.fire({
        title: 'Confirm Delete Details',
        html: 'Are you sure to DELETE following Sub Menu Details..?  <br>'
            + 'Sub Menu Category : ' + ob.submenucategory_id.name
            + '<br> Sub Menu Name: ' + ob.name,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            // call delete service
            let deleteServerResponce = ajaxHTTPRequest("/submenu", "DELETE", ob);
            // check delete service responce
            if (deleteServerResponce == "OK") {
                refershSubMenuTable();

                Swal.fire({
                    title: 'Success',
                    text: 'Sub Menu Delete Successfully!',
                    icon: 'success'
                });
            } else {
                Swal.fire({
                    title: 'Form Error',
                    text: 'Failed to delete submenu \n' + deleteServerResponce,
                    icon: 'error'
                });
            }
        }
    });
}

const printSubMenu = (rowOb, rowIndex) => {
    //open view details
    $('#submenuViewModal').modal('show');

    viewSubMenuCat.innerHTML = rowOb.submenucategory_id.name;
    viewSubMenuName.innerHTML = rowOb.name;
    viewPrice.innerHTML = rowOb.priceforoneportion;
    viewAddDateTime.innerHTML = rowOb.addeddatetime.split("T")[0] + " " + rowOb.addeddatetime.split("T")[1];
    viewNote.innerHTML = rowOb.note;

}

const btnPrintRow = () => {
    console.log("print");
    console.log(submenu);

    let newWindow = window.open();
    newWindow.document.write("<html><head>" +
        "<link rel='stylesheet' href='resources/bootstrap-5.3.1-dist/bootstrap-5.3.1-dist/css/bootstrap.min.css'></link>" +
        "<title>" + "Sub Menu Details" + "</title>"
        + "</head><body>" +
        "<h2>" + "Sub Menu Details" + "</h2>" +
        printSubmenuTable.outerHTML + "<script>printSubmenuTable.classList.remove('d-none');</script></body></html>"
    );

    setTimeout(() => {
        newWindow.stop();//table ek load wena ek nawathinw
        newWindow.print();//table ek print weno
        newWindow.close();//aluthin open una window tab ek close weno
        //ar data load wenn nm  time out ekk oni weno aduma 500k wth
    }, 500)
}

const refershSubMenuForm = () => {

    submenu = {};
    oldSubmenu = null;

    submenu.submenuhasingredientslist = new Array();

    submenuCategory = ajaxGetRequest("/submenucategory/list");
    fillDataIntoSelect(slctSubMenuCategory, "Select Category..", submenuCategory, "name");

    submneuStatus = ajaxGetRequest("/submenustatus/list");
    fillDataIntoSelect(slctSubMenuStatus, "Select Status...", submneuStatus, "name");

    slctSubMenuCategory.style.boder = "1px solid #ced4da";
    nameTxt.style.boder = "1px solid #ced4da";
    subMenuPriceTxt.style.boder = "1px solid #ced4da";
    slctSubMenuStatus.style.boder = "1px solid #ced4da";
    textNote.style.boder = "1px solid #ced4da";

    if (userPrivilege.priviinsert) {
        btnSubmenuSubmit.disabled = "";
    } else {
        btnSubmenuSubmit.disabled = "disabled"
    }

    refreshInnerFormAndTable();
}

//inner form area start
const refreshInnerFormAndTable = () => {
    //refresh form area
    submenuhasingredients = {};

    ingredients = ajaxGetRequest("/ingredients/printall");
    fillDataIntoSelect(nameIngredient, "Select Ingredient", ingredients, "name");

    //refresh table area
    let displayPropertyList = [
        { dataType: "function", propertyName: getIngName },
        { dataType: "function", propertyName: getQty }
    ];

    fillDataIntoInnerTable(tableInner, submenu.submenuhasingredientslist, displayPropertyList, deleteInnerForm);

    $("#tableInner").dataTable();

    nameIngredient.style.border = "1px solid #ced4da";
    qtyTxt.style.border = "1px solid #ced4da";
}

const deleteInnerForm = (innerOb) => {
    Swal.fire({
        title: 'Are you sure to remove the ingredient?',
        text: "Ingredient Name: " + innerOb.ingredients_id.name,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, remove it!'
    }).then((result) => {
        if (result.isConfirmed) {
            let extIndex = submenu.submenuhasingredientslist.map(submenuing => submenuing.ingredients_id.id).indexOf(innerOb.ingredients_id.id);
            if (extIndex != -1) {
                submenu.submenuhasingredientslist.splice(extIndex, 1);
                Swal.fire({
                    icon: 'success',
                    title: 'Ingredient Removed Successfully!',
                    showConfirmButton: true,
                }).then(() => {
                    refreshInnerFormAndTable();
                });
            }
        }
    });
}

const getIngName = (innerOb) => {
    return innerOb.ingredients_id.name;
}

const getQty = (innerOb) => {
    return parseFloat(innerOb.quantity).toFixed(3);
}

const checkInnerFormError = () => {
    let errors = "";

    if (submenuhasingredients.ingredients_id.id == null) {
        errors = errors + "Please select ingredients \n";
    }
    if (submenuhasingredients.quantity == null) {
        errors = errors + "Please enter Quantity \n";
    }
    return errors;
}

const innerSubmit = () => {
    //check duplicate 
    let selctctIngredients = JSON.parse(nameIngredient.value);
    let extIng = false;

    for (const submenuing of submenu.submenuhasingredientslist) {
        if (selctctIngredients.id == submenuing.ingredients_id.id) {
            extIng = true;
            break;
        }
    }
    if (extIng) {
        Swal.fire({
            icon: 'warning',
            html: 'Selected Ingredients Already Ext...!',
            showConfirmButton: true,
        });
        submenuhasingredients = {};
        qtyTxt.value = "";
        nameIngredient.style.border = "1px solid #ced4da";
        qtyTxt.style.border = "1px solid #ced4da";
    } else {
        let errors = checkInnerFormError();
        if (errors == "") {
            Swal.fire({
                title: 'Are you sure to submit the selected ingredient?',
                html: "Ingredient Name: " + submenuhasingredients.ingredients_id.name,
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, submit it!'
            }).then((result) => {
                if (result.isConfirmed) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Ingredients added successfully!',
                        showConfirmButton: true,
                    }).then(() => {
                        submenu.submenuhasingredientslist.push(submenuhasingredients);
                        refreshInnerFormAndTable();
                    });
                }
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Inner Form Has Following Errors',
                text: errors,
                showConfirmButton: true,
            });
        }
    }
}