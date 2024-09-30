//browser onload event
window.addEventListener('load', () => {

    //mek methanin load krnn form eke withrak nwi table eketh button tiyenonh privilege balal enable/disable wennd oni
    userPrivilege = ajaxGetRequest("/privilage/bymodule/CUSTOMER");

    refreshCustomerTable();

    refershCustomerForm();

});

//create function for refresh table
const refreshCustomerTable = () => {

    //ajax wlin database eke tiyen info table ekt pass krn widiha
    //customer array ekk hdgnnd oni
    customers = ajaxGetRequest("/customer/printall");

    //text --> string, number, date
    //function --> object,array, boolean --> craete function 
    //column count == object count
    //piliwelata dann 
    const displayProperty = [
        { dataType: 'text', propertyName: 'name' },
        { dataType: 'function', propertyName: getGender },
        { dataType: 'text', propertyName: 'address' },
        { dataType: 'text', propertyName: 'mobile' },
        { dataType: 'text', propertyName: 'nic' },
        { dataType: 'function', propertyName: getStatus }
    ];

    //call fillDataIntoTable function (tableId,dataList,displayPropertyArrayName,editFunctionName, deleteFuctionName,PrintFuctionName)
    fillDataIntoTable(tableCustomer, customers, displayProperty, customerFormReFill, deleteCustomer, printCustomer, true, userPrivilege);

    //me ara delete krl tiyen ekk aaye delete krnnd bari wennd hadala tiyenn
    customers.forEach((element, index) => {
        if (userPrivilege.prividelete && element.customerstatus_id.name == "Delete") {
            //table eke body ek allgen, eken table column ek allgen, eketh delete button ek allgnnd oni
            tableCustomer.children[1].children[index].children[7].children[1].disabled = "disabled";
            tableCustomer.children[1].children[index].children[7].children[1].style.cursor = "not-allowed";
        }
    });

    //basicma jquery datatable active krgnn widiha
    $('#tableCustomer').dataTable();
}


const getGender = (ob) => {
    if (ob.gender == 'Female') {
        return '<i class="fas fa-female fa-lg" style="color: #df77be;"></i>';
    } else {
        return '<i class="fas fa-male fa-lg" style="color: #465faa;"></i>';
    }
}

const getStatus = (ob) => {
    if (ob.customerstatus_id.name == 'Available') {
        return '<span class="text-success fw-bold">Available</span>';
    } else {
        return '<span class="text-danger fw-bold">Delete</span>';
    }
}

//define fn ckeckerror
const checkFormError = () => {
    let errors = '';

    if (customer.name == null) {
        errors = errors + "Please Enter Customer Name <br>";
        textName.style.background = 'rgba(255,0,0,0.1)';
    }
    if (customer.nic == null) {
        errors = errors + "Please Enter Valid NIC <br>";
        nicTxt.style.background = 'rgba(255,0,0,0.1)';
    }
    if (customer.mobile == null) {
        errors = errors + "Please Enter Mobile Number <br>";
        mobiTxt.style.background = 'rgba(255,0,0,0.1)';
    }
    if (customer.address == null) {
        errors = errors + "Please Enter Address <br>";
        txtAddress.style.background = 'rgba(255,0,0,0.1)';
    }
    if (customer.customerstatus_id == null) {
        errors = errors + "Please Select Customer Status <br>";
        slctCustomerStatus.style.background = 'rgba(255,0,0,0.1)';
    }
    return errors;
}

const getGenderFromNIC = () => {
    let dayOfYear;
    let nic = nicTxt.value;

    // Handle new NIC format (12 digits)
    if (nic.length === 12) {
        dayOfYear = parseInt(nic.slice(4, 7));
    }
    // Handle old NIC format (9 digits + letter)
    else if (nic.length === 10) {
        dayOfYear = parseInt(nic.slice(2, 5));
    }

    // Determine gender based on dayOfYear
    if (dayOfYear >= 500) {
        slctFemale.checked = true;
        customer.gender=slctFemale.value;
    } else {
        slctMale.checked = true;
        customer.gender=slctMale.value
    }
}

