window.addEventListener('load', () => {
    //mek methanin load krnn form eke withrak nwi table eketh button tiyenonh privilege balal enable/disable wennd oni
    userPrivilege = ajaxGetRequest("/privilage/bymodule/SUPPLIERPAYMENT");
    refreshSupPaymentTable();
    refreshSupPaymentForm();
});

const refreshSupPaymentTable = () => {
    //pass the data in db to the table using this ajax call
    supplierpayments = ajaxGetRequest("/supplierpayment/printall");

    //text --> string, number, date
    //function --> object,array, boolean --> craete function 
    //column count == object count
    //piliwelata dann
    const displayProperty = [
        { dataType: 'function', propertyName: getSupplierName },
        { dataType: 'function', propertyName: getTotalAmount },
        { dataType: 'function', propertyName: getTotalPaid },
        { dataType: 'function', propertyName: getTotalBalance },
        { dataType: 'text', propertyName: 'billnumber' }
    ];

    //call fillDataIntoTable function (tableId,dataList,displayPropertyArrayName,editFunctionName, deleteFuctionName,PrintFuctionName)
    fillDataIntoTableWithPrint(tableSupPayment, supplierpayments, displayProperty,  printSupPayment, true, userPrivilege);

    //basicma jquery datatable active krgnn widiha
    $('#tableSupPayment').dataTable();

}

const getSupplierName = (ob) => {
    return ob.supplier_id.name;
}

const getTotalAmount = (ob) => {
    if (ob.totalamount) {
        return parseFloat(ob.totalamount).toFixed(2);
    }
}

const getTotalPaid = (ob) => {
    if (ob.totalpaidamount) {
        return parseFloat(ob.totalpaidamount).toFixed(2);
    }
}

const getTotalBalance = (ob) => {
    if (ob.totalbalanceamount) {
        return parseFloat(ob.totalbalanceamount).toFixed(2);
    }
}

const checkFormError = () => {
    let errors = "";

    if (supplierpayment.totalamount == null) {
        errors = errors + "Please Enter Total Amount <br>";
        totalAmount.style.background = 'rgba(255,0,0,0.1)';
    }
    if (supplierpayment.totalpaidamount == null) {
        errors = errors + "Please Enter Total Paid Amount <br>";
        textTotalPaidAmount.style.background = 'rgba(255,0,0,0.1)';
    }
    if (supplierpayment.totalbalanceamount == null) {
        errors = errors + "Please Enter Total Balance Amount <br>";
        textTotalBalanceAmount.style.background = 'rgba(255,0,0,0.1)';
    }
    if (supplierpayment.supplier_id == null) {
        errors = errors + "Please Select Supplier <br>";
        nameSupplier.style.background = 'rgba(255,0,0,0.1)';
    }
    if (supplierpayment.paymentmethod_id == null) {
        errors = errors + "Please Select Payment Method <br>";
        slctPaymentMethod.style.background = 'rgba(255,0,0,0.1)';
    }
    return errors;
}

