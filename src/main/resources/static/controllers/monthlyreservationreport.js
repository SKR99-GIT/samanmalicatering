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

    reservations = ajaxGetRequest("/reservation/getreservationbydaterange/" + firstDay + "/" + lastDay);

    refreshMonthlyResReportTable();
});


//create function for refresh table
const refreshMonthlyResReportTable = () => {

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

    //call fillDataIntoTable function (tableId,dataList,displayPropertyArrayName,editFunctionName, deleteFuctionName,PrintFuctionName, buttonvisibility, privilegeob)
    fillDataIntoTableWithoutModify(tableMonthlyResReport, reservations, displayProperty);

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


const monthlyResRepoTablePrint = () => {
    let newWindow = window.open();
    newWindow.document.write(
        "<html><head>" +
        "<link rel='stylesheet'href='/resources/bootstrap-5.3.1-dist/bootstrap-5.3.1-dist/css/bootstrap.min.css'></link>" + " <link rel='stylesheet' href='/resources/fontawesome-free-6.4.2-web/fontawesome-free-6.4.2-web/css/all.css'>" +
        "<title>" + "Monthly Reservation Report" + "</title>"
        + "</head><body>" +
        "<h2>" + "Monthly Reservation Report" + "</h2>" +
        tableMonthlyResReport.outerHTML
    );
    setTimeout(() => {
        newWindow.stop();
        newWindow.print();
        newWindow.close();
    }, 500)
}