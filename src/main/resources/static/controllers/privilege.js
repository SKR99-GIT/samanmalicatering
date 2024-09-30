//define browser onload function
window.addEventListener('load', () => {

    //mek methanin load krnn form eke withrak nwi table eketh button tiyenonh privilege balal enable/disable wennd oni
    userPrivilege = ajaxGetRequest("/privilage/bymodule/PRIVILEGE");

    //call table referesh function
    refershPrivilegeTable();

    //form refersh function
    refershPrivilegeForm();

});

//create checkbox validator function 
const checkPrivi = (feildId, pattern, object, property, trueValue, falseValue,
    labelId, labelTrueValue, labelFalseValue) => {

    if (feildId.checked) {
        window[object][property] = trueValue;
        labelId.innerHTML = labelTrueValue;
    } else {
        window[object][property] = falseValue;
        labelId.innerHTML = labelFalseValue;
    }
}

//define table refersh function
const refershPrivilegeTable = () => {

    //data array 
    privileges = ajaxGetRequest("/privilege/printall");

    ///property list
    const displayPropertyList = [
        { dataType: "function", propertyName: getRole },
        { dataType: "function", propertyName: getModule },
        { dataType: "function", propertyName: getSelect },
        { dataType: "function", propertyName: getInsert },
        { dataType: "function", propertyName: getUpdate },
        { dataType: "function", propertyName: getDelete },
    ]

    //call fill data into function
    fillDataIntoTable(tablePrivilege, privileges, displayPropertyList, refillPrivilege, deletePrivilege, printPrivilege, true, userPrivilege);

    //me ara delete krl tiyen ekk aaye delete krnnd bari wennd hadala tiyenn
   /*  employees.forEach((element, index) => {
        if (userPrivilege.prividelete && element.employeestatus_id.name == "Delete") {
            //table eke body ek allgen, eken table column ek allgen, eketh delete button ek allgnnd oni
            tableEmployee.children[1].children[index].children[10].children[1].disabled = "disabled";
            tableEmployee.children[1].children[index].children[10].children[1].style.cursor = "not-allowed";
        }
    }); */

        //basicma jquery datatable active krgnn widiha
        $('#tablePrivilege').dataTable();
}

const getRole = (ob) => {
    return ob.role_id.name;
}

const getModule = (ob) => {
    return ob.module_id.name;
}

const getSelect = (ob) => {
    if (ob.priviselect) {
        return '<span class="text-success">Granted</span>'
    } else {
        return '<span class="text-danger">Not-Granted</span>'
    }
}
const getInsert = (ob) => {
    if (ob.priviinsert) {
        return '<span class="text-success">Granted </span>'
    } else {
        return '<span class="text-danger">Not-Granted</span>'
    }
}
const getUpdate = (ob) => {
    if (ob.priviupdate) {
        return '<span class="text-success">Granted </span>'
    } else {
        return '<span class="text-danger">Not-Granted</span>'
    }
}
const getDelete = (ob) => {
    if (ob.prividelete) {
        return '<span class="text-success">Granted </span>'
    } else {
        return '<span class="text-danger">Not-Granted</span>'
    }
}

//define function for filter module list by given role id
const generateModuleList = () => {
    modulesByRole = ajaxGetRequest("/module/listbyrole?roleid=" + JSON.parse(slctRole.value).id);
    fillDataIntoSelect(slctModule, 'Please Select Module...', modulesByRole, 'name');
    slctModule.disabled = false;
}

const refershPrivilegeForm = () => {

    //checkPrivi();
    privilege = new Object;

    //get data list for select element
    roles = ajaxGetRequest("/role/list");
    fillDataIntoSelect(slctRole, 'Please Select Role..', roles, 'name');
    slctRole.disabled = false;

    modules = ajaxGetRequest("/module/list");
    fillDataIntoSelect(slctModule, 'Please Select Module..', modules, 'name');
    slctModule.disabled = true;

    slctRole.style.border = "1px solid #ced4da"
    slctModule.style.border = "1px solid #ced4da"

    privilege.priviselect = false;
    privilege.priviinsert = false;
    privilege.priviupdate = false;
    privilege.prividelete = false;

    labelSelectPrivi.innerText = 'Not-Granted';
    labelInsertPrivi.innerText = 'Not-Granted';
    labelUpdatePrivi.innerText = 'Not-Granted';
    labelDeletePrivi.innerText = 'Not-Granted';

    if (userPrivilege.priviinsert) {
        btnPriviAdd.disabled = "";
    } else {
        btnPriviAdd.disabled = "disabled"
    }
}

