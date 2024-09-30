window.addEventListener('load', () => {

    //mek methanin load krnn form eke withrak nwi table eketh button tiyenonh privilege balal enable/disable wennd oni
    userPrivilege = ajaxGetRequest("/privilage/bymodule/SERVICE");

    refershServiceTable();

    refershServiceForm();

});

const refershServiceTable = () => {
    //pass the data in db to the table
    services = ajaxGetRequest("/service/printall");

    //text --> string, number, date
    //function --> object,array, boolean --> craete function 
    //column count == object count
    //piliwelata dann 
    const displayProperty = [
        { dataType: 'text', propertyName: 'name' },
        { dataType: 'text', propertyName: 'mobile' },
        { dataType: 'text', propertyName: 'nic' },
        { dataType: 'function', propertyName: getServiceCategory },
        { dataType: 'function', propertyName: getServiceCharge },
        { dataType: 'function', propertyName: getServiceStatus }
    ];

    //call fillDataIntoTable function (tableId,dataList,displayPropertyArrayName,editFunctionName, deleteFuctionName,PrintFuctionName)
    fillDataIntoTable(tableService, services, displayProperty, ServiceFormRefill, deleteService, printService, true, userPrivilege);

    //me ara delete krl tiyen ekk aaye delete krnnd bari wennd hadala tiyenn
    /* employees.forEach((element, index) => {
        if (userPrivilege.prividelete && element.employeestatus_id.name == "Delete") {
            //table eke body ek allgen, eken table column ek allgen, eketh delete button ek allgnnd oni
            tableEmployee.children[1].children[index].children[10].children[1].disabled = "disabled";
            tableEmployee.children[1].children[index].children[10].children[1].style.cursor = "not-allowed";
        }
    }); */
    
    //basicma jquery datatable active krgnn widiha
    $('#tableService').dataTable();
}

const getServiceCharge = (ob) => {
    if (ob.servicecharge) {
        return '<span>Rs.' + ob.servicecharge + '</span>';
    }
}

const getServiceCategory = (ob) => {
    return ob.servicecategory_id.name;
}

const getServiceStatus = (ob) => {
    if (ob.servicestatus_id.name == 'Available') {
        return '<span class="text-success fw-bold">Available</span>'
    } else {
        return '<span class="text-danger fw-bold">Delete</span>';
    }
}

const checkFormError = () => {
    let errors = "";

    if (service.name == null) {
        errors = errors + "Please Enter Name \n";
        textName.style.background = 'rgba(255,0,0,0.1)';
    }
    if (service.mobile == null) {
        errors = errors + "Please Enter Mobile Number\n";
        mobileTxt.style.background = 'rgba(255,0,0,0.1)';
    }
    if (service.nic == null) {
        errors = errors + "Please Enter Nic \n";
        nicTxt.style.background = 'rgba(255,0,0,0.1)';
    }
    if (service.servicecharge == null) {
        errors = errors + "Please Enter Service Charge \n";
        serviceChargeTxt.style.background = 'rgba(255,0,0,0.1)';
    }
    if (service.servicecategory_id == null) {
        errors = errors + "Please select Service Category \n";
        slctServiceCategory.style.background = 'rgba(255,0,0,0.1)';
    }
    if (service.servicestatus_id == null) {
        errors = errors + "Please select Service Status \n";
        slctServiceStatus.style.background = 'rgba(255,0,0,0.1)';
    }
    return errors;
}
const serviceSubmit = () => {
    //1)check the button
    console.log("submit");
    console.log(service);

    //2) check errors
    const errors = checkFormError();
    if (errors == "") {
        //3)get user comfirmation
        let userConfirm = confirm("Are you sure to SAVE following Service details..? \n" +
            "Service Name : " + service.name + "\n" +
            "NIC : " + service.nic);
        if (userConfirm) {
            //4)call post request
            let postServerResponce = ajaxHTTPRequest("/service", "POST", service);
            //5)check post service responce
            if (postServerResponce == "OK") {
                alert("Save Successfully ✔");
                refershServiceTable();
                formService.reset();
                refershServiceForm();
                $('#offcanvasServiceAdd').offcanvas('hide');
            } else {
                alert("Fail to submit Service ❌ \n" + postServerResponce);
            }
        }
    } else {
        alert("The form has following errors... please check the form again..\n" + errors);
    }
}

const ServiceFormRefill = (ob) => {
    console.log('Refill');

    btnServiceUpdate.disabled = false;

    //JSON. parse() : This method takes a JSON string and then transforms it into a JavaScript object.
    //assign table row object into employee object
    //object ek  string wlt covert kre employee ek update krddi oldEmployee ekath update nowi tiyennd oni nisa
    service = JSON.parse(JSON.stringify(ob));
    oldService = JSON.parse(JSON.stringify(ob));

    //open employee offcanves
    $('#offcanvasServiceAdd').offcanvas('show');

    //set value into ui element
    //elementId.value = object.property
    textName.value = service.name;
    nicTxt.value = service.nic;
    mobileTxt.value = service.mobile;
    serviceChargeTxt.value = service.servicecharge;
    textNote.value = service.note;

    //fill wela tmi select wenn
    serviceCategory = ajaxGetRequest("/servicecategory/list");
    fillDataIntoSelect(slctServiceCategory, "Select Category..", serviceCategory, "name", service.servicecategory_id.name);

    serviceStatus = ajaxGetRequest("/servicestatus/list");
    fillDataIntoSelect(slctServiceStatus, "Select Status...", serviceStatus, "name", service.servicestatus_id.name);

    btnServiceSubmit.disabled = "disabled";

    
    if (userPrivilege.priviupdate) {
        btnServiceUpdate.disabled = "";
    } else {
        btnServiceUpdate.disabled = "disabled"
    }
}

