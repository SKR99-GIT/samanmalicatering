window.addEventListener('load', () => {

    //mek methanin load krnn form eke withrak nwi table eketh button tiyenonh privilege balal enable/disable wennd oni
    userPrivilege = ajaxGetRequest("/privilage/bymodule/IRN");

    refreshIrnTable();
    refreshIrnForm();
});

const refreshIrnTable = () => {
    //pass the data in db to the table
    irns = ajaxGetRequest("/irn/printall");

    //text --> string, number, date
    //function --> object,array, boolean --> craete function 
    //column count == object count
    //piliwelata dann
    const displayProperty = [
        { dataType: 'function', propertyName: getSupplierName },
        { dataType: 'text', propertyName: 'reservedate' },
        { dataType: 'function', propertyName: getIrnTotal },
        { dataType: 'function', propertyName: getIrnDiscount },
        { dataType: 'function', propertyName: getIrnNet },
        { dataType: 'text', propertyName: 'supplierbillnumber' },
        { dataType: 'function', propertyName: getIrnStatus }
    ];

    //call fillDataIntoTable function (tableId,dataList,displayPropertyArrayName,editFunctionName, deleteFuctionName,PrintFuctionName)
    fillDataIntoTableWithPrint(tableIRN, irns, displayProperty, printIrn, true, userPrivilege);

    //basicma jquery datatable active krgnn widiha
    $('#tableIRN').dataTable();
}

const getSupplierName = (ob) => {
    return ob.supplier_id.name;
}

const getIrnTotal = (ob) => {
    if (ob.totalamount) {
        return parseFloat(ob.totalamount).toFixed(2);
    }
}

const getIrnDiscount = (ob) => {
    if (ob.discountrate) {
        return parseFloat(ob.discountrate).toFixed(2);
    } else {
        return "0";
    }
}

const getIrnNet = (ob) => {
    if (ob.netamount) {
        return parseFloat(ob.netamount).toFixed(2);
    }
}

const getIrnStatus = (ob) => {
    if (ob.irnstatus_id.name == 'Reserved') {
        return '<span class="text-success fw-bold">Reserved</span>'
    } else {
        return '<span class="text-primary fw-bold">Requested</span>';
    }
}

const checkFormError = () => {
    let errors = "";

    if (irn.reservedate == null) {
        errors = errors + "Please Enter Reserve Date <br>";
        reserveDate.style.background = 'rgba(255,0,0,0.1)';
    }
    if (irn.totalamount == null) {
        errors = errors + "Please Enter Total Amount <br>";
        textTotalAmount.style.background = 'rgba(255,0,0,0.1)';
    }
    if (irn.discountrate == null) {
        errors = errors + "Please Enter Discount Amount <br>";
        textDiscountRate.style.background = 'rgba(255,0,0,0.1)';
    }
    if (irn.netamount == null) {
        errors = errors + "Please Enter Net Amount <br>";
        textNetAmount.style.background = 'rgba(255,0,0,0.1)';
    }
    if (irn.supplier_id == null) {
        errors = errors + "Please Select Supplier <br>";
        nameSupplier.style.background = 'rgba(255,0,0,0.1)';
    }
    if (irn.irnstatus_id == null) {
        errors = errors + "Please Select IRN Status <br>";
        slctIrnStatus.style.background = 'rgba(255,0,0,0.1)';
    }
    return errors;
}

