window.addEventListener('load', () => {

    //mek methanin load krnn form eke withrak nwi table eketh button tiyenonh privilege balal enable/disable wennd oni
    userPrivilege = ajaxGetRequest("/privilage/bymodule/RESERVATION");

    refershReservationTable();
    refershReservationForm();

    removedList = []

});

const refershReservationTable = () => {

    reservations = ajaxGetRequest("/reservation/printall")

    //text --> string, number, date
    //function --> object,array, boolean --> craete function 
    //column count == object count
    //piliwelata dann 
    const displayProperty = [
        { dataType: 'text', propertyName: 'reservationcode' },
        { dataType: 'function', propertyName: getCustomerName },
        { dataType: 'function', propertyName: getFunctionType },
        { dataType: 'text', propertyName: 'functiondate' },
        { dataType: 'text', propertyName: 'functionstarttime' },
        { dataType: 'text', propertyName: 'participatecount' },
        { dataType: 'function', propertyName: getTotalAmount },
        { dataType: 'function', propertyName: getReservationStatus }
    ];

    //call fillDataIntoTable function (tableId,dataList,displayPropertyArrayName,editFunctionName, deleteFuctionName,PrintFuctionName)
    fillDataIntoTable(tableReservation, reservations, displayProperty, refillReservationForm, deleteReservation, printReservation, true, userPrivilege);


    //me ara delete krl tiyen ekk aaye delete krnnd bari wennd hadala tiyenn
    reservations.forEach((element, index) => {
        if (userPrivilege.prividelete && element.reservationstatus_id.name !== "Pending") {
            //table eke body ek allgen, eken table column ek allgen, eketh delete button ek allgnnd oni
            tableReservation.children[1].children[index].children[9].children[1].disabled = true;
            tableReservation.children[1].children[index].children[9].children[1].style.cursor = "not-allowed";
        }
    });

    //basicma jquery datatable active krgnn widiha
    $('#tableReservation').dataTable();
}

const getCustomerName = (ob) => {
    return ob.customer_id.name;
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

const checkFormError = () => {
    let errors = "";

    if (reservation.customer_id == null) {
        errors = errors + "Please Select The Customer Name  <br>";
        slctCustomerName.style.background = 'rgba(255,0,0,0.1)';
    }
    if (reservation.participatecount == null) {
        errors = errors + "Please Enter Participation Count  <br>";
        countTxt.style.background = 'rgba(255,0,0,0.1)';
    }
    if (reservation.functiondate == null) {
        errors = errors + "Please Enter Function Date  <br>";
        dateTxt.style.background = 'rgba(255,0,0,0.1)';
    }
    if (reservation.functionstarttime == null) {
        errors = errors + "Please Enter Function Start Time  <br>";
        startTimeTxt.style.background = 'rgba(255,0,0,0.1)';
    }
    if (reservation.functionendtime == null) {
        errors = errors + "Please Enter Function End Time  <br>";
        startTimeTxt.style.background = 'rgba(255,0,0,0.1)';
    }
    if (reservation.menuprice == null) {
        errors = errors + "Please Enter Menu Price  <br>";
        MenuPriceTxt.style.background = 'rgba(255,0,0,0.1)';
    }
    if (reservation.totalmenuprice == null) {
        errors = errors + "Please Enter Total Menu Price  <br>";
        MenuPriceTotalTxt.style.background = 'rgba(255,0,0,0.1)';
    }
    if (reservation.totalprice == null) {
        errors = errors + "Please Enter Total Price   <br>";
        totalPriceTxt.style.background = 'rgba(255,0,0,0.1)';
    }
    /* if (reservation.advanceamount == null) {
        errors = errors + "Please Enter Total Price   <br>";
        advanceAmountTxt.style.background = 'rgba(255,0,0,0.1)';
    } */
    if (reservation.menu_id == null) {
        errors = errors + "Please Select The Menu  <br>";
        slctMenuType.style.background = 'rgba(255,0,0,0.1)';
    }
    if (reservation.functiontype_id == null) {
        errors = errors + "Please Select Function Type  <br>";
        slctFunctionType.style.background = 'rgba(255,0,0,0.1)';
    }
    if (reservation.reservationstatus_id == null) {
        errors = errors + "Please Select Status <br>";
        slctReservationStatus.style.background = 'rgba(255,0,0,0.1)';
    }
    if (reservation.submenus.length == 0) {
        errors = errors + "Please Select Sub Menu <br>";
        selectSubMenu.style.background = 'rgba(255,0,0,0.1)';
    }
    return errors;

}

const reservationSubmit = () => {
    //1)check button
    console.log("submit");

    // Check form error
    const errors = checkFormError();
    // If no errors
    if (errors == '') {
        // Get user confirmation using SweetAlert2
        Swal.fire({
            title: 'Confirm Addition',
            html: 'Are you sure to Save following Reservation Details..?  <br>'
                + '<br> Customer Name : ' + reservation.customer_id.name
                + '<br> Function Type : ' + reservation.functiontype_id.name
                + '<br> Function Date : ' + reservation.functiondate,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, add it!',
            cancelButtonText: 'No, cancel',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                // Call POST service
                let postServerResponce = ajaxHTTPRequest("/reservation", "POST", reservation);
                // Check post service response
                if (postServerResponce == "OK") {
                    refershReservationTable();
                    formReservation.reset();
                    refershReservationForm();
                    $('#modalReservationAdd').modal('hide');

                    Swal.fire({
                        title: 'Success',
                        html: 'New Reservation added successfully!',
                        icon: 'success'
                    });
                } else {
                    Swal.fire({
                        title: 'Form Error',
                        html: 'Failed to submit Reservation. <br>' + postServerResponce,
                        icon: 'error'
                    });
                }
            }
        });
    } else {
        Swal.fire({
            title: 'Form Error',
            html: 'The form has the following errors. Please check the form again:<br>' + errors,
            icon: 'error'
        });
    }
}