//define fn ckeckerror
const checkFormError = () => {

    let errors = '';

    if (privilege.role_id == null) {
        errors = errors + "Please select MODULE \n";
    }
    if (privilege.module_id == null) {
        errors = errors + "Please select ROLE \n";
    }
    if (privilege.priviselect == null) {
        errors = errors + "Please select 'SELECT' privilege  \n";
    }
    if (privilege.priviinsert == null) {
        errors = errors + "Please select 'INSERT' privilege  \n";
    }
    if (privilege.priviupdate == null) {
        errors = errors + "Please select 'UPDATE' privilege \n";
    }
    if (privilege.prividelete == null) {
        errors = errors + "Please select 'DELETE' privilege  \n";
    }

    return errors;
}

const privilegeSubmit = () => {
    //1) button ek wadad balannd
    console.log("submit");
    console.log(privilege);
    //2) check form error 
    const errors = checkFormError();
    if (errors == '') {

        //3) if error not available, get user confirmation
        const userConfirm = confirm('Are you sure to ADD following Privilege Record..? \n'
            + '\n Role is ' + privilege.role_id.name
            + '\n Module is ' + privilege.module_id.name);
        if (userConfirm) {
            //4) call POST service
            let serverResponce = ajaxHTTPRequest("/privilege", "POST", privilege)
            //5) check post service responce
            if (serverResponce == "OK") {
                alert("Save Successfully ✔");
                refershPrivilegeTable();
                formPrivilege.reset();
                refershPrivilegeForm();
                $('#offcanvasPeivilegeForm').offcanvas('hide');
            } else {
                alert("Fail to submit ❌ \n" + serverResponce);
            }
        }
    } else {
        alert("The form has following errors... please check the form again..\n" + errors);
    }
}

const refillPrivilege = (rowOb, rowInd) => {
    console.log("refill");

    //disable krl tibba update button ek enable krno
    btnPriviUpdate.disabled = false;

    //open user form
    $('#offcanvasPeivilegeForm').offcanvas('show');

    privilege = JSON.parse(JSON.stringify(rowOb));
    oldPrivilege = JSON.parse(JSON.stringify(rowOb));

    roles = ajaxGetRequest("/role/list");
    fillDataIntoSelect(slctRole, 'Please Select Role', roles, 'name', privilege.role_id.name);
    slctRole.disabled = true;

    modules = ajaxGetRequest("/module/list");
    fillDataIntoSelect(slctModule, 'Please Select Module', modules, 'name', privilege.module_id.name);
    slctModule.disabled = true;

    if (privilege.priviselect) {
        selectPrivi.checked = true;
        labelSelectPrivi.innerText = 'Granted';
    } else {
        selectPrivi.checked = false;
        labelSelectPrivi.innerText = 'Not-Granted';
    }

    if (privilege.priviinsert) {
        insertPrivi.checked = true;
        labelInsertPrivi.innerText = 'Granted';
    } else {
        insertPrivi.checked = false;
        labelInsertPrivi.innerText = 'Not-Granted';
    }

    if (privilege.priviupdate) {
        updatePrivi.checked = true;
        labelUpdatePrivi.innerText = 'Granted';
    } else {
        updatePrivi.checked = false;
        labelUpdatePrivi.innerText = 'Not-Granted';
    }

    if (privilege.prividelete) {
        deletePrivi.checked = true;
        labelDeletePrivi.innerText = 'Granted';
    } else {
        deletePrivi.checked = false;
        labelDeletePrivi.innerText = 'Not-Granted';
    }

    if (userPrivilege.priviupdate) {
        btnPriviUpdate.disabled = "";
    } else {
        btnPriviUpdate.disabled = "disabled"
    }
}

