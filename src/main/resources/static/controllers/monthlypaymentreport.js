//browser onload event
window.addEventListener('load', () => {

    //mek methanin load krnn form eke withrak nwi table eketh button tiyenonh privilege balal enable/disable wennd oni
    userPrivilege = ajaxGetRequest("/privilage/bymodule/REPORT");

    var date = new Date().toLocaleString("en-US", { timeZone: "Asia/Colombo" });
    date = new Date(date); // Convert the localized string back to a Date object
    
    var year = date.getFullYear();
    var month = date.getMonth(); // Current month (0-indexed)
    
    var firstDay = new Date(Date.UTC(year, month, 1)).toLocaleString("en-CA", { timeZone: "Asia/Colombo" }).split(',')[0];
    var lastDay = new Date(Date.UTC(year, month + 1, 0)).toLocaleString("en-CA", { timeZone: "Asia/Colombo" }).split(',')[0];
        

    payments = ajaxGetRequest("/payment/getPaymentsByDateRange/"+firstDay+"/"+lastDay);

    refreshMonthlyPaymentReportTable();
});

//create function for refresh table
const refreshMonthlyPaymentReportTable = () => {

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
    fillDataIntoTableWithoutModify(tableMonthlyPaymentReport, payments, displayProperty);

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


const monthlyPayRepoTablePrint = () => {
    let newWindow = window.open();
    newWindow.document.write(
        "<html><head>" +
        "<link rel='stylesheet'href='/resources/bootstrap-5.3.1-dist/bootstrap-5.3.1-dist/css/bootstrap.min.css'></link>" + " <link rel='stylesheet' href='/resources/fontawesome-free-6.4.2-web/fontawesome-free-6.4.2-web/css/all.css'>" +
        "<title>" + "Monthly Paymet Report" + "</title>"
        + "</head><body>" +
        "<h2>" + "Monthly Payment Report" + "</h2>" +
        tableMonthlyPaymentReport.outerHTML
    );
    setTimeout(() => {
        newWindow.stop();
        newWindow.print();
        newWindow.close();
    }, 500)
}