const refillReservationForm = (ob) => {
    //check button
    console.log("refill");

    btnReservationUpdate.disabled = false;
    servicePrice.disabled = false;

    //define menu n oldmenu objects
    //JSON. parse() : This method takes a JSON string and then transforms it into a JavaScript object.
    //assign table row object into hall object
    //object ek  string wlt covert kre hall ek update krddi oldHall ekath update nowi tiyennd oni nisa
    reservation = JSON.parse(JSON.stringify(ob));
    oldReservation = JSON.parse(JSON.stringify(ob));

    //open reservation form 
    $('#modalReservationAdd').modal('show');

    //set value into ui element
    //elementId.value = object.property
    countTxt.value = reservation.participatecount
    dateTxt.value = reservation.functiondate
    startTimeTxt.value = reservation.functionstarttime
    endTimeTxt.value = reservation.functionendtime
    //advanceAmountTxt.value = reservation.advanceamount
    MenuPriceTxt.value = reservation.menuprice
    MenuPriceTotalTxt.value = reservation.totalmenuprice
    servicePrice.value = reservation.serviceprice
    additionalPriceTxt.value = reservation.additionalsubmenuprice
    totalPriceTxt.value = reservation.totalprice
    textNote.value = reservation.note

    //get submenu list for refill
    fillDataIntoSelect(selectSubMenu, "", reservation.submenus, "name")

    //fill dynamic dropdown--> fill wela tmi select wenn
    customers = ajaxGetRequest("/customer/printall");
    fillDataIntoSelect2(slctCustomerName, "Select Customer", customers, "mobile", "name", ob.customer_id.mobile);

    functionTypes = ajaxGetRequest("/functiontype/list");
    fillDataIntoSelect(slctFunctionType, "Select Function Type", functionTypes, "name", ob.functiontype_id.name);

    menus = ajaxGetRequest("/menu/printall");
    fillDataIntoSelect(slctMenuType, "Select Menu", menus, "name", ob.menu_id.name);
    //sirgen ahnn category ek dGnn khmd kiyl

    reservationStatus = ajaxGetRequest("/reservationstatus/list");
    fillDataIntoSelect(slctReservationStatus, "Selct Status", reservationStatus, "name", ob.reservationstatus_id.name);

    halls = ajaxGetRequest("/hall/printall");
    fillDataIntoSelect(slctHallName, "Select Functio Hall", halls, "name", ob.functionhall_id.name);

    btnReservationSubmit.disabled = "disabled";

    if (userPrivilege.priviupdate) {
        btnReservationUpdate.disabled = "";
    } else {
        btnReservationUpdate.disabled = "disabled"
    }

    if (JSON.parse(slctReservationStatus.value).name !== "Pending") {
        btnReservationUpdate.disabled = true;
    }

    refreshServiceInnerFormAndTable();
    refreshSubmenuInnerFormAndTable();
}

const generateEndTime = () => {
    let functionType = JSON.parse(slctFunctionType.value)
    let startTime = startTimeTxt.value;
    let currenddate = new Date("2024-01-01T" + startTime)
    currenddate.setHours(currenddate.getHours() + Number(functionType.duration));
    const timeString = currenddate.toTimeString().slice(0, 5);
    endTimeTxt.value = timeString
    endTimeTxt.style.border = "1px solid green";
    reservation.functionendtime = endTimeTxt.value;
}

/* const generateAdvance = () => {
    let totalPrice = totalPriceTxt.value;
    advanceAmountTxt.value = parseFloat(totalPrice * 0.2).toFixed(2);
    advanceAmountTxt.style.border = "1px solid green";
    reservation.advanceamount = advanceAmountTxt.value;
} */

const generateMenuTotal = () => {
    if (countTxt.value != "") {
        MenuPriceTotalTxt.value = (parseFloat(countTxt.value) * parseFloat(MenuPriceTxt.value)).toFixed(2);
        totalPriceTxt.value = MenuPriceTotalTxt.value;
        MenuPriceTotalTxt.style.border = "1px solid green";
        totalPriceTxt.style.border = "1px solid green";
        MenuPriceTotalTxt.disabled = "disabled";
        totalPriceTxt.disabled = "disabled";
        reservation.totalmenuprice = MenuPriceTotalTxt.value;
        reservation.totalprice = totalPriceTxt.value;
    } else {
        MenuPriceTotalTxt.value = "Enter Count";
    }
}

