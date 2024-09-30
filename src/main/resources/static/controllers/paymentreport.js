//browser onload event
window.addEventListener('load', () => {

    //mek methanin load krnn form eke withrak nwi table eketh button tiyenonh privilege balal enable/disable wennd oni
    userPrivilege = ajaxGetRequest("/privilage/bymodule/REPORT");

    payments = ajaxGetRequest("/payment/printall");

    refreshPaymentReportTable();
});


//create function for refresh table
const refreshPaymentReportTable = () => {

    //text --> string, number, date
    //function --> object,array, boolean --> craete function 
    //column count == object count
    //piliwelata dann 
    const displayProperty = [
        { dataType: 'function', propertyName: getReservationCode },
        { dataType: 'text', propertyName: 'billnumber' },
        { dataType: 'text', propertyName: 'payment_type' },
        { dataType: 'function', propertyName: getTotalAmount },
        { dataType: 'function', propertyName: getPaidAmount },
        { dataType: 'function', propertyName: getBalanceAmount },
        { dataType: 'function', propertyName: getPaymentMethod }
    ];

    //call fillDataIntoTable function (tableId,dataList,displayPropertyArrayName,editFunctionName, deleteFuctionName,PrintFuctionName, buttonvisibility, privilegeob)
    fillDataIntoTableWithoutModify(tablePaymentReport, payments, displayProperty);

}

//create function getEmployeeStatus
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


const payRepoTablePrint = () => {
    let newWindow = window.open();
    newWindow.document.write(
        "<html><head>" +
        "<link rel='stylesheet'href='/resources/bootstrap-5.3.1-dist/bootstrap-5.3.1-dist/css/bootstrap.min.css'></link>" + " <link rel='stylesheet' href='/resources/fontawesome-free-6.4.2-web/fontawesome-free-6.4.2-web/css/all.css'>" +
        "<title>" + "Paymet Report" + "</title>"
        + "</head><body>" +
        "<h2>" + "Payment Report" + "</h2>" +
        tablePaymentReport.outerHTML
    );
    setTimeout(() => {
        newWindow.stop();
        newWindow.print();
        newWindow.close();
    }, 500)
}


const generateReport = () => {

   payments = ajaxGetRequest("/payment/getPaymentsByDateRange/"+slctStartDate.value
    +"/" +slctEndDate.value);

    refreshPaymentReportTable();
}