const irnSubmit = () => {
    // check submit button
    console.log("submit");
    console.log(irn);

    // Check form error
    const errors = checkFormError();
    // If no errors
    if (errors == '') {
        // Get user confirmation using SweetAlert2
        Swal.fire({
            title: 'Confirm Addition',
            html: 'Are you sure to Save following IRN Details..? <br>'
                + '<br> Supplier Name: ' + irn.supplier_id.name
                + '<br> Total Amount: ' + irn.totalamount,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, add it!',
            cancelButtonText: 'No, cancel',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                // Call POST service
                let postServerResponce = ajaxHTTPRequest("/irn", "POST", irn);
                // Check post service response
                if (postServerResponce == "OK") {
                    refreshIrnTable();
                    formIrn.reset();
                    refreshIrnForm();
                    $('#offcanvasIrnAdd').offcanvas('hide');

                    Swal.fire({
                        title: 'Success',
                        html: 'IRN added successfully!',
                        icon: 'success'
                    });
                } else {
                    Swal.fire({
                        title: 'Form Error',
                        html: 'Failed to submit IRN. <br>' + postServerResponce,
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

const printIrn = (rowOb, rowIndex) => {

    //open view details
    $('#irnViewModal').modal('show');

    viewIrnCode.innerHTML = rowOb.irncode;
    viewSupplier.innerHTML = rowOb.supplier_id.name;
    viewPorderCode.innerHTML = rowOb.purchaseorder_id.pordercode;
    viewReserveDate.innerHTML = rowOb.reservedate;
    viewTotal.innerHTML = rowOb.totalamount;
    viewNetAmount.innerHTML = rowOb.netamount;
    viewAddDateTime.innerHTML = rowOb.addeddatetime.split("T")[0] + " " + rowOb.addeddatetime.split("T")[1];;
    viewStatus.innerHTML = rowOb.irnstatus_id.name;
    viewNote.innerHTML = rowOb.note;

    //refresh table area
    let displayPropertyList = [
        { dataType: "function", propertyName: getIngName },
        { dataType: "function", propertyName: getUnitprice },
        { dataType: "function", propertyName: getQty },
        { dataType: "function", propertyName: getLinePrice },
    ];
    fillDataIntoInnerTable(tableIngInner, rowOb.irnhasingredientslist, displayPropertyList, deleteInnerForm, false);
}

const btnPrintRow = () => {
    console.log("print");
    console.log(irn);

    let newWindow = window.open();
    newWindow.document.write("<html><head>" +
        "<link rel='stylesheet' href='resources/bootstrap-5.3.1-dist/bootstrap-5.3.1-dist/css/bootstrap.min.css'></link>" +
        "<title>" + "IRN Details" + "</title>"
        + "</head><body>" +
        "<h2>" + "IRN Details" + "</h2>" +
        printIrnTable.outerHTML + "<script>printIrnTable.classList.remove('d-none');</script></body></html>"
    );

    setTimeout(() => {
        newWindow.stop();//table ek load wena ek nawathinw
        newWindow.print();//table ek print weno
        newWindow.close();//aluthin open una window tab ek close weno
        //ar data load wenn nm  time out ekk oni weno aduma 500k wth
    }, 500)
}

const getPorderBySup = () => {
    const currentSupplierId = JSON.parse(nameSupplier.value).id;
    nameSupplier.style.border = "2px solid green";
    pordersFilter = ajaxGetRequest("/porder/getporderbysupplier" + currentSupplierId);
    fillDataIntoSelect(slctPorder, "Select Purchase Order Code", pordersFilter, "pordercode");
}

const refreshIrnForm = () => {
    irn = {};
    oldIrn = null;

    irn.irnhasingredientslist = new Array();

    suppliers = ajaxGetRequest("/supplier/getactivesupplier");
    fillDataIntoSelect(nameSupplier, "Select Supplier", suppliers, "name");

    irnStatus = ajaxGetRequest("/irnstatus/list");
    fillDataIntoSelect(slctIrnStatus, "Select Status", irnStatus, "name", "Requested");

    nameSupplier.style.boder = "1px solid #ced4da";
    reserveDate.style.boder = "1px solid #ced4da";
    textTotalAmount.style.boder = "1px solid #ced4da";
    textDiscountRate.style.boder = "1px solid #ced4da";
    textNetAmount.style.boder = "1px solid #ced4da";
    slctPorder.style.boder = "1px solid #ced4da";
    slctIrnStatus.style.boder = "1px solid #ced4da";
    textNote.style.boder = "1px solid #ced4da";

    irn.irnstatus_id = JSON.parse(slctIrnStatus.value);
    slctIrnStatus.style.border = "1px solid green";
    slctIrnStatus.disabled = true;

    textDiscountRate.value = 0;
    irn.discountrate = textDiscountRate.value;

    refreshInnerFormAndTable();

    if (userPrivilege.priviinsert) {
        btnIrnSubmit.disabled = "";
    } else {
        btnIrnSubmit.disabled = "disabled"
    }
}

// inner form area start

const getIngByPorder = () => {
    const currentPorderId = JSON.parse(slctPorder.value).id;
    slctPorder.style.border = "2px solid green";
    IngFilter = ajaxGetRequest("/ingredients/getbyporder/" + currentPorderId);
    fillDataIntoSelect(nameIngreadient, "Select Ingredient", IngFilter, "name");
}

const changeUnitPrice = () => {

    unitPrice.disabled = false;
}

const refreshInnerFormAndTable = () => {
    //refresh form area
    irnhasingredients = {};

    //refresh table area
    let displayPropertyList = [
        { dataType: "function", propertyName: getIngName },
        { dataType: "function", propertyName: getUnitprice },
        { dataType: "function", propertyName: getQty },
        { dataType: "function", propertyName: getLinePrice },
    ];
    fillDataIntoInnerTable(tableInner, irn.irnhasingredientslist, displayPropertyList, deleteInnerForm);

    let totalAmount = 0.00;
    for (const irning of irn.irnhasingredientslist) {
        totalAmount = parseFloat(totalAmount) + parseFloat(irning.line_price);
    }
    //toFixed krpu gmnm mek string ekk bawata convert wenwa, mek aaye calculation wlt gnnw nm ek oni wididhta hadagnnd
    textTotalAmount.value = parseFloat(totalAmount).toFixed(2);
    textTotalAmount.style.border = "1px solid #ced4da";
    textTotalAmount.disabled = "disabled";
    irn.totalamount = textTotalAmount.value;

    let netAmount = 0.00;
    for (const irning of irn.irnhasingredientslist) {
        netAmount = parseFloat(netAmount) + parseFloat(irning.line_price);
    }
    textNetAmount.value = parseFloat(netAmount).toFixed(2);
    textNetAmount.style.border = "1px solid #ced4da";
    textNetAmount.disabled = "disabled";
    irn.netamount = textNetAmount.value;

    unitPrice.value = ""
    qtyTxt.value = ""
    linePrice.value = ""

    nameIngreadient.style.border = "1px solid #ced4da";
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
            let extIndex = irn.irnhasingredientslist.map(irning => irning.ingredients_id.id).indexOf(innerOb.ingredients_id.id);
            if (extIndex != -1) {
                irn.irnhasingredientslist.splice(extIndex, 1);
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

const getIngName = (innerOb) => {
    return innerOb.ingredients_id.name;
}

const getUnitprice = (innerOb) => {
    return parseFloat(innerOb.unit_price).toFixed(2);
}

const getQty = (innerOb) => {
    return parseFloat(innerOb.quantity).toFixed(3);
}

const getLinePrice = (innerOb) => {
    return parseFloat(innerOb.line_price).toFixed(2);
}

const generateUnitPrice = () => {
    //path variable 2k tiyen nisa 
    let currentIngredientId = JSON.parse(nameIngreadient.value).id;
    let currentPorderId = JSON.parse(slctPorder.value).id;
    porderIngredient = ajaxGetRequest("/porderhasIng/byprderingredient/" + currentPorderId + "/" + currentIngredientId);

    unitPrice.value = parseFloat(porderIngredient.unit_price).toFixed(2);
    unitPrice.style.border = "1px solid green";
    unitPrice.disabled = "disabled";
    irnhasingredients.unit_price = unitPrice.value;

    //ingredient ek maaru krnoth line price ekai qty ekai clear wennd oni
    qtyTxt.value = "";
    irnhasingredients.quantity = null;
    qtyTxt.style.border = "1px solid #ced4da";

    linePrice.style.border = "1px solid #ced4da";
    linePrice.value = "";
    irnhasingredients.line_price = null;

}

const textQtyValidator = () => {
    if (new RegExp("^([1-9][0-9]{0,3})|([1-9][0-9]{0,3}[.][0-9]{1,3})$").test(qtyTxt.value)) {
        linePrice.value = (parseFloat(qtyTxt.value) * parseFloat(unitPrice.value)).toFixed(2);
        linePrice.style.border = "2px solid green";
        qtyTxt.style.border = "2px solid green";
        linePrice.disabled = "disabled";
        irnhasingredients.line_price = linePrice.value;
        irnhasingredients.quantity = qtyTxt.value;
        btnInnerSubmit.disabled = "";
    } else {
        linePrice.value = "";
        linePrice.style.border = "2px solid #ced4da";
        qtyTxt.style.border = "2px solid #ced4da";
        linePrice.disabled = "disabled";
        irnhasingredients.line_price = null;
        irnhasingredients.quantity = null;
    }
}

const generateNetAmount = () => {
    textNetAmount.value = (parseFloat(textTotalAmount.value) * parseFloat(textDiscountRate.value) / 100).toFixed(2);
    textNetAmount.value = (parseFloat(textTotalAmount.value) - textNetAmout.value).toFixed(2);
    textNetAmount.style.border = "2px solid #ced4da";
    textDiscountRate.style.border = "2px solid #ced4da";
    textNetAmount.disabled = "disabled";
    irn.netamount = textNetAmount.value;
}

const checkInnerFormError = () => {
    let errors = "";

    if (irnhasingredients.ingredients_id.id == null) {
        errors = errors + "Please select ingredients \n";
    }
    if (irnhasingredients.quantity == null) {
        errors = errors + "Please enter Quantity \n";
    }
    return errors;
}

//inner from ekt item add weno
const innerSubmit = () => {
    //check duplicate 
    let selctctIngredients = JSON.parse(nameIngreadient.value);
    let extIng = false;

    for (const irning of irn.irnhasingredientslist) {
        if (selctctIngredients.id == irning.ingredients_id.id) {
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
        irnhasingredients = {};
        unitPrice.value = "";
        qtyTxt.value = "";
        linePrice.value = "";
        batchNumberTxt = "";
        expireDate = "";
        nameIngreadient.style.border = "1px solid #ced4da";
        unitPrice.style.border = "1px solid #ced4da";
        qtyTxt.style.border = "1px solid #ced4da";
        linePrice.style.border = "1px solid #ced4da";
        batchNumberTxt.style.border = "1px solid #ced4da";
        expireDate.style.border = "1px solid #ced4da";

    } else {
        let errors = checkInnerFormError();
        if (errors == "") {
            swal.fire({
                title: 'Confirm Addition',
                html: 'Are you Sure to Submit selecteed Ingredient? <br>'
                    + '<br> Ingredient Name :' + irnhasingredients.ingredients_id.name,
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Yes, add it!',
                cancelButtonText: 'No, cancel',
                reverseButtons: true
            }).then((result) => {
                if (result.isConfirmed) {
                    irn.irnhasingredientslist.push(irnhasingredients);
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