const checkFormUpdate = () => {
    let updates = "";

    if (reservation.participatecount != oldReservation.participatecount) {
        updates = updates + "Praticipation Count is changed " + oldReservation.participatecount + " into " + reservation.participatecount + "<br>";
    }
    if (reservation.functiondate != oldReservation.functiondate) {
        updates = updates + "Function Date is changed " + oldReservation.functiondate + " into " + reservation.functiondate + "<br>";
    }
    if (reservation.functionstarttime != oldReservation.functionstarttime) {
        updates = updates + "Function Time is changed " + oldReservation.functionstarttime + " into " + reservation.functionstarttime + "<br>";
    }
    if (reservation.menuprice != oldReservation.menuprice) {
        updates = updates + "Menu Price is changed " + oldReservation.menuprice + " into " + reservation.menuprice + "<br>";
    }
    if (reservation.totalmenuprice != oldReservation.totalmenuprice) {
        updates = updates + "Total menu Price is changed " + oldReservation.totalmenuprice + " into " + reservation.totalmenuprice + "<br>";
    }
    if (reservation.serviceprice != oldReservation.serviceprice) {
        updates = updates + "Service Price is changed " + oldReservation.serviceprice + " into " + reservation.serviceprice + "<br>";
    }
    if (reservation.additionalsubmenuprice != oldReservation.additionalsubmenuprice) {
        updates = updates + "Additional Price is changed " + oldReservation.additionalsubmenuprice + " into " + reservation.additionalsubmenuprice + "<br>";
    }
    if (reservation.totalprice != oldReservation.totalprice) {
        updates = updates + "Total Price is changed " + oldReservation.totalprice + " into " + reservation.totalprice + "<br>";
    }
    if (reservation.note != oldReservation.note) {
        updates = updates + "Reservation Note is changed " + oldReservation.note + " into " + reservation.note + "<br>";
    }
    if (reservation.customer_id.id != oldReservation.customer_id.id) {
        updates = updates + "Customer is changed " + oldReservation.customer_id.id + " into " + reservation.customer_id.id + "<br>";
    }
    if (reservation.functiontype_id.name != oldReservation.functiontype_id.name) {
        updates = updates + "Function Type is changed " + oldReservation.functiontype_id.name + " into " + reservation.functiontype_id.name + "<br>";
    }
    if (reservation.functionhall_id.name != oldReservation.functionhall_id.name) {
        updates = updates + "Function Hall is changed " + oldReservation.functionhall_id.name + " into " + reservation.functionhall_id.name + "<br>";
    }
    if (reservation.menu_id.name != oldReservation.menu_id.name) {
        updates = updates + "Menu is changed " + oldReservation.menu_id.name + " into " + reservation.menu_id.name + "<br>";
    }
    if (reservation.reservationstatus_id.name != oldReservation.reservationstatus_id.name) {
        updates = updates + "Reservation Status is changed " + oldReservation.reservationstatus_id.name + " into " + reservation.reservationstatus_id.name + "<br>";
    }
    if (reservation.submenus.length != oldReservation.submenus.length) {
        updates = updates + "Submenu Changed";
    }
    return updates;
}

const reservationUpdate = () => {
    //1) check update button 
    console.log("update");
    console.log(reservation);
    console.log(oldReservation);

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
                    let putServiceResponse = ajaxHTTPRequest("/reservation", "PUT", reservation)
                    //6) check put service response
                    if (putServiceResponse == "OK") {
                        Swal.fire({
                            icon: 'success',
                            html: 'Update Successfully',
                            showConfirmButton: true,
                        }).then(() => {
                            refershReservationTable();
                            formReservation.reset();
                            refershReservationForm();
                            $('#modalReservationAdd').modal('hide');
                        });
                    } else {
                        Swal.fire({
                            icon: 'error',
                            html: 'Failed to Update Reservation Details',
                            text: putServiceResponse,
                            showConfirmButton: true,
                        });
                    }
                }
            });
        }
    } else {
        Swal.fire({
            icon: 'error',
            html: 'Form has some errors... please check the form again..<br>',
            text: errors,
            showConfirmButton: true,
        });
    }
}