//create function for check form updates
const checkFormUpdate = () => {
    let updates = "";

    if (privilege.role_id.name != oldPrivilege.role_id.name) {
        updates = updates + "ROLE is change \n";
    }

    if (privilege.module_id.name != oldPrivilege.module_id.name) {
        updates = updates + "MODULE is change \n";
    }

    if (privilege.priviselect != oldPrivilege.priviselect) {
        updates = updates + "SELECT privilege is changed \n";
    }

    if (privilege.priviinsert != oldPrivilege.priviinsert) {
        updates = updates + "INSERT privilege is changed \n";
    }

    if (privilege.priviupdate != oldPrivilege.priviupdate) {
        updates = updates + "UPDATE privilege is changed \n";
    }

    if (privilege.prividelete != oldPrivilege.prividelete) {
        updates = updates + "DELETE privilege is changed \n";
    }

    return updates;
}
//define function  for update button
const privilegeUpdate = () => {
    //1) check if update button working correctly
    console.log("Update");
    console.log(privilege);
    console.log(oldPrivilege);
    //2) check errors
    let errors = checkFormError();
    if (errors == "") {
        //3) check available update 
        let updates = checkFormUpdate();
        if (updates == "") {
            alert("Nothing to Update..!");
        } else {
            //4) get user confirmation
            let userConfirm = confirm("Are you sure to update following record? \n" + updates);
            if (userConfirm) {
                //5) call put service
                let putServiceResponce = ajaxHTTPRequest("/privilege", "PUT", privilege);
                //check put service response 
                if (putServiceResponce == "OK") {
                    alert("Update Successfully ✔");
                    refershPrivilegeTable();
                    formPrivilege.reset();
                    refershPrivilegeForm();
                    $('#offcanvasPeivilegeForm').offcanvas('hide');
                } else {
                    alert("Fail to update User ❌ \n" + putServiceResponce);
                }
            }
        }
    } else {
        alert("Form has some errors... please check the form again..\n" + errors);
    }

}

//define function for delete privilege
const deletePrivilege = (ob, rowind) => {
    //1) check button 
    console.log("delete");
    //2) get user confirmation 
    const userResponce = confirm("Are you sure to DELETE following privilege record..? \n" +
        "Role : " + ob.role_id.name +
        "\n Module : " + ob.module_id.name);
    if (userResponce) {
        //3) call DELETE request
        //                                            (url   ,      method  ,  object)
        let serverResponce = ajaxHTTPRequest("/privilege", "DELETE", ob);
        if (serverResponce == "OK") {
            alert("Delete Successfully ✔");
            refershPrivilegeTable();
        } else {
            alert("Fail to delete User ❌ \n" + deleteserverResponce)
        }
    }
}

const printPrivilege = (ob, rowIndex) => {
    console.log("print");
    let newWindow = window.open();
    newWindow.document.write(
        "<head>" +
        " <link rel='stylesheet' href='resources/bootstrap-5.3.1-dist/bootstrap-5.3.1-dist/css/bootstrap.min.css'></link>"
        + "</head>" +
        "<body>" + "<table class='table table-primary table-bordered'>" +
        "<thead>" +
        "<tr>" +
        "<th>Role</th>" +
        "<th>Module</th>" +
        "<th>Select Privilege</th>" +
        "<th>Insert Privilege</th>" +
        "<th>Update Privilege</th>" +
        "<th>Delete Privilege</th>" +
        "</tr>" +
        "</thead>" +
        "<tbody>" +
        "<tr>" +
        "<td>" + ob.role_id.name + "</td>" +
        "<td>" + ob.module_id.name + "</td>" +
        "<td>" + ob.priviselect + "</td>" +
        "<td>" + ob.priviinsert + "</td>" +
        "<td>" + ob.priviupdate + "</td>" +
        "<td>" + ob.prividelete + "</td>" +
        "</tbody>" +
        "</table>" +
        "</body>"
    );
    setTimeout(function () {
        newWindow.print()
    }, 500)
}



