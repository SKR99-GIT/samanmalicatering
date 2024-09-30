window.addEventListener('load', () => {
    //mek methanin load krnn form eke withrak nwi table eketh button tiyenonh privilege balal enable/disable wennd oni
    userPrivilege = ajaxGetRequest("/privilage/bymodule/PAYMENT");

    refreshPaymentTable();
    refreshPaymentForm();
});

const refreshPaymentTable = () => {
    //pass the data in db to the table using this ajax call
    payments = ajaxGetRequest("/payment/printall");

    //text --> string, number, date
    //function --> object,array, boolean --> craete function 
    //column count == object count
    //piliwelata dann
    const displayProperty = [
        { dataType: 'function', propertyName: getReservationCode },
        { dataType: 'text', propertyName: 'billnumber' },
        { dataType: 'function', propertyName: getTotalAmount },
        { dataType: 'function', propertyName: getPaidAmount },
        { dataType: 'function', propertyName: getBalanceAmount },
        { dataType: 'function', propertyName: getPaymentMethod }
    ];

    //call fillDataIntoTable function (tableId,dataList,displayPropertyArrayName,editFunctionName, deleteFuctionName,PrintFuctionName)
    fillDataIntoTableWithPrint(tablePayment, payments, displayProperty, printPayment, true, userPrivilege);

    //basicma jquery datatable active krgnn widiha
    $('#tablePayment').dataTable();

}

const getReservationCode = (ob) => {
    return ob.reservation_id.reservationcode;
}

const getTotalAmount = (ob) => {
    if (ob.totalamount) {
        return parseFloat(ob.totalamount).toFixed(2);
    }
}

const getPaidAmount = (ob) => {
    if (ob.paidamount) {
        return parseFloat(ob.paidamount).toFixed(2);
    }
}

const getBalanceAmount = (ob) => {
    if (ob.balanceamount) {
        return parseFloat(ob.balanceamount).toFixed(2);
    } else {
        return "0.00"
    }
}

const getPaymentMethod = (ob) => {
    return ob.paymentmethod_id.name;
}

const generateTotalAmount = () => {
    let selectReservation = JSON.parse(slctReservationCode.value);
    textTotalAmount.value = (parseFloat(selectReservation.totalprice) - parseFloat(selectReservation.paidamount)).toFixed(2);
    textTotalAmount.style.border = "1px solid green";
    textTotalAmount.disabled = "disabled";
    payment.totalamount = textTotalAmount.value;
}

const generateBalanceAmount = () => {
    if (textPaidAmount.value != "") {
        textBalanceAmount.value = (parseFloat(textTotalAmount.value) - parseFloat(textPaidAmount.value)).toFixed(2);
        textBalanceAmount.style.border = "1px solid green";
        textBalanceAmount.disabled = "disabled";
        payment.balanceamount = textBalanceAmount.value;
    } else {
        textBalanceAmount.value = parseFloat(textTotalAmount.value)
    }
}

const setFullPayment = () => {
    if (textPaidAmount.value == textTotalAmount.value) {
        slctPaymentType.value = "Full_Payment";
    } else {
        slctPaymentType.value = "Advance"; 
    }
}

const checkFormError = () => {
    let errors = "";

    if (payment.totalamount == null) {
        errors = errors + "Please Enter Total Amount <br>";
        textTotalAmount.style.background = 'rgba(255,0,0,0.1)';
    }
    if (payment.paidamount == null) {
        errors = errors + "Please Enter Total Amount <br>";
        textPaidAmount.style.background = 'rgba(255,0,0,0.1)';
    }
    if (payment.balanceamount == null) {
        errors = errors + "Please Enter Total Amount <br>";
        textBalanceAmount.style.background = 'rgba(255,0,0,0.1)';
    }
    if (payment.paymentmethod_id == null) {
        errors = errors + "Please Select Payment Method <br>";
        slctPaymentMethod.style.background = 'rgba(255,0,0,0.1)';
    }
    if (payment.payment_type == null) {
        errors = errors + "Please Select Payment Type <br>";
        slctPaymentType.style.background = 'rgba(255,0,0,0.1)';
    }
    if (payment.reservation_id == null) {
        errors = errors + "Please Select Reservation Code <br>";
        slctReservationCode.style.background = 'rgba(255,0,0,0.1)';
    }
    /*  if (textPaidAmount.value > textTotalAmount.value) {
        errors = errors + "Palese check your Paid Amonut Again <br>";
        textPaidAmount.style.background = 'rgba(255,0,0,0.1)';
    }  */
    return errors;
}