const deleteReservation = (ob) => {
    //1) check delete button 
    console.log("delete");
    //2) get user confirmation
    // Get user confirmation using SweetAlert2
    Swal.fire({
        title: 'Confirm Delete Details',
        html: 'Are you sure to DELETE following Reservation Details..? <br>'
            + '<br> Reservation Code : ' + ob.reservationcode
            + '<br> Customer Name : ' + ob.customer_id.name
            + '<br> Function Date : ' + ob.functiondate,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            // call delete service
            let deleteserverResponce = ajaxHTTPRequest("/reservation", "DELETE", ob);
            // check delete service responce
            if (deleteserverResponce == "OK") {
                refershReservationTable();

                Swal.fire({
                    title: 'Success',
                    text: 'Reservation Delete Successfully!',
                    icon: 'success'
                });
            } else {
                Swal.fire({
                    title: 'Form Error',
                    text: 'Failed to delete reservation \n' + deleteserverResponce,
                    icon: 'error'
                });
            }
        }
    });
}
const printReservation = (rowOb, rowIndex) => {


    //open view details
    $('#reservationViewModal').modal('show');

    viewResCode.innerHTML = rowOb.reservationcode;
    viewCustomer.innerHTML = rowOb.customer_id.name;
    viewFunctionType.innerHTML = rowOb.functiontype_id.name;
    viewFunctionDate.innerHTML = rowOb.functiondate;
    viewStartTime.innerHTML = rowOb.functionstarttime;
    viewEndTime.innerHTML = rowOb.functionendtime;
    viewCount.innerHTML = rowOb.participatecount;
    viewHall.innerHTML = rowOb.functionhall_id.name;
    viewMenu.innerHTML = rowOb.menu_id.name;
    viewTotMenu.innerHTML = rowOb.totalmenuprice;
    viewSubmenuPrice.innerHTML = rowOb.additionalsubmenuprice;
    viewServicePrice.innerHTML = rowOb.serviceprice;
    viewTotal.innerHTML = rowOb.totalprice;
    //viewAdvanceAmount.innerHTML = rowOb.advanceamount;
    viewAddDateTime.innerHTML = rowOb.addeddatetime.split("T")[0] + " " + rowOb.addeddatetime.split("T")[1];
    viewStatus.innerHTML = rowOb.reservationstatus_id.name;
    viewNote.innerHTML = rowOb.note;

    //refresh table area
    let displayPropertyList = [
        { dataType: "function", propertyName: getSubMenuName },
        { dataType: "function", propertyName: getSubmenuPriceEach }
    ];
    fillDataIntoInnerTable(tableSubmenuInner, rowOb.reservationhasadditionalsubmenulist, displayPropertyList, deleteSubmenuInnerForm, false);

    //refresh table area
    let displayPropertyListTwo = [
        { dataType: "function", propertyName: getServiceName },
        { dataType: "function", propertyName: getServicePriceEach }
    ];
    fillDataIntoInnerTable(tableServiceInner, rowOb.reservationhasservicelist, displayPropertyListTwo, deleteServiceInnerForm, false);
}

const btnPrintRow = () => {
    console.log("print");
    console.log(reservation);

    let newWindow = window.open();
    newWindow.document.write("<html><head>" +
        "<link rel='stylesheet' href='resources/bootstrap-5.3.1-dist/bootstrap-5.3.1-dist/css/bootstrap.min.css'></link>" +
        "<title>" + "Reservation Details" + "</title>"
        + "</head><body>" +
        "<h2>" + "Reservation Details" + "</h2>" +
        printReservationTable.outerHTML + "<script>printReservationTable.classList.remove('d-none');</script></body></html>"
    );

    setTimeout(() => {
        newWindow.stop();//table ek load wena ek nawathinw
        newWindow.print();//table ek print weno
        newWindow.close();//aluthin open una window tab ek close weno
        //ar data load wenn nm  time out ekk oni weno aduma 500k wth
    }, 500)
}

const getSubmenuPriceEach = (innerOb) => {
    return parseFloat(innerOb.submenu_charge).toFixed(2);
}

const getAvailbleHall = () => {
    let currentDate = dateTxt.value;
    let currentStartDate = startTimeTxt.value;
    let currentEndDate = endTimeTxt.value;
    let currentCount = countTxt.value;
    availableHall = ajaxGetRequest("/hall/getavailablehall/" + currentDate + "/" + currentStartDate + "/" + currentEndDate + "/" + currentCount);
    fillDataIntoSelect(slctHallName, "Select Function Hall", availableHall, "name");
}

const refershReservationForm = () => {

    reservation = {};
    oldReservation = null;

    reservation.submenus = [];

    //min date ek gann widiha
    var dt = new Date(); //ada dine gannwa 
    dt.setDate(dt.getDate() + 10);// ada dwsta argen ekt dwss 10k ekathu krl, set krgnnw --> ek ethkot enn me format ekt (Sep 05 2024)

    dateTxt.min = dt.toISOString().split('T')[0];// ek me format(2024-09-05) ekt gannd tmi toISOString krnn

    reservation.reservationhasservicelist = new Array();
    reservation.reservationhasadditionalsubmenulist = new Array();
    reservation.reservationhasingredientslist = new Array();

    customers = ajaxGetRequest("/customer/getactivecustomer");
    customers.sort((a, b) => b.id - a.id);
    fillDataIntoSelect2(slctCustomerName, "Select Customer", customers, "mobile", "name");

    functionTypes = ajaxGetRequest("/functiontype/list");
    fillDataIntoSelect(slctFunctionType, "Select Function Type", functionTypes, "name");

    reservationStatus = ajaxGetRequest("/reservationstatus/list");
    fillDataIntoSelect(slctReservationStatus, "Select Status", reservationStatus, "name", "Pending");

    slctCustomerName.style.border = "1px solid #ced4da";
    slctFunctionType.style.border = "1px solid #ced4da";
    countTxt.style.border = "1px solid #ced4da";
    dateTxt.style.border = "1px solid #ced4da";
    startTimeTxt.style.border = "1px solid #ced4da";
    endTimeTxt.style.border = "1px solid #ced4da";
    //advanceAmountTxt.style.border = "1px solid #ced4da";
    slctHallName.style.border = "1px solid #ced4da";
    slctMenuType.style.border = "1px solid #ced4da";
    MenuPriceTxt.style.border = "1px solid #ced4da";
    MenuPriceTotalTxt.style.border = "1px solid #ced4da";
    additionalPriceTxt.style.border = "1px solid #ced4da";
    totalPriceTxt.style.border = "1px solid #ced4da";
    slctReservationStatus.style.border = "1px solid #ced4da";
    textNote.style.border = "1px solid #ced4da";

    reservation.reservationstatus_id = JSON.parse(slctReservationStatus.value);
    slctReservationStatus.style.border = "1px solid green";

    if (userPrivilege.priviinsert) {
        btnReservationSubmit.disabled = "";
    } else {
        btnReservationSubmit.disabled = "disabled"
    }

    /*   getMenuNameByFuctionType();
      getSubmenubyMenu();
      getAvailbleHall(); */

    refreshServiceInnerFormAndTable();
    refreshSubmenuInnerFormAndTable();

}