const supPaySubmit = () => {
    //1)check button
    console.log("submit");
    //check form error
    const errors = checkFormError();
    // If no errors
    if (errors == '') {
        // Get user confirmation using SweetAlert2
        Swal.fire({
            title: 'Confirm Addition',
            html: 'Are you sure to Save following Supplier Payment Details..? <br>'
                + '<br> Supplier Name : ' + supplierpayment.supplier_id.name
                + '<br> Total Balance Amount : ' + supplierpayment.totalbalanceamount,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, add it!',
            cancelButtonText: 'No, cancel',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                // Call POST service
                let postServerResponce = ajaxHTTPRequest("/supplierpayment", "POST", supplierpayment);
                // Check post service response
                if (postServerResponce == "OK") {
                    refreshSupPaymentTable();
                    formSupPayment.reset();
                    refreshSupPaymentForm();
                    $('#offcanvasSupPaymentAdd').offcanvas('hide');

                    Swal.fire({
                        title: 'Success',
                        html: 'Suppler Payment added successfully!',
                        icon: 'success'
                    });
                } else {
                    Swal.fire({
                        title: 'Form Error',
                        html: 'Fail to submit Supplier Payment details \n' + postServerResponce,
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

const printSupPayment = (rowOb, rowIndex) => {
    //open view details
    $('#supPayViewModal').modal('show');

    viewSupplier.innerHTML = rowOb.supplier_id.name;
    viewTotal.innerHTML = rowOb.totalamount;
    viewPaid.innerHTML = rowOb.totalpaidamount;
    viewBalance.innerHTML = rowOb.totalbalanceamount;
    viewAddDateTime.innerHTML = rowOb.addeddatetime.split("T")[0] + " " + rowOb.addeddatetime.split("T")[1];
    viewNote.innerHTML = rowOb.note;
    viewChequeNumber.innerHTML = rowOb.chequenumber;
    viewChequeDate.innerHTML = rowOb.chequedate;
    viewTransferId.innerHTML = rowOb.transfer_id;
    viewTransferDateTime.innerHTML = rowOb.transfer_datetime;
    viewBankName.innerHTML = rowOb.bankname;

    //refresh table area
    const displayPropertyList = [
        { dataType: "function", propertyName: getIRN },
        { dataType: "function", propertyName: getTotal },
        { dataType: "function", propertyName: getPaid },
        { dataType: "function", propertyName: getBalance },
    ];
    fillDataIntoInnerTable(tableSupPayInnerPrint, rowOb.supplierpaymenthasirnlist, displayPropertyList, deleteInnerForm, false);
}

const btnPrintRow = () => {
    console.log("print");
    console.log(supplierpayment);

    let newWindow = window.open();
    newWindow.document.write("<html><head>" +
        "<link rel='stylesheet' href='resources/bootstrap-5.3.1-dist/bootstrap-5.3.1-dist/css/bootstrap.min.css'></link>" +
        "<title>" + "Supplier Payment Details" + "</title>"
        + "</head><body>" +
        "<h2>" + "Supplier Payment Details" + "</h2>" +
        printSupPayTable.outerHTML + "<script>printSupPayTable.classList.remove('d-none');</script></body></html>"
    );

    setTimeout(() => {
        newWindow.stop();//table ek load wena ek nawathinw
        newWindow.print();//table ek print weno
        newWindow.close();//aluthin open una window tab ek close weno
        //ar data load wenn nm  time out ekk oni weno aduma 500k wth
    }, 500)
}

const refreshSupPaymentForm = () => {
    supplierpayment = {};
    oldSupplierpayment = null;

    supplierpayment.supplierpaymenthasirnlist = new Array();

    suppliers = ajaxGetRequest("/supplier/getactivesupplier");
    fillDataIntoSelect(nameSupplier, "Select Supplier", suppliers, "name");

    paymentMethods = ajaxGetRequest("/paymentmethod/list");
    fillDataIntoSelect(slctPaymentMethod, "Select Payment Method", paymentMethods, "name");

    nameSupplier.style.boder = "1px solid #ced4da";
    totalAmount.style.boder = "1px solid #ced4da";
    textTotalPaidAmount.style.boder = "1px solid #ced4da";
    textTotalBalanceAmount.style.boder = "1px solid #ced4da";
    slctPaymentMethod.style.boder = "1px solid #ced4da";
    chequeNumberTxt.style.boder = "1px solid #ced4da";
    chequeDate.style.boder = "1px solid #ced4da";
    transferIdTxt.style.boder = "1px solid #ced4da";
    TransferDateTime.style.boder = "1px solid #ced4da";
    bankNameTxt.style.boder = "1px solid #ced4da";
    textNote.style.boder = "1px solid #ced4da";

    if (userPrivilege.priviinsert) {
        btnSupPaymentSubmit.disabled = "";
    } else {
        btnSupPaymentSubmit.disabled = "disabled"
    }

    refreshInnerFormAndTable();
}

const getIrnBySup = () => {
    const currentSupId = JSON.parse(nameSupplier.value).id;
    nameSupplier.style.border = "2px solid green";
    irnFilter = ajaxGetRequest("/irn/getirnbysupplier/" + currentSupId);
    fillDataIntoSelect(nameIrn, "Select IRN", irnFilter, "irncode");
}

//inner form area start
const refreshInnerFormAndTable = () => {

    supplierpaymenthasirn = {};

    irns = ajaxGetRequest("/irn/printall");
    fillDataIntoSelect(nameIrn, "Select IRN", irns, "irncode");

    //refresh table area
    const displayPropertyList = [
        { dataType: "function", propertyName: getIRN },
        { dataType: "function", propertyName: getTotal },
        { dataType: "function", propertyName: getPaid },
        { dataType: "function", propertyName: getBalance },
    ];
    fillDataIntoInnerTable(tableInner, supplierpayment.supplierpaymenthasirnlist, displayPropertyList, deleteInnerForm);

    let TotalAmount = 0.00;
    for (const suppayirn of supplierpayment.supplierpaymenthasirnlist) {
        TotalAmount = parseFloat(TotalAmount) + parseFloat(suppayirn.totalamount);
    }
    //toFixed krpu gmnm mek string ekk bawata convert wenwa, mek aaye calculation wlt gnnw nm ek oni wididhta hadagnnd
    totalAmount.value = parseFloat(TotalAmount).toFixed(2);
    totalAmount.style.border = "1px solid #ced4da";
    totalAmount.disabled = "disabled";
    supplierpayment.totalamount = totalAmount.value;

    let PaidAmount = 0.00;
    for (const suppayirn of supplierpayment.supplierpaymenthasirnlist) {
        PaidAmount = parseFloat(PaidAmount) + parseFloat(suppayirn.paidamount);
    }
    textTotalPaidAmount.value = parseFloat(PaidAmount).toFixed(2);
    textTotalPaidAmount.style.border = "1px solid #ced4da";
    textTotalPaidAmount.disabled = "disabled";
    supplierpayment.totalpaidamount = textTotalPaidAmount.value;

    let BalanceAmount = 0.00;
    for (const suppayirn of supplierpayment.supplierpaymenthasirnlist) {
        BalanceAmount = parseFloat(BalanceAmount) + parseFloat(suppayirn.balanceamount);
    }
    textTotalBalanceAmount.value = parseFloat(BalanceAmount).toFixed(2);
    textTotalBalanceAmount.style.border = "1px solid #ced4da";
    textTotalBalanceAmount.disabled = "disabled";
    supplierpayment.totalbalanceamount = textTotalBalanceAmount.value;

    textTotalAmount.value = "";
    balanceAmount.value = "";
    paidAmount.value = "";
    nameIrn.style.border = "1px solid #ced4da";
    balanceAmount.style.border = "1px solid #ced4da";
    textTotalAmount.style.border = "1px solid #ced4da";
    paidAmount.style.border = "1px solid #ced4da";
}

const generateTotalAmount = () => {
    let selectIrn = JSON.parse(nameIrn.value);
    textTotalAmount.value = (parseFloat(selectIrn.netamount) - parseFloat(selectIrn.paidamount)).toFixed(2);
    textTotalAmount.style.border = "1px solid green";
    textTotalAmount.disabled = "disabled";
    supplierpaymenthasirn.totalamount = textTotalAmount.value;
}

const generateBalanceAmount = () => {
    balanceAmount.value = (parseFloat(textTotalAmount.value) - parseFloat(paidAmount.value)).toFixed(2);
    balanceAmount.style.border = "2px solid green";
    balanceAmount.disabled = "disabled";
    btnInnerSubmit.disabled = "";
    supplierpaymenthasirn.balanceamount = balanceAmount.value;
}

const getIRN = (innerOb) => {
    return innerOb.irn_id.irncode;
}

const getTotal = (innerOb) => {
    return parseFloat(innerOb.totalamount).toFixed(2);
}

const getPaid = (innerOb) => {
    return parseFloat(innerOb.paidamount).toFixed(2);
}

const getBalance = (innerOb) => {
    return parseFloat(innerOb.balanceamount).toFixed(2);
}

const deleteInnerForm = (innerOb) => {
    Swal.fire({
        title: 'Are you sure to remove the IRN details?',
        text: "IRN code: " + innerOb.irn_id.irncode,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, remove it!'
    }).then((result) => {
        if (result.isConfirmed) {
            let extIndex = supplierpayment.supplierpaymenthasirnlist.map(suppayirn => suppayirn.irn_id.id).indexOf(innerOb.irn_id.id);
            if (extIndex != -1) {
                supplierpayment.supplierpaymenthasirnlist.splice(extIndex, 1);
                Swal.fire({
                    icon: 'success',
                    title: 'IRN Removed Successfully!',
                    showConfirmButton: true,
                }).then(() => {
                    refreshInnerFormAndTable();
                });
            }
        }
    });
}

const checkInnerFormError = () => {
    let errors = "";

    if (supplierpaymenthasirn.irn_id.id == null) {
        errors = errors + "Please select IRN \n";
    }
    if (supplierpaymenthasirn.totalamount == null) {
        errors = errors + "Please enter total amount \n";
    }
    if (supplierpaymenthasirn.paidamount == null) {
        errors = errors + "Please enter paid amount \n";
    }
    if (supplierpaymenthasirn.balanceamount == null) {
        errors = errors + "Please enter balance amount \n";
    }
    return errors;
}

const innerSubmit = () => {
    //check duplicate 
    let selectIrn = JSON.parse(nameIrn.value);
    let extIrn = false;

    for (const suppayirn of supplierpayment.supplierpaymenthasirnlist) {
        if (selectIrn.id == suppayirn.irn_id.id) {
            extIrn = true;
            break;
        }
    }
    if (extIrn) {
        Swal.fire({
            icon: 'warning',
            html: 'Selected IRN Already Ext...!',
            showConfirmButton: true,
        });
        supplierpaymenthasirn = {};
        textTotalAmount.value = "";
        balanceAmount.value = "";
        paidAmount.value = "";
        nameIrn.style.border = "1px solid #ced4da";
        balanceAmount.style.border = "1px solid #ced4da";
        textTotalAmount.style.border = "1px solid #ced4da";
        paidAmount.style.border = "1px solid #ced4da";
    } else {
        let errors = checkInnerFormError();
        if (errors == "") {
            Swal.fire({
                title: 'Are you sure to submit the selected IRN?',
                html: "IRN Name: " + supplierpaymenthasirn.irn_id.name,
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, submit it!'
            }).then((result) => {
                if (result.isConfirmed) {
                    Swal.fire({
                        icon: 'success',
                        title: 'IRN added successfully!',
                        showConfirmButton: true,
                    }).then(() => {
                        supplierpayment.supplierpaymenthasirnlist.push(supplierpaymenthasirn);
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