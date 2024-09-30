window.addEventListener('load', () => {

    //mek methanin load krnn form eke withrak nwi table eketh button tiyenonh privilege balal enable/disable wennd oni
    userPrivilege = ajaxGetRequest("/privilage/bymodule/KITCHEN");

    refershKitchenForm();
    refershKitchenTable();

});

const refershKitchenTable = () => {

    kitchenreservations = ajaxGetRequest("/kitchen/getUpcomingKitchenReservation")

    //text --> string, number, date
    //function --> object,array, boolean --> craete function 
    //column count == object count
    //piliwelata dann 
    const displayProperty = [
        { dataType: 'text', propertyName: 'reservationcode' },
        { dataType: 'function', propertyName: getFunctionType },
        { dataType: 'text', propertyName: 'functiondate' },
        { dataType: 'text', propertyName: 'functionstarttime' },
        { dataType: 'text', propertyName: 'participatecount' },
        { dataType: 'function', propertyName: getTotalAmount },
        { dataType: 'function', propertyName: getReservationStatus },
        { dataType: 'function', propertyName: getKitchenStatus }
    ];

    //call fillDataIntoTable function (tableId,dataList,displayPropertyArrayName,editFunctionName, deleteFuctionName,PrintFuctionName)
    fillDataIntoTableWithRefill(tableKitchen, kitchenreservations, displayProperty, refillKitchen, true, userPrivilege);

    //basicma jquery datatable active krgnn widiha
    $('#tableKitchen').dataTable();


}

const getFunctionType = (ob) => {
    return ob.functiontype_id.name;
}

const getTotalAmount = (ob) => {
    return parseFloat(ob.totalprice).toFixed(2);
}

const getReservationStatus = (ob) => {
    if (ob.reservationstatus_id.name == 'Fully paid') {
        return '<span class="text-success fw-bold">Fully paid</span>'
    } else if (ob.reservationstatus_id.name == 'Completed') {
        return '<span class="text-success fw-bold">Completed</span>';
    } else if (ob.reservationstatus_id.name == 'Cancelled') {
        return '<span class="text-danger fw-bold">Cancelled</span>';
    } else if (ob.reservationstatus_id.name == 'Confirmed') {
        return '<span class="text-primary fw-bold">Confirmed</span>';
    } else {
        return '<span class="text-info fw-bold">Pending</span>';
    }
}

const getKitchenStatus = (ob) => {
    if (ob.kitchen_status_id.name == 'Completed') {
        return '<span class="text-success fw-bold">Completed</span>'
    } else if (ob.kitchen_status_id.name == 'Cancelled') {
        return '<span class="text-danger fw-bold">Cancelled</span>';
    } else if (ob.kitchen_status_id.name == 'In Preparation') {
        return '<span class="text-primary fw-bold">In Preparation</span>';
    } else {
        return '<span class="text-warning fw-bold">Not Started</span>';
    }
}

