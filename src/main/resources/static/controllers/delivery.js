window.addEventListener('load', () => {

    //mek methanin load krnn form eke withrak nwi table eketh button tiyenonh privilege balal enable/disable wennd oni
    userPrivilege = ajaxGetRequest("/privilage/bymodule/DELIVERY");

    refershDeliveryForm();
    refershDeliveryTable();

});

const refershDeliveryTable = () => {

    deliveryreservation = ajaxGetRequest("/delivery/getinpreparationreservation")
    //sorting (Bubble sort)
    deliveryreservation.sort((a, b) => b.id - a.id);

    //text --> string, number, date
    //function --> object,array, boolean --> craete function 
    //column count == object count
    //piliwelata dann 
    const displayProperty = [
        { dataType: 'text', propertyName: 'reservationcode' },
        { dataType: 'function', propertyName: getFunctionType },
        { dataType: 'text', propertyName: 'functiondate' },
        { dataType: 'text', propertyName: 'functionstarttime' },
        { dataType: 'function', propertyName: getReservationStatus },
        { dataType: 'function', propertyName: getKitchenStatus },
        { dataType: 'function', propertyName: getDeliveryStatus },
        { dataType: 'function', propertyName: getLorry }
    ];

    //call fillDataIntoTable function (tableId,dataList,displayPropertyArrayName,editFunctionName, deleteFuctionName,PrintFuctionName)
    fillDataIntoTableWithRefill(tableDelivery, deliveryreservation, displayProperty, refillDelivery, true, userPrivilege);

    //basicma jquery datatable active krgnn widiha
    $('#tableDelivery').dataTable();

}

const getFunctionType = (ob) => {
    return ob.functiontype_id.name;
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
const getDeliveryStatus = (ob) => {
    if (ob.delivery_status_id.name == 'Completed') {
        return '<span class="text-success fw-bold">Completed</span>'
    } else if (ob.delivery_status_id.name == 'Cancelled') {
        return '<span class="text-danger fw-bold">Cancelled</span>';
    } else if (ob.delivery_status_id.name == 'Dispatched') {
        return '<span class="text-primary fw-bold">Dispatched</span>';
    } else {
        return '<span class="text-warning fw-bold">Pending</span>';
    }
}

const getLorry = (ob) => {
    return ob.lorry_id.name;
}

const refillDelivery = (ob) => {
    console.log("refill");

    //define menu n oldmenu objects
    //JSON. parse() : This method takes a JSON string and then transforms it into a JavaScript object.
    //assign table row object into hall object
    //object ek  string wlt covert kre hall ek update krddi oldHall ekath update nowi tiyennd oni nisa
    reservation = JSON.parse(JSON.stringify(ob));
    oldReservation = JSON.parse(JSON.stringify(ob));


    //open reservation form 
    $('#refillDeliveryModal').modal('show');

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

    menus = ajaxGetRequest("/menu/printall");
    fillDataIntoSelect(slctMenuType, "Select Menu", menus, "name", ob.menu_id.name);

    reservationStatus = ajaxGetRequest("/reservationstatus/list");
    fillDataIntoSelect(slctReservationStatus, "Selct Status", reservationStatus, "name", ob.reservationstatus_id.name);

    kitchenStatus = ajaxGetRequest("/kitchenstatus/list");
    fillDataIntoSelect(slctKitchenStatus, "Select Kitchen Status", kitchenStatus, "name", ob.kitchen_status_id.name);

    deliveryStatus = ajaxGetRequest("/deliverystatus/list");
    fillDataIntoSelect(slctDeliveryStatus, "Select Delivery Status", deliveryStatus, "name", ob.delivery_status_id.name);

    lorryNames = ajaxGetRequest("/lorry/getavailablelorry/"+reservation.functiondate);
    fillDataIntoSelect(slectLorryStatus, "Select Lorry", lorryNames, "name");

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
    const inputs = document.querySelectorAll('.deliveryInputs');
    inputs.forEach(element => {
        element.disabled = true;
    });

    if (JSON.parse(slctDeliveryStatus.value).name == "Completed") {
        btnDispatch.disabled = true;
    } else {
        btnDispatch.disabled = false;
    }

}

const getAdditionalSubMenuName = (ob) => {

    return ob.submenu_id.name;
}

const acceptToGo = () => {
    //1) check update button 
    console.log(reservation);
    console.log(oldReservation);

    //2) get user confirmation
    Swal.fire({
        title: 'Confirm Message',
        html: 'Do you sure to dispatch this order?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, dispatched it!'
    }).then((result) => {
        if (result.isConfirmed) {
            //5) call put service
            let putServiceResponse = ajaxHTTPRequest("/delivery", "PUT", reservation)
            //6) check put service response
            if (putServiceResponse == "OK") {
                Swal.fire({
                    icon: 'success',
                    html: 'Delivery Details Update Successfully',
                    showConfirmButton: true,
                }).then(() => {
                    refershDeliveryTable();
                    refershDeliveryForm();
                    $('#refillDeliveryModal').modal('hide');
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    html: 'Failed to Update Delivery Details',
                    text: putServiceResponse,
                    showConfirmButton: true,
                });
            }
        }
    });
}

const refershDeliveryForm = () => {

    reservation = {};
    oldReservation = null;

    deliveryStatus = ajaxGetRequest("/deliverystatus/list");
    fillDataIntoSelect(slctDeliveryStatus, "Select Delivery Status", deliveryStatus, "name");

    /* lorryNames = ajaxGetRequest("/lorry/list");
    fillDataIntoSelect(slectLorryStatus, "Select Lorry", lorryNames, "name"); */
}