const checkFormUpdate = () => {
    let updates = "";

    if (service.name != oldService.name) {
        updates = updates + "Name is changed " + oldService.name + " into " + service.name + "\n";
    }

    if (service.mobile != oldService.mobile) {
        updates = updates + "Mobile is changed " + oldService.mobile + " into " + service.mobile + "\n";
    }

    if (service.nic != oldService.nic) {
        updates = updates + "NIC is changed " + oldService.nic + " into " + service.nic + "\n";
    }

    if (service.servicecharge != oldService.servicecharge) {
        updates = updates + "Service Charge is changed " + oldService.servicecharge + " into " + service.servicecharge + "\n";
    }

    if (service.note != oldService.note) {
        updates = updates + "Note is changed " + oldService.note + " into " + service.note + "\n";
    }

    if (service.servicecategory_id.name != oldService.servicecategory_id.name) {
        updates = updates + "Service Category is changed " + oldService.servicecategory_id.name + " into " + service.servicecategory_id.name + "\n";
    }

    if (service.servicestatus_id.name != oldService.servicestatus_id.name) {
        updates = updates + "Service status is changed " + oldService.servicestatus_id.name + " into " + service.servicestatus_id.name + "\n";
    }
    return updates;
}
const serviceUpdate = () => {
    //1) check update button
    console.log("update");
    console.log(service);
    console.log(oldService);
    //2) check form errors
    let errors = checkFormError();
    if (errors == "") {
        //3) check what we have to update
        let updates = checkFormUpdate();
        if (updates == "") {
            alert("Nothing to Update..!");
        } else {
            //4) get user confirmation
            let userConfirm = confirm("Are you sure to UPDATE following record? \n" + updates);
            if (userConfirm) {
                //5) call put service
                let putServiceResponce = ajaxHTTPRequest("/service", "PUT", service)
                //6) check put service responce
                if (putServiceResponce == "OK") {
                    alert("Update Successfully ✔");
                    refershServiceTable();
                    formService.reset();
                    refershServiceForm();
                    $('#offcanvasServiceAdd').offcanvas('hide');
                } else {
                    alert("Fail to Update Service Details ❌ \n" + putServiceResponce);
                }
            }
        }
    } else {
        alert("Form has some errors... please check the form again..\n" + errors);
    }
}

const deleteService = (ob) => {
    //1)check button 
    console.log("delete");
    //2)get user confirmation
    let userConfirm = confirm("Are you sure to DELETE following Service Details..? \n" +
        "Service Name : " + ob.name + "\n" +
        "NIC : " + ob.nic);
    if (userConfirm) {
        //3)call delete request
        let deleteserverResponce = ajaxHTTPRequest("/service", "DELETE", ob);
        //4)check delete service responce
        if (deleteserverResponce == "OK") {
            alert("Delete Successfully ✔");
            refershServiceTable();
        } else {
            alert("Fail to delete Service ❌ \n" + deleteserverResponce)
        }
    }
}

const printService = (ob) => {
    console.log("print");
    let newWindow = window.open();
    newWindow.document.write(
        "<head>" +
        " <link rel='stylesheet' href='resources/bootstrap-5.3.1-dist/bootstrap-5.3.1-dist/css/bootstrap.min.css'></link>"
        + "</head>" +
        "<body>" + "<table class='table table-primary table-bordered'>" +
        "<thead>" +
        "<tr>" +
        "<th>Service Name</th>" +
        "<th>Mobile Number</th>" +
        "<th>NIC</th>" +
        "<th>Service Category</th>" +
        "<th>Service Charge</th>" +
        "</tr>" +
        "</thead>" +
        "<tbody>" +
        "<tr>" +
        "<td>" + ob.name + "</td>" +
        "<td>" + ob.mobile + "</td>" +
        "<td>" + ob.nic + "</td>" +
        "<td>" + ob.servicecategory_id.name + "</td>" +
        "<td>" + ob.servicecharge + "</td>" +
        "</tbody>" +
        "</table>" +
        "</body>"
    );
    setTimeout(function () {
        newWindow.print()
    }, 500)
}

const refershServiceForm = () => {

    service = new Object();
    oldService = null;

    serviceCategory = ajaxGetRequest("/servicecategory/list");
    fillDataIntoSelect(slctServiceCategory, "Select Category..", serviceCategory, "name");

    serviceStatus = ajaxGetRequest("/servicestatus/list");
    fillDataIntoSelect(slctServiceStatus, "Select Status...", serviceStatus, "name");

    //reset form
    textName.style.border = "1px solid #ced4da";
    nicTxt.style.border = "1px solid #ced4da";
    mobileTxt.style.border = "1px solid #ced4da";
    slctServiceCategory.style.border = "1px solid #ced4da";
    serviceChargeTxt.style.border = "1px solid #ced4da";
    slctServiceStatus.style.border = "1px solid #ced4da";
    textNote.style.border = "1px solid #ced4da";

    if (userPrivilege.priviinsert) {
        btnServiceSubmit.disabled = "";
    } else {
        btnServiceSubmit.disabled = "disabled"
    }
}