const getMenuNameByFuctionType = () => {
    //json parse krnn select ekk value withrai
    const currentFunctionTypeId = JSON.parse(slctFunctionType.value).id;
    slctFunctionType.style.border = "2px solid green";
    menuFilter = ajaxGetRequest("/menu/getmenunamebyfunctiontype" + currentFunctionTypeId);
    fillDataIntoSelect(slctMenuType, "Select Menu", menuFilter, "name");
}

// service inner start

const refreshServiceInnerFormAndTable = () => {

    reservationhasservice = {};

    services = ajaxGetRequest("/servicecategory/list");
    fillDataIntoSelect(slctService, "Select Service Category", services, "name");

    //refresh table area
    let displayPropertyList = [
        { dataType: "function", propertyName: getServiceName },
        { dataType: "function", propertyName: getServicePriceEach }
    ];
    fillDataIntoInnerTable(tableInnerService, reservation.reservationhasservicelist, displayPropertyList, deleteServiceInnerForm);

    let serviceAmount = 0.00;
    let additionalServiceAmount = 0;
    for (const resser of reservation.reservationhasservicelist) {
        serviceAmount = parseFloat(serviceAmount) + parseFloat(resser.servicecharge)
        additionalServiceAmount = additionalServiceAmount + parseFloat(serviceAmount)
    }
    //toFixed krpu gmnm mek string ekk bawata convert wenwa, mek aaye calculation wlt gnnw nm ek oni wididhta hadagnnd
    if (countTxt.value != "") {
        servicePrice.value = parseFloat(serviceAmount).toFixed(2);
        servicePrice.style.border = "1px solid #ced4da";
        servicePrice.disabled = "disabled";
        reservation.serviceprice = servicePrice.value;
    } else {
        /* Swal.fire({
            title: "Select Function Hall!",
            text: "First You Select Function Hall to Select Services",
            icon: "info"
          }); */
        servicePrice.value = "0.00";
    }

    ServicePriceTxt.value = "";

    slctService.style.border = "1px solid #ced4da";
    ServicePriceTxt.style.border = "1px solid #ced4da";
    slctNameService.style.border = "1px solid #ced4da";
}

const getServiceName = (innerOb) => {
    return innerOb.service_id.name
}

const getServicePriceEach = (innerOb) => {
    return parseFloat(innerOb.servicecharge).toFixed(2);
}

const deleteServiceInnerForm = (innerOb) => {
    Swal.fire({
        title: 'Confirm Delete Details',
        html: 'Are You sure to remove service..? <br>'
            + '<br> Service Name : ' + innerOb.service_id.name,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            let extIndex = reservation.reservationhasservicelist.map(resser => resser.service_id.id).indexOf(innerOb.service_id.id);
            if (extIndex != -1) {
                reservation.reservationhasservicelist.splice(extIndex, 1);
                refreshServiceInnerFormAndTable();

                Swal.fire({
                    title: 'Success',
                    text: 'Sub Menu Removed Successfully...!',
                    icon: 'success'
                });

                //MULIN APE DANATA THIYANA TOTAL MENU PRICE GAMU
                let currentMenuPrice = parseFloat(document.getElementById("MenuPriceTotalTxt").value);
                console.log('currentMenuPrice', currentMenuPrice);

                //& Additional Sub Menu Price EKE DAN VALUE EKA
                let currentSubMenuPriceSum = parseFloat(document.getElementById("additionalPriceTxt").value);
                console.log('currentSubMenuPriceSum', currentSubMenuPriceSum);

                // KELINMA TOTAL EKA GANNE NATHUWA...UDA DEKA EKATHU KARALA TOTAL EKA GAMU
                let currentTotalPrice = currentMenuPrice + currentSubMenuPriceSum;
                console.log('currentTotalPrice', currentTotalPrice);

                //EKATA EKATHU KARAMU ALUTHIN AWA ADDITIONAL SERVICE PRICE SUM EKA
                let additionalServicePriceSum = parseFloat(document.getElementById("servicePrice").value);
                console.log('additionalServicePriceSum', additionalServicePriceSum);

                let newTotal = currentTotalPrice + additionalServicePriceSum;

                //EKA ADAALA FIELD EKE PENWAMU
                document.getElementById("totalPriceTxt").value = newTotal.toFixed(2);

                //BIND 
                reservation.totalprice = totalPriceTxt.value;
            }
        }
    });
}

