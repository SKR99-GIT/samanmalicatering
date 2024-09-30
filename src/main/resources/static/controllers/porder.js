window.addEventListener('load', () => {
    //mek methanin load krnn form eke withrak nwi table eketh button tiyenonh privilege balal enable/disable wennd oni
    userPrivilege = ajaxGetRequest("/privilage/bymodule/PORDER");
    refreshPorderTable();
    refreshPorderForm();
});

const refreshPorderTable = () => {
    //pass the data in db to the table
    porders = ajaxGetRequest("/porder/printall");

    //text --> string, number, date
    //function --> object,array, boolean --> craete function 
    //column count == object count
    //piliwelata dann
    const displayProperty = [
        { dataType: 'function', propertyName: getSupplier },
        { dataType: 'text', propertyName: 'pordercode' },
        { dataType: 'text', propertyName: 'requireddate' },
        { dataType: 'function', propertyName: getTotalPrice },
        { dataType: 'function', propertyName: getPorderStatus }
    ];

    //call fillDataIntoTable function (tableId,dataList,displayPropertyArrayName,editFunctionName, deleteFuctionName,PrintFuctionName)
    fillDataIntoTable(tablePorder, porders, displayProperty, refillPorder, deletePorder, PrintPorder, true, userPrivilege);

    //me ara delete krl tiyen ekk aaye delete krnnd bari wennd hadala tiyenn
    porders.forEach((element, index) => {
        if (userPrivilege.prividelete && element.porderstatus_id.name !== "Pending Approval") {
            //table eke body ek allgen, eken table column ek allgen, eketh delete button ek allgnnd oni
            tablePorder.children[1].children[index].children[6].children[1].disabled = "disabled";
            tablePorder.children[1].children[index].children[6].children[1].style.cursor = "not-allowed";
        }
    });

    //basicma jquery datatable active krgnn widiha
    $('#tablePorder').dataTable();
}

const getSupplier = (ob) => {
    return ob.supplier_id.name;
}

const getPorderStatus = (ob) => {
    if (ob.porderstatus_id.name == 'Delivered') {
        return '<span class="text-success fw-bold">Delivered</span>'
    } else if (ob.porderstatus_id.name == 'Cancelled') {
        return '<span class="text-danger fw-bold">Cancelled</span>';
    } else if (ob.porderstatus_id.name == 'Approved') {
        return '<span class="text-primary fw-bold">Approved</span>';
    } else {
        return '<span class="text-info fw-bold">Pending Approval</span>';
    }
}

const getTotalPrice = (ob) => {
    if (ob.totalamount) {
        return parseFloat(ob.totalamount).toFixed(2);
    }
}

const checkFormError = () => {
    let errors = "";

    if (porder.requireddate == null) {
        errors = errors + "Please Enter Required Date <br>";
        requiredDate.style.background = 'rgba(255,0,0,0.1)';
    }
    if (porder.totalamount == null) {
        errors = errors + "Please Enter Total Amount <br>";
        textTotalAmount.style.background = 'rgba(255,0,0,0.1)';
    }
    if (porder.supplier_id == null) {
        errors = errors + "Please Select Supplier <br>";
        nameSupplier.style.background = 'rgba(255,0,0,0.1)';
    }
    if (porder.porderstatus_id == null) {
        errors = errors + "Please Select Porder Status <br>";
        slctPorderStatus.style.background = 'rgba(255,0,0,0.1)';
    }
    return errors;
}

