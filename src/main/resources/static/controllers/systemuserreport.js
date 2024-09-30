//browser onload event
window.addEventListener('load', () => {

    //mek methanin load krnn form eke withrak nwi table eketh button tiyenonh privilege balal enable/disable wennd oni
    userPrivilege = ajaxGetRequest("/privilage/bymodule/REPORT");

    //filering dropdown
    designations = ajaxGetRequest("/designation/list");
    fillDataIntoSelect(desiTxt, 'Select Desiganation...', designations, 'name');

    employeeStatuses = ajaxGetRequest("/employeestatus/list");
    fillDataIntoSelect(slctEmployeeStatus, 'Select Status..', employeeStatuses, 'name');

    employees = ajaxGetRequest("/reportdataworkingemployee");

    refreshEmployeeReportTable();
});


//create function for refresh table
const refreshEmployeeReportTable = () => {

    //text --> string, number, date
    //function --> object,array, boolean --> craete function 
    //column count == object count
    //piliwelata dann 
    const displayProperty = [
        { dataType: 'text', propertyName: 'callingname' },
        { dataType: 'text', propertyName: 'fullname' },
        { dataType: 'text', propertyName: 'nic' },
        { dataType: 'function', propertyName: getGender },
        { dataType: 'text', propertyName: 'email' },
        { dataType: 'text', propertyName: 'mobile' },/*  */
        { dataType: 'function', propertyName: getEmployeeDesi },
        { dataType: 'imagearray', propertyName: 'employee_photo' },
        { dataType: 'function', propertyName: getEmployeeStatus },
    ];

    //call fillDataIntoTable function (tableId,dataList,displayPropertyArrayName,editFunctionName, deleteFuctionName,PrintFuctionName, buttonvisibility, privilegeob)
    fillDataIntoTableWithoutModify(tableEmployeeReport, employees, displayProperty);

}

//create function getEmployeeStatus
const getEmployeeStatus = (ob) => {

    if (ob.employeestatus_id.name == 'Working') {
        return '<p class="status-working">' + ob.employeestatus_id.name + '</p>';
    }
    if (ob.employeestatus_id.name == 'Resign') {
        return '<p class="status-resign">' + ob.employeestatus_id.name + '</p>';
    }
    if (ob.employeestatus_id.name == 'Delete') {
        return '<p class="status-delete">' + ob.employeestatus_id.name + '</p>';
    }

}

const getGender = (ob) => {
    if (ob.gender == 'Female') {
        return '<i class="fas fa-female fa-lg" style="color: #df77be;"></i>';
    } else {
        return '<i class="fas fa-male fa-lg" style="color: #465faa;"></i>';
    }
}

const getEmployeeDesi = (ob) => {
    return ob.designation_id.name;
}

const empRepoTablePrint = () => {
    let newWindow = window.open();
    newWindow.document.write(
        "<html><head>" +
        "<link rel='stylesheet'href='/resources/bootstrap-5.3.1-dist/bootstrap-5.3.1-dist/css/bootstrap.min.css'></link>" + " <link rel='stylesheet' href='/resources/fontawesome-free-6.4.2-web/fontawesome-free-6.4.2-web/css/all.css'>" +
        "<title>" + "Report Data Working Employee" + "</title>"
        + "</head><body>" +
        "<h2>" + "Report Data Working Employee" + "</h2>" +
        tableEmployeeReport.outerHTML
    );
    setTimeout(() => {
        newWindow.stop();
        newWindow.print();
        newWindow.close();
    }, 500)
}

const generateReport = () => {

    employees = ajaxGetRequest("/reportdataemployee?status=" + JSON.parse(slctEmployeeStatus.value).id + "&designation=" + JSON.parse(desiTxt.value).id);

    refreshEmployeeReportTable();
}