const getNameByCategory = () => {
    const currentServiceCategoryId = JSON.parse(slctService.value).id;
    slctService.style.border = "2px solid green";
    servicenameFilter = ajaxGetRequest("/service/getservicenamebycategory" + currentServiceCategoryId);
    fillDataIntoSelect(slctNameService, "Select Service Holder Name", servicenameFilter, "name");
}

const generateServicePrice = () => {

    let selectService = JSON.parse(slctNameService.value);
    ServicePriceTxt.value = parseFloat(selectService.servicecharge).toFixed(2);
    slctNameService.style.border = "2px solid green";
    ServicePriceTxt.style.border = "2px solid green";
    ServicePriceTxt.disabled = "disabled";
    ServicePriceTxt.disabled = "";
    reservationhasservice.servicecharge = ServicePriceTxt.value;

}

const checkServiceInnerFormError = () => {
    let errors = "";

    if (reservationhasservice.service_id.id == null) {
        errors = errors + "Please select Service <br>";
    }
    return errors;
}

const serviceInnerSubmit = () => {
    let selectService = JSON.parse(slctService.value);
    let extSer = false;

    for (const resser of reservation.reservationhasservicelist) {
        if (selectService.id == resser.service_id.id) {
            extSer = true;
            break;
        }
    }
    if (extSer) {
        Swal.fire({
            title: "Selected Service Already Ext",
            html: "(select another service)",
            icon: "warning"
        });
        reservationhasservice = {};
        slctNameService.value = ""
        ServicePriceTxt.value = ""
        slctService.style.border = "1px solid #ced4da";
        slctNameService.style.border = "1px solid #ced4da";
        ServicePriceTxt.style.border = "1px solid #ced4da";

    } else {
        let errors = checkServiceInnerFormError();
        if (errors == "") {
            swal.fire({
                title: 'Confirm Addition',
                html: 'Are you Sure to Submit selected Service? <br>'
                    + '<br> Service :' + reservationhasservice.service_id.name,
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Yes, add it!',
                cancelButtonText: 'No, cancel',
                reverseButtons: true
            }).then((result) => {
                if (result.isConfirmed) {
                    reservation.reservationhasservicelist.push(reservationhasservice);
                    refreshServiceInnerFormAndTable();

                    //MULIN APE DANATA THIYANA TOTAL MENU PRICE GAMU
                    let currentMenuPrice = parseFloat(document.getElementById("MenuPriceTotalTxt").value);
                    console.log('currentMenuPrice', currentMenuPrice);

                    //& Additional Sub Menu Price EKE DAN VALUE EKA
                    let currentSubMenuPriceSum = parseFloat(document.getElementById("additionalPriceTxt").value);
                    console.log('currentSubMenuPriceSum', currentSubMenuPriceSum);

                    //, KELINMA TOTAL EKA GANNE NATHUWA...UDA DEKA EKATHU KARALA TOTAL EKA GAMU
                    let currentTotalPrice = currentMenuPrice + currentSubMenuPriceSum;
                    console.log('currentTotalPrice', currentTotalPrice);

                    //EKATA EKATHU KARAMU ALUTHIN AWA ADDITIONAL SERVICE PRICE SUM EKA
                    let additionalServicePriceSum = parseFloat(document.getElementById("servicePrice").value);
                    console.log('additionalServicePriceSum', additionalServicePriceSum);

                    let newTotal = additionalServicePriceSum + currentTotalPrice;

                    //EKA ADAALA FIELD EKE PENWAMU
                    document.getElementById("totalPriceTxt").value = newTotal.toFixed(2);

                    //BIND 
                    reservation.totalprice = totalPriceTxt.value;

                    //generateAdvance();
                }
                Swal.fire({
                    title: 'Success',
                    html: 'Service added successfully!',
                    icon: 'success'
                });
            });
        } else {
            Swal.fire({
                title: 'Form Error',
                html: 'Inner Form Has Following errors <br>' + errors,
                icon: 'error'
            });
        }
    }
}

// service inner end

const getPriceeMenu = () => {
    let selectedMenu = MenuPriceTxt.value;
    let selectedHall = JSON.parse(slctHallName.value);
    if (selectedMenu !== 'Select Menu') {

    } else {
        MenuPriceTxt.value = (parseFloat(selectedHall.pricewithouthall)).toFixed(2);
    }
    reservation.menuprice = MenuPriceTxt.value;
    MenuPriceTxt.disabled = "disabled";
    //MenuPriceTxt.style.border = "1px solid green";
}

const getMenuPrice = () => {
    let selectedHall = slctHallName.value
    let selectedMenu = JSON.parse(slctMenuType.value);
    if (selectedHall !== 'Select Function Hall') {
        MenuPriceTxt.value = (parseFloat(selectedMenu.pricewithhall)).toFixed(2);
    }
    else {
        MenuPriceTxt.value = (parseFloat(selectedMenu.pricewithouthall)).toFixed(2);
    }
    reservation.menuprice = MenuPriceTxt.value;
    MenuPriceTxt.disabled = "disabled";
    MenuPriceTxt.style.border = "1px solid green";

}