const refillKitchen = (ob) => {
    console.log("refill");

    //define menu n oldmenu objects
    //JSON. parse() : This method takes a JSON string and then transforms it into a JavaScript object.
    //assign table row object into hall object
    //object ek  string wlt covert kre hall ek update krddi oldHall ekath update nowi tiyennd oni nisa
    reservation = JSON.parse(JSON.stringify(ob));
    oldReservation = JSON.parse(JSON.stringify(ob));


    //open reservation form 
    $('#refillKitchenModal').modal('show');

    //set value into ui element
    //elementId.value = object.property
    countTxt.value = reservation.participatecount
    dateTxt.value = reservation.functiondate
    timeTxt.value = reservation.functionstarttime
    MenuPriceTxt.value = reservation.menuprice
    textNote.value = reservation.note

    //fill dynamic dropdown--> fill wela tmi select wenn
    customers = ajaxGetRequest("/customer/printall");
    fillDataIntoSelect2(slctCustomerName, "Select Customer", customers, "mobile", "name", ob.customer_id.mobile);

    functionTypes = ajaxGetRequest("/functiontype/list");
    fillDataIntoSelect(slctFunctionType, "Select Function Type", functionTypes, "name", ob.functiontype_id.name);

    halls = ajaxGetRequest("/hall/printall");
    fillDataIntoSelect(slctHallName, "Select Functio Hall", halls, "name", ob.functionhall_id.name);

    menus = ajaxGetRequest("/menu/printall");
    fillDataIntoSelect(slctMenuType, "Select Menu", menus, "name", ob.menu_id.name);

    reservationStatus = ajaxGetRequest("/reservationstatus/list");
    fillDataIntoSelect(slctReservationStatus, "Selct Status", reservationStatus, "name", ob.reservationstatus_id.name);

    kitchenStatus = ajaxGetRequest("/kitchenstatus/list");
    fillDataIntoSelect(slctKitchenStatus, "Select Kitchen Status", kitchenStatus, "name", ob.kitchen_status_id.name);

    //fill table
    columnListForAdditionalMenuList = [
        { propertyName: getAdditionalSubMenuName, dataType: 'function' },
    ]
    columnListForSubMenuList = [
        { propertyName: 'name', dataType: 'text' },
    ]

    fillDataIntoTableWithoutModify(tableAdditionalSubmenu, ob.reservationhasadditionalsubmenulist, columnListForAdditionalMenuList);

    fillDataIntoTableWithoutModify(tableSubmenu, ob.submenus, columnListForSubMenuList);

    //get all the inputs using class name (to disabled feilds)
    const inputs = document.querySelectorAll('.kitchenInputs');
    inputs.forEach(element => {
        element.disabled = true;
    });

    let allIngeridientList = [];
    for (const rhaSubmenu of ob.reservationhasadditionalsubmenulist) {
        for (const submenuIng of rhaSubmenu.submenu_id.submenuhasingredientslist) {
            let allind = new Object();
            allind.ingredients_id = submenuIng.ingredients_id;
            allind.qty = (parseFloat(submenuIng.quantity) * parseFloat(reservation.participatecount)).toFixed(3);
            allind.avqty = 0;
            allIngeridientList.push(allind);
        }

    }

    for (const submenu of ob.submenus) {
        for (const submenuIng of submenu.submenuhasingredientslist
        ) {
            let allind = new Object();
            allind.ingredients_id = submenuIng.ingredients_id;
            allind.qty = (parseFloat(submenuIng.quantity) * parseFloat(reservation.participatecount)).toFixed(3);
            allind.avqty = 0;

            allIngeridientList.push(allind);
        }
    }



    for (const index in allIngeridientList) {
        let ingredientExt = reservation.reservationhasingredientslist.map(reshasIndt => reshasIndt.ingredients_id.id).indexOf(allIngeridientList[index].ingredients_id.id);

        if (ingredientExt != -1) {
            reservation.reservationhasingredientslist[ingredientExt].required_qty = parseFloat(reservation.reservationhasingredientslist[ingredientExt].required_qty) + parseFloat(allIngeridientList[index].qty);
        } else {
            let allind = new Object();
            allind.ingredients_id = allIngeridientList[index].ingredients_id;
            allind.required_qty = parseFloat(allIngeridientList[index].qty).toFixed(3);
            allind.available_qty = 0;
            reservation.reservationhasingredientslist.push(allind);
        }
    }
    console.log(reservation.reservationhasingredientslist);

    for (const reshi of reservation.reservationhasingredientslist) {
        let ingredientInventory = ajaxGetRequest("/inventory/byingredient/" + reshi.ingredients_id.id);
        if (ingredientInventory > 0) {
            reshi.available_qty = ingredientInventory;
        }
        else {
            reshi.available_qty = 0;
        }
        console.log(ingredientInventory);
    }


    // fill data into inner table
    columnListForIngredientist = [
        { propertyName: getIngredientName, dataType: 'function' },
        { propertyName: getRequiredQty, dataType: 'function' },
        { propertyName: 'available_qty', dataType: 'text' },
    ]
    fillDataIntoTableWithoutModify(tableIngredientsSubmenu, reservation.reservationhasingredientslist, columnListForIngredientist);

    let canApprove = true;
    for (const index in reservation.reservationhasingredientslist) {
        if (reservation.reservationhasingredientslist[index].available_qty < reservation.reservationhasingredientslist[index].required_qty) {
            tableIngredientsSubmenu.children[1].children[index].style.backgroundColor = 'rgba(255,0,0,0.3)';
            canApprove = false;
        } else {
            tableIngredientsSubmenu.children[1].children[index].style.backgroundColor = 'rgba(0,255,0,0.3)'
        }
    }

    if (canApprove) {
        kitchenStatus = ajaxGetRequest("/kitchenstatus/list");
        fillDataIntoSelect(slctKitchenStatus, "Select Kitchen Status", kitchenStatus, "name", "In Preparation");
        reservation.kitchen_status_id = JSON.parse(slctKitchenStatus.value);
        btnAccpept.disabled = false;
        btnPrintTable.disabled = true;
    } else {
        btnAccpept.disabled = true;
        btnPrintTable.disabled = false;
    }


}

const getAdditionalSubMenuName = (ob) => {

    return ob.submenu_id.name;
}

const getIngredientName = (ob) => {

    return ob.ingredients_id.name;
}

const getRequiredQty = (ob) => {
    return ob.required_qty;
}

const getAvailableQty = (ob) => {
    return ob.available_qty;
}

const acceptToPrepare = () => {
    //1) check update button 
    console.log(reservation);
    console.log(oldReservation);

    //2) get user confirmation
    Swal.fire({
        title: 'Confirm Message',
        html: 'Are you sure to Accept following Kitchen Details?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, accept it!'
    }).then((result) => {
        if (result.isConfirmed) {
            //5) call put service
            let putServiceResponse = ajaxHTTPRequest("/kitchen", "PUT", reservation)
            //6) check put service response
            if (putServiceResponse == "OK") {
                Swal.fire({
                    icon: 'success',
                    html: 'Kichen Details Update Successfully',
                    showConfirmButton: true,
                }).then(() => {
                    refershKitchenTable();
                    refershKitchenForm();
                    $('#refillKitchenModal').modal('hide');
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    html: 'Failed to Update Kitchen Details',
                    text: putServiceResponse,
                    showConfirmButton: true,
                });
            }
        }
    });
}

const reshiTablePrint = () => {
    let newWindow = window.open();
    newWindow.document.write(
        "<html><head>" +
        "<link rel='stylesheet'href='resources/bootstrap-5.3.1-dist/bootstrap-5.3.1-dist/css/bootstrap.min.css'></link>" +
        "<title>" + "Required Ingredient Table" + "</title>"
        + "</head><body>" +
        "<h2>" + "Required Ingredient Table" + "</h2>" +
        tableIngredientsSubmenu.outerHTML
    );
    setTimeout(() => {
        newWindow.stop();
        newWindow.print();
        newWindow.close();
    }, 500)
}

const refershKitchenForm = () => {

    reservation = {};
    oldReservation = null;

    kitchenStatus = ajaxGetRequest("/kitchenstatus/list");
    fillDataIntoSelect(slctKitchenStatus, "Select Kitchen Status", kitchenStatus, "name");
}

