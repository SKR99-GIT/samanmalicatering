//browser onload event
window.addEventListener('load', () => {

    //mek methanin load krnn form eke withrak nwi table eketh button tiyenonh privilege balal enable/disable wennd oni
    userPrivilege = ajaxGetRequest("/privilage/bymodule/EMPLOYEE");

    refreshEmployeeTable();

    refreshEmployeeForm();

});


//create function for refresh table
const refreshEmployeeTable = () => {

    //ajax wlin database eke tiyen info table ekt pass krn widiha
    //employee array ekk hdgnnd oni
    employees = ajaxGetRequest("/employee/printall");

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
    fillDataIntoTable(tableEmployee, employees, displayProperty, employeeFormReFill, deleteEmpolyee, printEmployee, true, userPrivilege);

    //me ara delete krl tiyen ekk aaye delete krnnd bari wennd hadala tiyenn
    employees.forEach((element, index) => {
        if (userPrivilege.prividelete && element.employeestatus_id.name == "Delete") {
            //table eke body ek allgen, eken table column ek allgen, eketh delete button ek allgnnd oni
            tableEmployee.children[1].children[index].children[10].children[1].disabled = "disabled";
            tableEmployee.children[1].children[index].children[10].children[1].style.cursor = "not-allowed";
        }
    });

    //basicma jquery datatable active krgnn widiha
    $('#tableEmployee').dataTable();
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

//for what...........................................................................?????????????????????????????????????????????????????
function add(params) {

    //call table refersh function
    refreshEmployeeTable();
}

//define fn ckeckerror
const checkFormError = () => {

    console.log("employee obj", employee);

    let errors = '';

    if (employee.fullname == null) {
        errors = errors + 'Please Enter Employee Name <br>';
        textName.style.background = 'rgba(255,0,0,0.1)';
    }
    if (employee.callingname == null) {
        errors = errors + "Please Set Calling Name <br>";
        callingNameTxt.style.background = 'rgba(255,0,0,0.1)';
    }
    if (employee.nic == null) {
        errors = errors + "Please enter valid NIC <br>";
        nicTxt.style.background = 'rgba(255,0,0,0.1)';
    }
    if (employee.mobile == null) {
        errors = errors + "Please enter Mobile Number <br>";
        mobiTxt.style.background = 'rgba(255,0,0,0.1)';
    }
    if (employee.email == null) {
        errors = errors + "Please enter Email <br>";
        emailTxt.style.background = 'rgba(255,0,0,0.1)';
    }
    if (employee.employeestatus_id == null) {
        errors = errors + "Please select employee status <br>";
        slctEmployeeStatus.style.background = 'rgba(255,0,0,0.1)';
    }
    if (employee.designation_id == null) {
        errors = errors + "Please select your designation <br>";
        desiTxt.style.background = 'rgba(255,0,0,0.1)';
    }

    /*  meka waradi
      if (employee.propertyName==null){
      errors = errors + "full name cant be empty \n";
     } */

    return errors;
}

const employeeSubmit = () => {
    console.log("button submit");
    console.log(employee);

    // Check form error
    const errors = checkFormError();

    // If no errors
    if (errors == '') {
        // Get user confirmation using SweetAlert2
        Swal.fire({
            title: 'Confirm Addition',
            html: 'Are you sure to ADD the following Employee? <br>'
                + '<br> Name: ' + employee.callingname
                + '<br> NIC: ' + employee.nic,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, add it!',
            cancelButtonText: 'No, cancel',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                // Call POST service
                let postServiceRequestResponce = ajaxHTTPRequest("/employee", "POST", employee);
                // Check post service response
                if (postServiceRequestResponce == "OK") {
                    refreshEmployeeTable();
                    formEmployee.reset();
                    refreshEmployeeForm();
                    $('#offcanvasEmployeeAdd').offcanvas('hide');

                    Swal.fire({
                        title: 'Success',
                        html: 'Employee added successfully!',
                        icon: 'success'
                    });
                } else {
                    Swal.fire({
                        title: 'Form Error',
                        html: 'Failed to submit Employee. <br>' + postServiceRequestResponce,
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


//create function for employee form re-fill
const employeeFormReFill = (ob, rowIndex) => {
    console.log('ReFill');

    //disable krl tibba update button ek enable krno
    btnEmployeeUpdate.disabled = false;

    //JSON. parse() : This method takes a JSON string and then transforms it into a JavaScript object.
    //assign table row object into employee object
    //object ek  string wlt covert kre employee ek update krddi oldEmployee ekath update nowi tiyennd oni nisa
    employee = JSON.parse(JSON.stringify(ob));
    oldEmployee = JSON.parse(JSON.stringify(ob));

    //open employee offcanves
    $('#offcanvasEmployeeAdd').offcanvas('show');

    //set value into ui element
    //elementId.value = object.property
    textName.value = employee.fullname;
    callingNameTxt.value = employee.callingname;
    nicTxt.value = employee.nic;
    hbdTxt.value = employee.dob;
    mobiTxt.value = employee.mobile;
    landTxt.value = employee.landno;
    emailTxt.value = employee.email;
    txtAddress.value = employee.address;
    textNote.value = employee.note;
    slctCivilStatus.value = employee.civilstatus;

    if (employee.employee_photo != null) {
        imgEmpPhoto.src = atob(employee.employee_photo);
    } else {
        imgEmpPhoto.src = "/resources/images/user.png";
    }

    if (employee.gender == "Male") {
        slctMale.checked = true;
    } else {
        slctFemale.checked = true;
    }

    //fill wela tmi select wenn

    designations = ajaxGetRequest("/designation/list");
    fillDataIntoSelect(desiTxt, 'Select Desiganation..', designations, 'name', ob.designation_id.name);

    employeeStatuses = ajaxGetRequest("/employeestatus/list");
    fillDataIntoSelect(slctEmployeeStatus, 'Select Status...', employeeStatuses, 'name', ob.employeestatus_id.name);

    btnEmployeeAdd.disabled = "disabled"

    if (userPrivilege.priviupdate) {
        btnEmployeeUpdate.disabled = "";
    } else {
        btnEmployeeUpdate.disabled = "disabled"
    }
}

//create function for check form updates
const checkFormUpdate = () => {
    let updates = "";

    if (employee.fullname != oldEmployee.fullname) {
        updates = updates + "Employee fullname is changed " + oldEmployee.fullname + " into " + employee.fullname + "\n";
    }

    if (employee.callingname != oldEmployee.callingname) {
        updates = updates + "Employee callingname is changed " + oldEmployee.callingname + " into " + employee.callingname + "\n";
    }

    if (employee.nic != oldEmployee.nic) {
        updates = updates + "Employee nic is changed " + oldEmployee.nic + " into " + employee.nic + "\n";
    }

    if (employee.gender != oldEmployee.gender) {
        updates = updates + "Employee gender is changed " + oldEmployee.gender + " into " + employee.gender + "\n";
    }

    if (employee.dob != oldEmployee.dob) {
        updates = updates + "Employee Date of Birth is changed " + oldEmployee.dob + " into " + employee.dob + "\n";
    }

    if (employee.email != oldEmployee.email) {
        updates = updates + "Employee email is changed " + oldEmployee.email + " into " + employee.email + "\n";
    }

    if (employee.mobile != oldEmployee.mobile) {
        updates = updates + "Employee mobile is changed " + oldEmployee.mobile + " into " + employee.mobile + "\n";
    }

    if (employee.landno != oldEmployee.landno) {
        updates = updates + "Employee land number is changed " + oldEmployee.landno + " into " + employee.landno + "\n";
    }

    if (employee.address != oldEmployee.address) {
        updates = updates + "Employee address is changed " + oldEmployee.address + " into " + employee.address + "\n";
    }

    if (employee.note != oldEmployee.note) {
        updates = updates + "Employee note is changed " + oldEmployee.note + " into " + employee.note + "\n";
    }

    if (employee.civilstatus != oldEmployee.civilstatus) {
        updates = updates + "Employee civil status is changed " + oldEmployee.civilstatus + " into " + employee.civilstatus + "\n";
    }

    if (employee.designation_id.name != oldEmployee.designation_id.name) {
        updates = updates + "Employee Designation is changed " + oldEmployee.designation_id.name + " into " + employee.designation_id.name + "\n";
    }

    if (employee.employeestatus_id.name != oldEmployee.employeestatus_id.name) {
        updates = updates + "Employee Employee status is changed " + oldEmployee.employeestatus_id.name + " into " + employee.employeestatus_id.name + "\n";
    }


    return updates;
}

//define fn for update button
const employeeUpdate = () => {
    console.log("Update");
    console.log(employee);
    console.log(oldEmployee);

    //check errors
    let errors = checkFormError();
    if (errors == "") {
        //if form have no any errors, check available update 
        let updates = checkFormUpdate();
        //if form dont have any updates
        if (updates == "") {
            alert("Nothing Updated..!");
        } else {
            //get user confirmation
            let userConfirm = confirm("Are you sure to update following record? \n" + updates);

            if (userConfirm) {
                //if user click yes, call put service for update
                let putServiceResponce = ajaxHTTPRequest("/employee", "PUT", employee);
                //check put service responce
                if (putServiceResponce == "OK") {
                    alert("Update Successfully!");
                    $('#offcanvasEmployeeAdd').offcanvas('hide');
                    refreshEmployeeTable();
                    formEmployee.reset();
                    refreshEmployeeForm();
                } else {
                    alert("Fail to Update Customer Details ❌ \n" + putServiceResponce);
                }
            }
        }
    } else {
        alert("Form has some errors... please check the form again..\n" + errors);
    }
}

//create function for delete employee record
const deleteEmpolyee = (ob) => {
    //1)check delete button
    console.log("delete");
    //2)get user confirmation
    let userConfirm = confirm("Are you sure to delete following employee details..? \n" +
        "Employee Name : " + ob.name + "\n" +
        "NIC : " + ob.nic);
    if (userConfirm) {
        //3)call delete service
        let deleteserverResponce = ajaxHTTPRequest("/employee", "DELETE", ob);
        //4)check delete service responce
        if (deleteserverResponce == "OK") {
            alert("Delete Successfully ✔");
            refreshEmployeeTable();
        } else {
            alert("Fail to Delete Customer Details ❌  \n" + deleteserverResponce);
        }
    }
}

//create function for row print employee record
const printEmployee = (rowOb, rowIndex) => {

    //open view details
    $('#employeeViewModal').modal('show');

    viewFullName.innerHTML = rowOb.fullname;
    viewEmpNum.innerHTML = rowOb.empnumber;
    viewNic.innerHTML = rowOb.nic;
    viewEmail.innerHTML = rowOb.email;
    viewMobile.innerHTML = rowOb.mobile;
    viewLandNum.innerHTML = rowOb.landno;
    viewDOB.innerHTML = rowOb.dob;
    viewAddress.innerHTML = rowOb.address;
    viewNote.innerHTML = rowOb.note;

}

const btnPrintRow = () => {
    console.log("print");
    console.log(employee);

    let newWindow = window.open();
    newWindow.document.write("<html><head>" +
        "<link rel='stylesheet' href='resources/bootstrap-5.3.1-dist/bootstrap-5.3.1-dist/css/bootstrap.min.css'></link>" +
        "<title>" + "Employee Details" + "</title>"
        + "</head><body>" +
        "<h2>" + "Employee Details" + "</h2>" +
        printEmployeeTable.outerHTML + "<script>printEmployeeTable.classList.remove('d-none');</script></body></html>"
    );

    setTimeout(() => {
        newWindow.stop();//table ek load wena ek nawathinw
        newWindow.print();//table ek print weno
        newWindow.close();//aluthin open una window tab ek close weno
        //ar data load wenn nm  time out ekk oni weno aduma 500k wth
    }, 500)
}

const refreshEmployeeForm = () => {

    employee = new Object();

    designations = ajaxGetRequest("/designation/list");
    fillDataIntoSelect(desiTxt, 'Select Desiganation...', designations, 'name');

    employeeStatuses = ajaxGetRequest("/employeestatus/list");
    fillDataIntoSelect(slctEmployeeStatus, 'Select Status..', employeeStatuses, 'name');


    //textName.classList.remove("is-valid"); 
    //textName.className = "form-select";//bootstrap 
    textName.style.border = "1px solid #ced4da";
    callingNameTxt.style.border = "1px solid #ced4da";
    nicTxt.style.border = "1px solid #ced4da";
    hbdTxt.style.border = "1px solid #ced4da";
    mobiTxt.style.border = "1px solid #ced4da";
    landTxt.style.border = "1px solid #ced4da";
    emailTxt.style.border = "1px solid #ced4da";
    txtAddress.style.border = "1px solid #ced4da";
    textNote.style.border = "1px solid #ced4da";
    desiTxt.style.border = "1px solid #ced4da";
    slctCivilStatus.style.border = "1px solid #ced4da";
    slctEmployeeStatus.style.border = "1px solid #ced4da";

    imgEmpPhoto.src = "/resources/images/user.png";
    fileEmpPhoto.files = null;

    if (userPrivilege.priviinsert) {
        btnEmployeeAdd.disabled = "";
    } else {
        btnEmployeeAdd.disabled = "disabled"
    }

}

const buttonImgClear = () => {
    if (employee.employee_photo != null) {
        let userConfirm = confirm("Are You Sure to Clear Image?");
        if (userConfirm) {
            employee.employee_photo = null;
            employee.employee_photo_name = null;
            imgEmpPhoto.src = "/resources/images/user.png";
            fileEmpPhoto.files = null;
        }
    }
}