const getSubmenubyMenu = () => {
    const currentSubmenuCategoryId = JSON.parse(slctMenuType.value).id;
    slctMenuType.style.border = "2px solid green";
    selectedSubmenusFilter = ajaxGetRequest("/submenu/getsubmenubymenu" + currentSubmenuCategoryId);
    fillDataIntoSelect(selectSubMenu, "", selectedSubmenusFilter, "name");

    selectedSubmenusFilter.forEach(element => {
        reservation.submenus.push(element);
    });

}

//function for add selected item (>)
const btnRemoveSubMenu = () => {
    let selectedSubmenuForRemove = JSON.parse(selectSubMenu.value);

    console.log(selectedSubmenuForRemove);
    //reservation.submenus.pop(selectedSubmenuForRemove);

    //temp code

    let extIndex = reservation.submenus.map(submenu => submenu.name).indexOf(selectedSubmenuForRemove.name);
    if (extIndex != -1) {
        reservation.submenus.splice(extIndex, 1)
        removedList.push(selectedSubmenuForRemove);
    }

    fillDataIntoSelect(removeSubmenu, "", removedList, "name");

    fillDataIntoSelect(selectSubMenu, "", reservation.submenus, "name");

}

const btnAddAgain = () => {
    //all tiyen ek isslla variable ekkt daagannwa(select krgnnw eken 1k)
    let submenuForAddAgain = JSON.parse(removeSubmenu.value);

    //all list eken e selected list ekt giyapu ek ainn krgnnwa
    let extIndex = removedList.map(submenu => submenu.name).indexOf(submenuForAddAgain.name);
    if (extIndex != -1) {
        removedList.splice(extIndex, 1);
    }

    //eken select krl ewa btn ek click krama ek selected list ekt dagann oni
    reservation.submenus.push(submenuForAddAgain);
    fillDataIntoSelect(selectSubMenu, "", reservation.submenus, "name");
    //remove ewa ainn krl all list refresh krnw
    fillDataIntoSelect(removeSubmenu, "", removedList, "name");

}

//submenu inner start

const refreshSubmenuInnerFormAndTable = () => {

    reservationhasadditionalsubmenu = {};

    submenuCategory = ajaxGetRequest("/submenucategory/list");
    fillDataIntoSelect(slctSubMenuCategory, "Select Sub Menu Category", submenuCategory, "name");

    //refresh table area
    let displayPropertyList = [
        { dataType: "function", propertyName: getSubMenuName },
        { dataType: "function", propertyName: getSubmenuPrice }
    ];
    fillDataIntoInnerTable(tableInnerSubmenu, reservation.reservationhasadditionalsubmenulist, displayPropertyList, deleteSubmenuInnerForm);

    let additionalAmount = 0.00;
    let additionalPriceamount = 0;
    for (const ressub of reservation.reservationhasadditionalsubmenulist) {
        additionalAmount = parseFloat(additionalAmount) + parseFloat(ressub.submenu_charge)
        additionalPriceamount = additionalPriceamount + parseFloat(additionalAmount)

    }
    console.log(additionalAmount);

    //toFixed krpu gmnm mek string ekk bawata convert wenwa, mek aaye calculation wlt gnnw nm ek oni wididhta hadagnnd
    if (countTxt.value != "") {
        additionalPriceTxt.value = (parseFloat(countTxt.value) * parseFloat(additionalAmount)).toFixed(2);
        additionalPriceTxt.style.border = "1px solid #ced4da";
        additionalPriceTxt.disabled = "disabled";
        reservation.additionalsubmenuprice = additionalPriceTxt.value;
    } else {
        additionalPriceTxt.value = "0.00";
    }

    SubmenuPriceTxt.value = "";

    slctSubMenuCategory.style.border = "1px solid #ced4da";
    slctSubmenuName.style.border = "1px solid #ced4da";
    SubmenuPriceTxt.style.border = "1px solid #ced4da";
}

const getSubMenuName = (innerOb) => {
    return innerOb.submenu_id.name
}
const getSubmenuPrice = (innerOb) => {
    return (parseFloat(countTxt.value) * parseFloat(innerOb.submenu_charge)).toFixed(2);
}

const deleteSubmenuInnerForm = (innerOb) => {
    Swal.fire({
        title: 'Confirm Delete Details',
        html: 'Are You sure to remove submenu..? <br>'
            + '<br> Submenu Name : ' + innerOb.submenu_id.name,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            let extIndex = reservation.reservationhasadditionalsubmenulist.map(ressub => ressub.submenu_id.id).indexOf(innerOb.submenu_id.id);
            if (extIndex != -1) {
                reservation.reservationhasadditionalsubmenulist.splice(extIndex, 1);
                refreshSubmenuInnerFormAndTable();

                //METHANADI API GENNAGANNAWA DANATA Total Menu Price EKE THIYANA VALUE EKA 
                let currentMenuPrice = parseFloat(document.getElementById("MenuPriceTotalTxt").value);
                console.log('currentMenuPrice', currentMenuPrice);

                //& Additional Sub Menu Price EKE DAN VALUE EKA
                let currentSubMenuPriceSum = parseFloat(document.getElementById("additionalPriceTxt").value);
                console.log('currentSubMenuPriceSum', currentSubMenuPriceSum);

                //E DEKA EKATHU KARAMU
                let totalPrice = currentMenuPrice + currentSubMenuPriceSum;
                console.log('totalPrice', totalPrice);

                //EKA ADAALA FIELD EKE PENWAMU
                document.getElementById("totalPriceTxt").value = totalPrice.toFixed(2);

                //BIND
                reservation.totalprice = totalPriceTxt.value;

                //generateAdvance();

                Swal.fire({
                    title: 'Success',
                    text: 'Sub Menu Removed Successfully...!',
                    icon: 'success'
                });
            }
        }
    });
}