const porderSubmit = () => {
    // check submit button
    console.log("submit");
    console.log(porder);

    // Check form error
    const errors = checkFormError();
    // If no errors
    if (errors == '') {
        // Get user confirmation using SweetAlert2
        Swal.fire({
            title: 'Confirm Addition',
            html: 'Are you sure to Save following IRN Details..? <br>'
                + '<br> Supplier Name: ' + porder.supplier_id.name
                + '<br> Required Date: ' + porder.requireddate,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, add it!',
            cancelButtonText: 'No, cancel',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                // Call POST service
                let postServerResponce = ajaxHTTPRequest("/porder", "POST", porder);
                // Check post service response
                if (postServerResponce == "OK") {
                    refreshPorderTable();
                    formPorder.reset();
                    refreshPorderForm();
                    $('#offcanvasPorderAdd').offcanvas('hide');

                    Swal.fire({
                        title: 'Success',
                        html: 'Porder added successfully!',
                        icon: 'success'
                    });
                } else {
                    Swal.fire({
                        title: 'Form Error',
                        html: 'Failed to submit Porder. <br>' + postServerResponce,
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

const refillPorder = (ob) => {
    //1) check refill button
    console.log("refill");

    //disabled krl tibba update button ek enable krno
    btnPorderUpdate.disabled = false;

    //define menu n oldmenu objects
    //JSON. parse() : This method takes a JSON string and then transforms it into a JavaScript object.
    //assign table row object into hall object
    //object ek  string wlt covert kre hall ek update krddi oldHall ekath update nowi tiyennd oni nisa
    porder = JSON.parse(JSON.stringify(ob));
    oldporder = JSON.parse(JSON.stringify(ob));

    //open irn from
    $('#offcanvasPorderAdd').offcanvas('show');

    //set value into ui element
    //elementId.value = object.property
    requiredDate.value = porder.requireddate;
    textTotalAmount.value = porder.totalamount;
    textNote.value = porder.note;

    suppliers = ajaxGetRequest("/supplier/printall");
    fillDataIntoSelect(nameSupplier, "Select Supplier", suppliers, "name", ob.supplier_id.name);

    pordedrStatus = ajaxGetRequest("/porderstatus/list");
    fillDataIntoSelect(slctPorderStatus, "Select Status", pordedrStatus, "name", ob.porderstatus_id.name);

    btnPorderSubmit.disabled = "disabled";

    if (userPrivilege.priviupdate) {
        btnPorderUpdate.disabled = "";
    } else {
        btnPorderUpdate.disabled = "disabled"
    }

    if (JSON.parse(slctPorderStatus.value).name !== "Pending Approval") {
        btnPorderUpdate.disabled = true;
    }

    refreshInnerFormAndTable();
}

const checkFormUpdate = () => {
    let updates = "";

    if (porder.requireddate != oldporder.requireddate) {
        updates = updates + "POrder Required Date is " + oldporder.requireddate + " into " + porder.requireddate + "<br>";
    }
    if (porder.totalamount != oldporder.totalamount) {
        updates = updates + "POrder Total Amount is " + oldporder.totalamount + " into " + porder.totalamount + "<br>";
    }
    if (porder.note != oldporder.note) {
        updates = updates + "POrder Note is " + oldporder.note + " into " + porder.note + "<br>";
    }
    if (porder.supplier_id.name != oldporder.supplier_id.name) {
        updates = updates + "Supplier is changed " + oldporder.supplier_id.name + " into " + porder.supplier_id.name + "<br>";
    }
    if (porder.porderstatus_id.name != oldporder.porderstatus_id.name) {
        updates = updates + "POrder Status is changed " + oldporder.porderstatus_id.name + " into " + porder.porderstatus_id.name + "<br>";
    }
    return updates;
}

const porderUpdate = () => {
    //1) check update button
    console.log("update");
    console.log(porder);
    console.log(oldporder);

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
                    let putServiceResponse = ajaxHTTPRequest("/porder", "PUT", porder)
                    //6) check put service response
                    if (putServiceResponse == "OK") {
                        Swal.fire({
                            icon: 'success',
                            html: 'Update Successfully',
                            showConfirmButton: true,
                        }).then(() => {
                            refreshPorderTable();
                            formPorder.reset();
                            refreshPorderForm();
                            $('#offcanvasPorderAdd').offcanvas('hide');
                        });
                    } else {
                        Swal.fire({
                            icon: 'error',
                            html: 'Failed to Update Porder Details',
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

const deletePorder = (ob) => {

    //1) check delete button 
    console.log("delete");
    //2) get user confirmation
    // Get user confirmation using SweetAlert2
    Swal.fire({
        title: 'Confirm Delete Details',
        html: 'Are you sure to DELETE following POrder Details..? <br>'
            + '<br> Supplier Name : ' + ob.supplier_id.name
            + '<br> Porder Code : ' + ob.pordercode
            + '<br> Reserve Date : ' + ob.requireddate,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            // call delete service
            let deleteserverResponce = ajaxHTTPRequest("/porder", "DELETE", ob);
            // check delete service responce
            if (deleteserverResponce == "OK") {
                refreshPorderTable();

                Swal.fire({
                    title: 'Success',
                    text: 'Porder Delete Successfully!',
                    icon: 'success'
                });
            } else {
                Swal.fire({
                    title: 'Form Error',
                    text: 'Failed to delete Porder \n' + deleteserverResponce,
                    icon: 'error'
                });
            }
        }
    });
}

const PrintPorder = (rowOb, rowIndex) => {
    //open view details
    $('#porderViewModal').modal('show');

    viewPorderCode.innerHTML = rowOb.pordercode;
    viewSupplier.innerHTML = rowOb.supplier_id.name;
    viewTotal.innerHTML = rowOb.totalamount;
    viewReqDate.innerHTML = rowOb.requireddate;
    viewAddDateTime.innerHTML = rowOb.addeddatetime.split("T")[0] + " " + rowOb.addeddatetime.split("T")[1];
    viewStatus.innerHTML = rowOb.porderstatus_id.name;
    viewNote.innerHTML = rowOb.note;

    //refresh table area
    let displayPropertyList = [
        { dataType: "function", propertyName: getIngredientName },
        { dataType: "function", propertyName: getUnitprice },
        { dataType: "function", propertyName: getQty },
        { dataType: "function", propertyName: getLineprice },
    ];
    fillDataIntoInnerTable(tableIngInner, rowOb.purchaseorderhasingredientslist, displayPropertyList, deleteInnerForm, false);
}

const btnPrintRow = () => {
    console.log("print");
    console.log(porder);

    let newWindow = window.open();
    newWindow.document.write("<html><head>" +
        "<link rel='stylesheet' href='resources/bootstrap-5.3.1-dist/bootstrap-5.3.1-dist/css/bootstrap.min.css'></link>" +
        "<title>" + "Purchace Order Details" + "</title>"
        + "</head><body>" +
        "<h2>" + "Purchace Order Details" + "</h2>" +
        printPorderTable.outerHTML + "<script>printPorderTable.classList.remove('d-none');</script></body></html>"
    );

    setTimeout(() => {
        newWindow.stop();//table ek load wena ek nawathinw
        newWindow.print();//table ek print weno
        newWindow.close();//aluthin open una window tab ek close weno
        //ar data load wenn nm  time out ekk oni weno aduma 500k wth
    }, 500)
}

const refreshPorderForm = () => {
    porder = {};
    oldporder = null;

    porder.purchaseorderhasingredientslist = new Array();

    suppliers = ajaxGetRequest("/supplier/getactivesupplier");
    fillDataIntoSelect(nameSupplier, "Select Supplier", suppliers, "name");

    pordedrStatus = ajaxGetRequest("/porderstatus/list");
    fillDataIntoSelect(slctPorderStatus, "Select Status", pordedrStatus, "name", "Pending Approval");

    porder.porderstatus_id = JSON.parse(slctPorderStatus.value);
    slctPorderStatus.style.border = "1px solid green";

    nameSupplier.style.boder = "1px solid #ced4da";
    requiredDate.style.boder = "1px solid #ced4da";
    textTotalAmount.style.boder = "1px solid #ced4da";
    slctPorderStatus.style.boder = "1px solid #ced4da";
    textNote.style.boder = "1px solid #ced4da";

    if (userPrivilege.priviinsert) {
        btnPorderSubmit.disabled = "";
    } else {
        btnPorderSubmit.disabled = "disabled"
    }

    refreshInnerFormAndTable();
}

//inner form area start

const getIngBySupplier = () => {

    /*  const currentSupplierId = JSON.parse(nameSupplier.value).id;
    nameSupplier.style.border = "2px solid green";
    IngFilter = ajaxGetRequest("/ingredients/getbysupplier/" + currentSupplierId);
    fillDataIntoSelect(nameIngrediant, "Select Ingredient", IngFilter, "name");  */

    let selectedSupplierId = JSON.parse(nameSupplier.value).id;
    nameSupplier.style.border = "2px solid green";
    ingFilter = ajaxGetRequest("/ingredients/getbysupplier?id=" + selectedSupplierId);
    fillDataIntoSelect(nameIngrediant, "Select Ingredient", ingFilter, "name");
}

const refreshInnerFormAndTable = () => {

    purchaseorderhasingredients = {};

    /*    ingredients = ajaxGetRequest("/ingredients/printall");
       fillDataIntoSelect(nameIngrediant, "Select Ingredient", ingredients, "name");  */

    //refresh table area
    let displayPropertyList = [
        { dataType: "function", propertyName: getIngredientName },
        { dataType: "function", propertyName: getUnitprice },
        { dataType: "function", propertyName: getQty },
        { dataType: "function", propertyName: getLineprice },
    ];

    fillDataIntoInnerTable(tableInner, porder.purchaseorderhasingredientslist, displayPropertyList, deleteInnerForm);

    let totalAmount = 0.00;
    for (const poing of porder.purchaseorderhasingredientslist) {
        totalAmount = parseFloat(totalAmount) + parseFloat(poing.line_price);
    }
    //toFixed krpu gmnm mek string ekk bawata convert wenwa, mek aaye calculation wlt gnnw nm ek oni wididhta hadagnnd
    textTotalAmount.value = parseFloat(totalAmount).toFixed(2);
    textTotalAmount.style.border = "1px solid #ced4da";
    textTotalAmount.disabled = "disabled";
    porder.totalamount = textTotalAmount.value;

    unitPrice.value = ""
    qtyTxt.value = ""
    linePrice.value = ""

    nameIngrediant.style.border = "1px solid #ced4da";
    unitPrice.style.border = "1px solid #ced4da";
    qtyTxt.style.border = "1px solid #ced4da";
    linePrice.style.border = "1px solid #ced4da";
}

const deleteInnerForm = (innerOb) => {
    Swal.fire({
        title: 'Confirm Delete Details',
        html: 'Are You sure to remove order ingreadient..? <br>'
            + '<br> Ingreadient Name : ' + innerOb.ingredients_id.name,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            let extIndex = porder.purchaseorderhasingredientslist.map(irning => irning.ingredients_id.id).indexOf(innerOb.ingredients_id.id);
            if (extIndex != -1) {
                porder.purchaseorderhasingredientslist.splice(extIndex, 1);
                refreshInnerFormAndTable();

                Swal.fire({
                    title: 'Success',
                    text: 'Ingredient Removed Successfully...!',
                    icon: 'success'
                });
            }
        }
    });
}

const getIngredientName = (innerOb) => {
    return innerOb.ingredients_id.name;
}

const getUnitprice = (innerOb) => {
    return parseFloat(innerOb.unit_price).toFixed(2);//why to fixed --> convert to string
}

const getQty = (innerOb) => {
    return parseFloat(innerOb.quntity).toFixed(3);
}

const getLineprice = (innerOb) => {
    return parseFloat(innerOb.line_price).toFixed(2);
}

const generateUnitPrice = () => {
    let selctctIng = JSON.parse(nameIngrediant.value);
    unitPrice.value = parseFloat(selctctIng.unitprice).toFixed(2);
    unitPrice.style.border = "1px solid green";
    unitPrice.disabled = "disabled";
    purchaseorderhasingredients.unit_price = unitPrice.value;
}

const textQtyValidator = () => {
    if (new RegExp("^([1-9][0-9]{0,3})|([1-9][0-9]{0,3}[.][0-9]{1,3})$").test(qtyTxt.value)) {
        linePrice.value = (parseFloat(qtyTxt.value) * parseFloat(unitPrice.value)).toFixed(2);
        linePrice.style.border = "2px solid green";
        qtyTxt.style.border = "2px solid green";
        linePrice.disabled = "disabled";
        purchaseorderhasingredients.line_price = linePrice.value;
        purchaseorderhasingredients.quntity = qtyTxt.value;
        btnInnerSubmit.disabled = "";
    } else {
        linePrice.value = "";
        linePrice.style.border = "2px solid #ced4da";
        qtyTxt.style.border = "2px solid red";
        linePrice.disabled = "disabled";
        purchaseorderhasingredients.line_price = null;
        purchaseorderhasingredients.quntity = null;
    }
}

const checkInnerFormError = () => {
    let errors = "";

    if (purchaseorderhasingredients.ingredients_id.id == null) {
        errors = errors + "Please select ingredients \n";
    }
    if (purchaseorderhasingredients.quntity == null) {
        errors = errors + "Please enter Quantity \n";
    }
    return errors;
}

//inner form ekt ingredient add weno
const innerSubmit = () => {
    //check duplicate 
    let selctctIngredients = JSON.parse(nameIngrediant.value);
    let extIng = false;

    for (const poing of porder.purchaseorderhasingredientslist) {
        if (selctctIngredients.id == poing.ingredients_id.id) {
            extIng = true;
            break;
        }
    }
    if (extIng) {
        Swal.fire({
            title: "Selected Ingredient Already Ext",
            html: "(select another ingredient)",
            icon: "warning"
        });
        purchaseorderhasingredients = {};
        unitPrice.value = "";
        qtyTxt.value = "";
        linePrice.value = "";
        nameIngreadient.style.border = "1px solid #ced4da";
        unitPrice.style.border = "1px solid #ced4da";
        qtyTxt.style.border = "1px solid #ced4da";
        linePrice.style.border = "1px solid #ced4da";

    } else {
        let errors = checkInnerFormError();
        if (errors == "") {
            swal.fire({
                title: 'Confirm Addition',
                html: 'Are you Sure to Submit selecteed Ingredient? <br>'
                    + '<br> Ingredient Name :' + purchaseorderhasingredients.ingredients_id.name,
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Yes, add it!',
                cancelButtonText: 'No, cancel',
                reverseButtons: true
            }).then((result) => {
                if (result.isConfirmed) {
                    porder.purchaseorderhasingredientslist.push(purchaseorderhasingredients);
                    refreshInnerFormAndTable();
                }
                Swal.fire({
                    title: 'Success',
                    html: 'Ingredient added successfully!',
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
            html: "(select another ingredient)",
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