const customerSubmit = () => {
    // check submit button
    console.log("submit");
    console.log(customer);

    // Check form error
    const errors = checkFormError();
    // If no errors
    if (errors == '') {
        // Get user confirmation using SweetAlert2
        Swal.fire({
            title: 'Confirm Addition',
            html: 'Are you sure to SAVE following customer details..? <br>'
                + '<br> Customer name: ' + customer.name
                + '<br> NIC: ' + customer.nic,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, add it!',
            cancelButtonText: 'No, cancel',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                // Call POST service
                let postServerResponce = ajaxHTTPRequest("/customer", "POST", customer);
                // Check post service response
                if (postServerResponce == "OK") {
                    refreshCustomerTable();
                    formCustomer.reset();
                    refershCustomerForm();
                    $('#offcanvasCustomerAdd').offcanvas('hide');

                    Swal.fire({
                        title: 'Success',
                        html: 'Customer added successfully!',
                        icon: 'success'
                    });
                } else {
                    Swal.fire({
                        title: 'Form Error',
                        html: 'Failed to submit Customer. <br>' + postServerResponce,
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

//create function for customer form re-fill
const customerFormReFill = (ob) => {
    console.log('Refill');

    btnCustomerUpdate.disabled = false;

    //JSON. parse() : This method takes a JSON string and then transforms it into a JavaScript object.
    //assign table row object into employee object
    //object ek  string wlt covert kre employee ek update krddi oldEmployee ekath update nowi tiyennd oni nisa
    customer = JSON.parse(JSON.stringify(ob));
    oldCustomer = JSON.parse(JSON.stringify(ob));

    //open employee offcanves
    $('#offcanvasCustomerAdd').offcanvas('show');

    //set value into ui element
    //elementId.value = object.property
    textName.value = customer.name;
    nicTxt.value = customer.nic;
    mobiTxt.value = customer.mobile;
    landTxt.value = customer.land;
    emailTxt.value = customer.email;
    txtAddress.value = customer.address;
    textNote.value = customer.note;

    if (customer.gender == "Male") {
        slctMale.checked = true;
    } else {
        slctFemale.checked = true;
    }

    //fill wela tmi select wenn
    customerStatus = ajaxGetRequest("/customerstatus/list");
    fillDataIntoSelect(slctCustomerStatus, "Select Status..", customerStatus, "name", customer.customerstatus_id.name);

    btnCustomerSubmit.disabled = "disabled";

    if (userPrivilege.priviupdate) {
        btnCustomerUpdate.disabled = "";
    } else {
        btnCustomerUpdate.disabled = "disabled"
    }
}

const checkFormUpdate = () => {
    let updates = "";

    if (customer.name != oldCustomer.name) {
        updates = updates + "Customer name is changed " + oldCustomer.name + " into " + customer.name + "<br>";
    }
    if (customer.mobile != oldCustomer.mobile) {
        updates = updates + "Customer mobile is changed " + oldCustomer.mobile + " into " + customer.mobile + "<br>";
    }
    if (customer.landno != oldCustomer.landno) {
        updates = updates + "Customer land number is changed " + oldCustomer.landno + " into " + customer.landno + "<br>";
    }
    if (customer.address != oldCustomer.address) {
        updates = updates + "Customer address is changed " + oldCustomer.address + " into " + customer.address + "<br>";
    }
    if (customer.email != oldCustomer.email) {
        updates = updates + "Customer email is changed " + oldCustomer.email + " into " + customer.email + "<br>";
    }
    if (customer.nic != oldCustomer.nic) {
        updates = updates + "Customer nic is changed " + oldCustomer.nic + " into " + customer.nic + "<br>";
    }
    if (customer.gender != oldCustomer.gender) {
        updates = updates + "Customer gender is changed " + oldCustomer.gender + " into " + customer.gender + "<br>";
    }
    if (customer.note != oldCustomer.note) {
        updates = updates + "Customer note is changed " + oldCustomer.note + " into " + customer.note + "<br>";
    }
    if (customer.customerstatus_id.name != oldCustomer.customerstatus_id.name) {
        updates = updates + "Customer status is changed " + oldCustomer.customerstatus_id.name + " into " + customer.customerstatus_id.name + "<br>";
    }

    return updates;
}

const customerUpdate = () => {
    //1) check update button
    console.log("update");
    console.log(customer);
    console.log(oldCustomer);

    //2) check form errors
    let errors = checkFormError();
    if (errors == "") {
        //3) check what we have to update
        let updates = checkFormUpdate();
        if (updates == "") {
            Swal.fire({
                icon: 'info',
                html: 'Nothing to Update..!',
                showConfirmButton: true,
            });
        } else {
            //4) get user confirmation
            Swal.fire({
                title: 'Are you sure to UPDATE the following record?',
                html: updates,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, update it!'
            }).then((result) => {
                if (result.isConfirmed) {
                    //5) call put service
                    let putServiceResponse = ajaxHTTPRequest("/customer", "PUT", customer)
                    //6) check put service response
                    if (putServiceResponse == "OK") {
                        Swal.fire({
                            icon: 'success',
                            html: 'Update Successfully',
                            showConfirmButton: true,
                        }).then(() => {
                            refreshCustomerTable();
                            formCustomer.reset();
                            refershCustomerForm();
                            $('#offcanvasCustomerAdd').offcanvas('hide');
                        });
                    } else {
                        Swal.fire({
                            icon: 'error',
                            html: 'Failed to Update Customer Details',
                            text: putServiceResponse,
                            showConfirmButton: true,
                        });
                    }
                }
            });
        }
    } else {
        Swal.fire({
            icon: 'error',
            html: 'Form has some errors... please check the form again..',
            text: errors,
            showConfirmButton: true,
        });
    }
}


const deleteCustomer = (ob) => {
    //1) check delete button 
    console.log("delete");
    //2) get user confirmation
    // Get user confirmation using SweetAlert2
    Swal.fire({
        title: 'Confirm Delete Details',
        html: 'Are you sure to DELETE following Customer details..? <br>'
            + '<br> Customer Name : ' + ob.name
            + '<br> NIC: ' + ob.nic,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            // call delete service
            let deleteserverResponce = ajaxHTTPRequest("/customer", "DELETE", ob);
            // check delete service responce
            if (deleteserverResponce == "OK") {
                refreshCustomerTable();

                Swal.fire({
                    title: 'Success',
                    text: 'Customer Delete Successfully!',
                    icon: 'success'
                });
            } else {
                Swal.fire({
                    title: 'Form Error',
                    text: 'Failed to delete customer \n' + deleteserverResponce,
                    icon: 'error'
                });
            }
        }
    });
}

const printCustomer = (rowOb, rowIndex) => {
    //open view details
    $('#customerViewModal').modal('show');

    viewCusName.innerHTML = rowOb.name;
    viewCusNum.innerHTML = rowOb.cusnumber;
    viewNic.innerHTML = rowOb.nic;
    viewEmail.innerHTML = rowOb.email;
    viewMobile.innerHTML = rowOb.mobile;
    viewLandNum.innerHTML = rowOb.land;
    viewAddDateTime.innerHTML = rowOb.addeddatetime.split("T")[0] + " " + rowOb.addeddatetime.split("T")[1];
    viewAddress.innerHTML = rowOb.address;
    viewNote.innerHTML = rowOb.note;
}

const btnPrintRow = () => {
    console.log("print");
    console.log(customer);

    let newWindow = window.open();
    newWindow.document.write("<html><head>" +
        "<link rel='stylesheet'href='resources/bootstrap-5.3.1-dist/bootstrap-5.3.1-dist/css/bootstrap.min.css'></link>" +
        "<title>" + "Customer Details" + "</title>"
        + "</head><body>" +
        "<h2>" + "Customer Details" + "</h2>" +
        printCustomerTable.outerHTML + "<script>printCustomerTable.classList.remove('d-none');</script></body></html>"
    );

    setTimeout(() => {
        newWindow.stop();//table ek load wena ek nawathinw
        newWindow.print();//table ek print weno
        newWindow.close();//aluthin open una window tab ek close weno
        //ar data load wenn nm  time out ekk oni weno aduma 500k wth
    }, 500)
}

const refershCustomerForm = () => {

    customer = {};
    oldCustomer = null;

    customerStatus = ajaxGetRequest("/customerstatus/list");
    fillDataIntoSelect(slctCustomerStatus, "Select Status...", customerStatus, "name", "Available");

    //"1px solid #ced4da"
    textName.style.border = "1px solid #ced4da";
    nicTxt.style.border = "1px solid #ced4da";
    mobiTxt.style.border = "1px solid #ced4da";
    landTxt.style.border = "1px solid #ced4da";
    emailTxt.style.border = "1px solid #ced4da";
    txtAddress.style.border = "1px solid #ced4da";
    textNote.style.border = "1px solid #ced4da";
    slctCustomerStatus.style.border = "1px solid #ced4da";

    customer.customerstatus_id = JSON.parse(slctCustomerStatus.value);
    slctCustomerStatus.style.border = "1px solid green";
    slctCustomerStatus.disabled = true;

    if (userPrivilege.priviinsert) {
        btnCustomerSubmit.disabled = "";
    } else {
        btnCustomerSubmit.disabled = "disabled"
    }
}