const getSubMenuByCategory = () => {
    const currentSubMenuCategoryId = JSON.parse(slctSubMenuCategory.value).id;
    slctSubMenuCategory.style.border = "2px solid green";
    submenusfilter = ajaxGetRequest("/submenu/getsubmenubycategory" + currentSubMenuCategoryId);
    fillDataIntoSelect(slctSubmenuName, "Select Sub Menu", submenusfilter, "name")

}

const generateSubmenuPrice = () => {
    let selectSubmenu = JSON.parse(slctSubmenuName.value);
    SubmenuPriceTxt.value = parseFloat(selectSubmenu.priceforoneportion).toFixed(2);
    slctSubmenuName.style.border = "2px solid green";
    SubmenuPriceTxt.style.border = "2px solid green";
    SubmenuPriceTxt.disabled = "disabled";
    reservationhasadditionalsubmenu.submenu_charge = SubmenuPriceTxt.value;
}

const checkSubmenuInnerFormError = () => {
    let errors = "";

    if (reservationhasadditionalsubmenu.submenu_id.id == null) {
        errors = errors + "Please select Submenu \n";
    }
    return errors;
}

const submenuInnerAdd = () => {
    let selectSubMenu = JSON.parse(slctSubmenuName.value);
    let extSub = false;

    for (const ressub of reservation.reservationhasadditionalsubmenulist) {
        if (selectSubMenu.id == ressub.submenu_id.id) {
            extSub = true;
            break;
        }
    }
    if (extSub) {
        Swal.fire({
            title: "Selected Sub Menu Already Ext",
            html: "(select another submenu)",
            icon: "warning"
        });
        reservationhasadditionalsubmenu = {};
        slctSubmenuName.value = ""
        SubmenuPriceTxt.value = ""
        slctSubMenuCategory.style.border = "1px solid #ced4da";
        slctSubmenuName.style.border = "1px solid #ced4da";
        SubmenuPriceTxt.style.border = "1px solid #ced4da";

    } else {
        let errors = checkSubmenuInnerFormError();
        if (errors == "") {
            swal.fire({
                title: 'Confirm Addition',
                html: 'Are you Sure to Submit selected Submenu? <br>'
                    + '<br> Sub Menu :' + reservationhasadditionalsubmenu.submenu_id.name,
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Yes, add it!',
                cancelButtonText: 'No, cancel',
                reverseButtons: true
            }).then((result) => {
                if (result.isConfirmed) {
                    reservation.reservationhasadditionalsubmenulist.push(reservationhasadditionalsubmenu);
                    refreshSubmenuInnerFormAndTable();

                    //METHANADI API GENNAGANNAWA DANATA Total Menu Price EKE THIYANA VALUE EKA 
                    let currentMenuPrice = parseFloat(document.getElementById("MenuPriceTotalTxt").value);
                    console.log('currentMenuPrice', currentMenuPrice);

                    //& Additional Sub Menu Price EKE DAN VALUE EKA
                    let currentSubMenuPriceSum = parseFloat(document.getElementById("additionalPriceTxt").value);
                    console.log('currentSubMenuPriceSum', currentSubMenuPriceSum);

                    //E DEKA EKATHU KARAMU
                    let totalPrice = currentMenuPrice + currentSubMenuPriceSum;
                    console.log('totalPrice', totalPrice);

                    //EKA ADAALA FIELD EKE PENWAMU
                    document.getElementById("totalPriceTxt").value = totalPrice.toFixed(2);

                    //BIND
                    reservation.totalprice = totalPriceTxt.value;

                    //generateAdvance();
                }
                Swal.fire({
                    title: 'Success',
                    html: 'Sub Menu added successfully!',
                    icon: 'success'
                });
            });
        } else {
            Swal.fire({
                title: 'Form Error',
                html: 'Inner Form Has Following errors <br>' + errors,
                icon: 'error'
            });
        }
    }
}

//submenu inner end

//modification

const getPopUpMessage = () => {
    if (countTxt.value >= 100 ) {
        discountPrice.disabled = false;
        Swal.fire({
            title: "Discount",
            html: "You Can Added Discount!",
            icon: "success"
        });
    }
}

const generateTotalByDiscount = () => {
    afterMenuPriceTotalTxt.value = (parseFloat(MenuPriceTotalTxt.value) - parseFloat(discountPrice.value)).toFixed(2);
    totalPriceTxt.value = afterMenuPriceTotalTxt.value;
    reservation.afterdiscountmenutotal = afterMenuPriceTotalTxt.value;
    reservation.totalprice = totalPriceTxt.value;
}