const paymentSubmit = () => {
    //1)check button
    console.log("submit");
    console.log(payment);
    //check form error
    const errors = checkFormError();
    // If no errors
    if (errors == '') {
        // Get user confirmation using SweetAlert2
        Swal.fire({
            title: 'Confirm Addition',
            html: 'Are you sure to Save following Payment Details..? <br>'
                + '<br> Reservation Code : ' + payment.reservation_id.reservationcode
                + '<br> Total Balance Amount : ' + payment.totalamount,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, add it!',
            cancelButtonText: 'No, cancel',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                // Call POST service
                let postServerResponce = ajaxHTTPRequest("/payment", "POST", payment);
                // Check post service response
                if (postServerResponce == "OK") {
                    refreshPaymentTable();
                    formPayment.reset();
                    refreshPaymentForm();
                    $('#offcanvasPaymentAdd').offcanvas('hide');

                    Swal.fire({
                        title: 'Success',
                        html: 'Payment added successfully!',
                        icon: 'success'
                    });
                } else {
                    Swal.fire({
                        title: 'Form Error',
                        html: 'Fail to submit Payment details <br>' + postServerResponce,
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

const printPayment = (rowOb, rowIndex) => {
    //open view details
    $('#paymentViewModal').modal('show');

    viewReservationCode.innerHTML = rowOb.reservation_id.reservationcode;
    viewBillNumber.innerHTML = rowOb.billnumber;
    viewPaymentType.innerHTML = rowOb.payment_type;
    viewTotal.innerHTML = rowOb.totalamount;
    viewPaid.innerHTML = rowOb.paidamount;
    viewBalance.innerHTML = rowOb.balanceamount;
    viewPaymentMethod.innerHTML = rowOb.paymentmethod_id.name;
    viewTransferId.innerHTML = rowOb.transfer_id;
    viewTransferDateTime.innerHTML = rowOb.transferdatetime;
    viewAddDateTime.innerHTML = rowOb.addeddatetime.split("T")[0] + " " + rowOb.addeddatetime.split("T")[1];
    viewNote.innerHTML = rowOb.payment_note;

}

const btnPrintRow = () => {
    console.log("print");
    console.log(payment);

    let newWindow = window.open();
    newWindow.document.write("<html><head>" +
        "<link rel='stylesheet' href='resources/bootstrap-5.3.1-dist/bootstrap-5.3.1-dist/css/bootstrap.min.css'></link>" +
        "<title>" + "Payment Details" + "</title>"
        + "</head><body>" +
        "<h2>" + "Payment Details" + "</h2>" +
        printPaymentTable.outerHTML + "<script>printPaymentTable.classList.remove('d-none');</script></body></html>"
    );

    setTimeout(() => {
        newWindow.stop();//table ek load wena ek nawathinw
        newWindow.print();//table ek print weno
        newWindow.close();//aluthin open una window tab ek close weno
        //ar data load wenn nm  time out ekk oni weno aduma 500k wth
    }, 500)
}

const generateAmount = () => {

    let selectedPaymentType = slctPaymentType.value;
    let totalAmount = textTotalAmount.value

    if (selectedPaymentType == "Advance") {
        textPaidAmount.value = parseFloat(totalAmount * 0.2).toFixed(2);
        textPaidAmount.style.border = "1px solid green";
        payment.paidamount = textPaidAmount.value;
    } else {
        textPaidAmount.value = totalAmount;
        textPaidAmount.style.border = "1px solid green";
        payment.paidamount = textPaidAmount.value;
    }
}

const getValidAmount = () => {
    if (new RegExp(/^[1-9][0-9]{0,6}([.][0-9]{2})?$/).test(textPaidAmount.value) && parseFloat(textPaidAmount.value) <= parseFloat(textTotalAmount.value)) {
        textPaidAmount.style.border = "2px solid green";
        payment.paidamount = textPaidAmount.value;
    } else {
        textPaidAmount.style.border = "2px solid red";
        textBalanceAmount.style.border = "1px solid red";
        if (textPaidAmount.value > textTotalAmount.value) {
            Swal.fire({
                title: "Error",
                html: "Please Enter Valid Paid Amount",
                icon: "error"
            });
            textPaidAmount.value = null;
            textBalanceAmount.value = null;
        }
    }
}

const refreshPaymentForm = () => {
    payment = {};
    oldPayment = null;

    paymentMethods = ajaxGetRequest("/paymentmethod/list");
    fillDataIntoSelect(slctPaymentMethod, "Select Payment Method", paymentMethods, "name");

    reservationCodes = ajaxGetRequest("/reservation/getUpcomingPaymentReservation");
    reservationCodes.sort((a, b) => b.id - a.id);
    fillDataIntoSelect(slctReservationCode, "Select Reservation Code", reservationCodes, "reservationcode");

    slctReservationCode.style.border = "2px solid #ced4da";
    textTotalAmount.style.border = "2px solid #ced4da";
    textPaidAmount.style.border = "2px solid #ced4da";
    textBalanceAmount.style.border = "2px solid #ced4da";
    slctPaymentMethod.style.border = "2px solid #ced4da";
    slctPaymentType.style.border = "2px solid #ced4da";
    transferIdTxt.style.border = "2px solid #ced4da";
    TransferDateTime.style.border = "2px solid #ced4da";
    textNote.style.border = "2px solid #ced4da";

    if (userPrivilege.priviinsert) {
        btnPaymentSubmit.disabled = "";
    } else {
        btnPaymentSubmit.disabled = "disabled"
    }

}