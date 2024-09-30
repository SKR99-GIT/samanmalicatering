window.addEventListener('load', () => {

    //mek methanin load krnn form eke withrak nwi table eketh button tiyenonh privilege balal enable/disable wennd oni
    userPrivilege = ajaxGetRequest("/privilage/bymodule/SUPPLIER");

    refreshSupplierTable();
    refreshSupplierForm();
});

const refreshSupplierTable = () => {

    //pass the data in db to the table 
    suppliers = ajaxGetRequest("/supplier/printall");

    //text --> string, number, date
    //function --> object,array, boolean --> craete function 
    //column count == object count
    //piliwelata dann 
    const displayProperty = [
        { dataType: 'text', propertyName: 'name' },
        { dataType: 'text', propertyName: 'mobile' },
        { dataType: 'text', propertyName: 'contactpersonename' },
        { dataType: 'text', propertyName: 'email' },
        { dataType: 'function', propertyName: getSelectedIngrediants },
        { dataType: 'text', propertyName: 'address' },
        { dataType: 'function', propertyName: getSupplierStatus }
    ];

    //call fillDataIntoTable function (tableId,dataList,displayPropertyArrayName,editFunctionName, deleteFuctionName,PrintFuctionName)
    fillDataIntoTable(tableSupplier, suppliers, displayProperty, refillSupplierForm, deleteSupplier, printSupplier, true, userPrivilege);

    //me ara delete krl tiyen ekk aaye delete krnnd bari wennd hadala tiyenn
    suppliers.forEach((element, index) => {
        if (userPrivilege.prividelete && element.supplierstatus_id.name == "Inactive") {
            //table eke body ek allgen, eken table column ek allgen, eketh delete button ek allgnnd oni
            tableSupplier.children[1].children[index].children[8].children[1].disabled = "disabled";
            tableSupplier.children[1].children[index].children[8].children[1].style.cursor = "not-allowed";
        }
    });

    //basicma jquery datatable active krgnn widiha
    $('#tableSupplier').dataTable();

}
const getSelectedIngrediants = (ob) => {
    let ingredients = "";
    for (const index in ob.ingredients) {
        if (index == ob.ingredients.length - 1) {
            ingredients = ingredients + ob.ingredients[index].name;
        } else {
            ingredients = ingredients + ob.ingredients[index].name + ", ";
        }
    }
    return ingredients;
}

const getSupplierStatus = (ob) => {
    if (ob.supplierstatus_id.name == 'Active') {
        return '<span class="text-success fw-bold">Active</span>'
    } else {
        return '<span class="text-danger fw-bold">Inactive</span>';
    }
}

const checkFormError = () => {
    let errors = "";

    if (supplier.name == null) {
        errors = errors + "Please Enter Supplier Name <br>";
        textName.style.background = 'rgba(255,0,0,0.1)';
    }
    if (supplier.mobile == null) {
        errors = errors + "Please Enter Supplier Mobile <br>";
        personNameTxt.style.background = 'rgba(255,0,0,0.1)';
    }
    if (supplier.address == null) {
        errors = errors + "Please Enter Supplier Address <br>";
        mobiTxt.style.background = 'rgba(255,0,0,0.1)';
    }
    if (supplier.contactpersonename == null) {
        errors = errors + "Please Enter Contact Person Name <br>";
        emailTxt.style.background = 'rgba(255,0,0,0.1)';
    }
    if (supplier.email == null) {
        errors = errors + "Please Enter Email <br>";
        txtAddress.style.background = 'rgba(255,0,0,0.1)';
    }
    if (supplier.supplierstatus_id == null) {
        errors = errors + "Please Select supplier Status <br>";
        slctSupplierStatus.style.background = 'rgba(255,0,0,0.1)';
    }
    if (supplier.ingredients.length == 0) {
        errors = errors + "Please Select Ingredients <br>";
        slctIngrediant.style.background = 'rgba(255,0,0,0.1)';
    }
    return errors;
}

const supplierSubmit = () => {
    //1)check button 
    console.log("submit");

    //2)check errors 
    const errors = checkFormError();
    if (errors == "") {
        // Get user confirmation using SweetAlert2
        Swal.fire({
            title: 'Confirm Addition',
            html: 'Are you sure to Save following Supplier Details..? <br>'
                + '<br> Supplier Name : ' + supplier.name
                + '<br> Contact Person Name : ' + supplier.contactpersonename
                + '<br> Mobile Number : ' + supplier.mobile,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, add it!',
            cancelButtonText: 'No, cancel',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                // Call POST service
                let postServerResponce = ajaxHTTPRequest("/supplier", "POST", supplier);
                // Check post service response
                if (postServerResponce == "OK") {
                    refreshSupplierTable();
                    formSupplier.reset();
                    refreshSupplierForm();
                    $('#offcanvasSupplierAdd').offcanvas('hide');

                    Swal.fire({
                        title: 'Success',
                        html: 'Supplier added successfully!',
                        icon: 'success'
                    });
                } else {
                    Swal.fire({
                        title: 'Form Error',
                        html: 'Failed to submit Supplier. <br>' + postServerResponce,
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

const refillSupplierForm = (ob) => {
    //1)check button 
    console.log("refill");

    //disabled krl tibba update button ek enable krno
    btnSupplierUpdate.disabled = false;

    //define menu n oldmenu objects
    //JSON. parse() : This method takes a JSON string and then transforms it into a JavaScript object.
    //assign table row object into hall object
    //object ek  string wlt covert kre hall ek update krddi oldHall ekath update nowi tiyennd oni nisa
    supplier = JSON.parse(JSON.stringify(ob));
    oldSupplier = JSON.parse(JSON.stringify(ob));

    //open menu form
    $('#offcanvasSupplierAdd').offcanvas('show');

    //get ingredients list for refill ingredients
    fillDataIntoSelect(slctIngrediant, "", supplier.ingredients, "name")

    //set value into ui element
    //elementId.value = object.property
    textName.value = supplier.name;
    personNameTxt.value = supplier.contactpersonename;
    mobiTxt.value = supplier.mobile;
    emailTxt.value = supplier.email
    landTxt.value = supplier.landnumber;
    txtAddress.value = supplier.address;
    brnTxt.value = supplier.brn;
    textNote.value = supplier.note;

    //fill wela tmi select wenn
    supplierStatus = ajaxGetRequest("/supplierstatus/list");
    fillDataIntoSelect(slctSupplierStatus, "Select Status", supplierStatus, "name", ob.supplierstatus_id.name);

    btnSupplierSubmit.disabled = "disabled";

    if (userPrivilege.priviupdate) {
        btnSupplierUpdate.disabled = "";
    } else {
        btnSupplierUpdate.disabled = "disabled"
    }
}

const checkFormUpdate = () => {
    let updates = "";

    if (supplier.name != oldSupplier.name) {
        updates = updates + "Supplier name is changed " + oldSupplier.name + " into " + supplier.name + "<br>";
    }
    if (supplier.contactpersonename != oldSupplier.contactpersonename) {
        updates = updates + "Supplier name is changed " + oldSupplier.contactpersonename + " into " + supplier.contactpersonename + "<br>";
    }
    if (supplier.mobile != oldSupplier.mobile) {
        updates = updates + "Supplier name is changed " + oldSupplier.mobile + " into " + supplier.mobile + "<br>";
    }
    if (supplier.email != oldSupplier.email) {
        updates = updates + "Supplier name is changed " + oldSupplier.email + " into " + supplier.email + "<br>";
    }
    if (supplier.landnumber != oldSupplier.landnumber) {
        updates = updates + "Supplier name is changed " + oldSupplier.landnumber + " into " + supplier.landnumber + "<br>";
    }
    if (supplier.address != oldSupplier.address) {
        updates = updates + "Supplier name is changed " + oldSupplier.address + " into " + supplier.address + "<br>";
    }
    if (supplier.brn != oldSupplier.brn) {
        updates = updates + "Supplier name is changed " + oldSupplier.brn + " into " + supplier.brn + "<br>";
    }
    if (supplier.note != oldSupplier.note) {
        updates = updates + "Supplier name is changed " + oldSupplier.note + " into " + supplier.note + "<br>";
    }
    if (supplier.supplierstatus_id.name != oldSupplier.supplierstatus_id.name) {
        updates = updates + "Supplier Status is changed " + oldSupplier.supplierstatus_id.name + " into " + supplier.supplierstatus_id.name + "<br>";
    }
    if (supplier.ingredients.length != oldSupplier.ingredients.length) {
        updates = updates + "Ingredients Changed";
    }
    return updates;
}

const supplierUpdate = () => {
    //1) check update button 
    console.log("update");
    console.log(supplier);
    console.log(oldSupplier);
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
                    let putServiceResponse = ajaxHTTPRequest("/supplier", "PUT", supplier)
                    //6) check put service response
                    if (putServiceResponse == "OK") {
                        Swal.fire({
                            icon: 'success',
                            html: 'Update Successfully',
                            showConfirmButton: true,
                        }).then(() => {
                            refreshSupplierTable();
                            formSupplier.reset();
                            refreshSupplierForm();
                            $('#offcanvasSupplierAdd').offcanvas('hide');
                        });
                    } else {
                        Swal.fire({
                            icon: 'error',
                            html: 'Failed to Update Supplier Details',
                            text: putServiceResponse,
                            showConfirmButton: true,
                        });
                    }
                }
            });
        }
    } else {
        alert("Form has some errors... please check the form again..<br>" + errors);
    }
}

const deleteSupplier = (ob) => {
    //1)check the button 
    console.log("delete");
    //2)get user confirmation
    // Get user confirmation using SweetAlert2
    Swal.fire({
        title: 'Confirm Delete Details',
        html: 'Are you sure to DELETE following Supplier Details..? <br>'
            + '<br> Supplier Name : ' + ob.name
            + '<br> Spplier Number : ' + ob.supnumber,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            // call delete service
            let deleteserverResponce = ajaxHTTPRequest("/supplier", "DELETE", ob);
            // check delete service responce
            if (deleteserverResponce == "OK") {
                refreshSupplierTable();

                Swal.fire({
                    title: 'Success',
                    text: 'Supplier Delete Successfully!',
                    icon: 'success'
                });
            } else {
                Swal.fire({
                    title: 'Form Error',
                    text: 'Failed to delete Supplier \n' + deleteserverResponce,
                    icon: 'error'
                });
            }
        }
    });
}

const printSupplier = (rowOb, rowIndex) => {

    //open ti view details
    $('#supplierViewModal').modal('show');

    viewSupName.innerHTML = rowOb.name;
    viewContactPerson.innerHTML = rowOb.contactpersonename;
    viewMobile.innerHTML = rowOb.mobile;
    viewEmail.innerHTML = rowOb.email;
    viewLand.innerHTML = rowOb.landnumber;
    viewAddress.innerHTML = rowOb.address;
    viewBRN.innerHTML = rowOb.brn;
    viewIng.innerHTML = rowOb.ingredients;
}

const btnPrintRow = () => {
    console.log("print");
    console.log(supplier);

    let newWindow = window.open();
    newWindow.document.write("<html><head>" +
        "<link rel='stylesheet' href='resources/bootstrap-5.3.1-dist/bootstrap-5.3.1-dist/css/bootstrap.min.css'></link>" +
        "<title>" + "Supplier Details" + "</title>"
        + "</head><body>" +
        printSupplierTable.outerHTML + "<script>printSupplierTable.classList.remove('d-none');</script></body></html>"
    );

    setTimeout(() => {
        newWindow.stop();//table ek load wena ek nawathinw
        newWindow.print();//table ek print weno
        newWindow.close();//aluthin open una window tab ek close weno
        //ar data load wenn nm  time out ekk oni weno aduma 500k wth
    }, 500)
}

const refreshSupplierForm = () => {

    supplier = {};
    oldSupplier = null;

    supplier.ingredients = [];

    allIngredients = ajaxGetRequest("/ingredients/printall");

    ingredientsCategory = ajaxGetRequest("/ingredientscategory/list");
    fillDataIntoSelect(slctIngrediantCategory, "Select Ingredient Category", ingredientsCategory, "name");

    supplierStatus = ajaxGetRequest("/supplierstatus/list");
    fillDataIntoSelect(slctSupplierStatus, "Select Status", supplierStatus, "name", "Active");

    //reset form
    textName.style.border = "1px solid #ced4da";
    personNameTxt.style.border = "1px solid #ced4da";
    mobiTxt.style.border = "1px solid #ced4da";
    emailTxt.style.border = "1px solid #ced4da";
    landTxt.style.border = "1px solid #ced4da";
    txtAddress.style.border = "1px solid #ced4da";
    brnTxt.style.border = "1px solid #ced4da";
    slctSupplierStatus.style.border = "1px solid #ced4da";
    textNote.style.border = "1px solid #ced4da";
    slctIngrediantCategory.style.border = "1px solid #ced4da";
    slctIngrediant.style.border = "1px solid #ced4da";

    supplier.supplierstatus_id = JSON.parse(slctSupplierStatus.value);
    slctSupplierStatus.style.border = "1px solid green";
    slctSupplierStatus.disabled = true;

    if (userPrivilege.priviinsert) {
        btnSupplierSubmit.disabled = "";
    } else {
        btnSupplierSubmit.disabled = "disabled"
    }

}

getIngredientsByCategory = () => {
    let currentIngredientCategoryId = JSON.parse(slctIngrediantCategory.value).id;
    ingredientsFilter = ajaxGetRequest("/ingredients/getingredientscategory/" + currentIngredientCategoryId);
    fillDataIntoSelect(allIngrediant, "", ingredientsFilter, "name")
}

//function for add selected ingredients (>)
const btnAddSelectIngrediant = () => {
    //check duplicate when clicking add btn
    let selectedIng = JSON.parse(allIngrediant.value);
    let extIng = false;

    for (const ing of supplier.ingredients) {
        if (selectedIng.id == ing.id) {
            extIng = true;
            break;
        }
    }
    if (extIng) {
        alert("This Ingredient is already selected");
    } else {
        //all tiyen ek isslla variable ekkt daagannwa(select krgnnw eken 1k)
        let selectedIngredient = JSON.parse(allIngrediant.value);

        //eken select krl ewa btn ek click krama ek selected list ekt dagann oni
        supplier.ingredients.push(selectedIngredient);
        fillDataIntoSelect(slctIngrediant, "", supplier.ingredients, "name");

        //all list eken e selected list ekt giyapu ek ainn krgnnwa
        let extIndex = ingredientsFilter.map(ingredient => ingredient.name).indexOf(selectedIngredient.name);
        if (extIndex != -1) {
            ingredientsFilter.splice(extIndex, 1);
        }
        //remove ewa ainn krl all list refresh krnw
        fillDataIntoSelect(allIngrediant, "", ingredientsFilter, "name");
    }
}

const btnAddAll = () => {
    //check duplicate when clicking add btn
    let selectedIng = JSON.parse(allIngrediant.value);
    let extIng = false;

    for (const ing of supplier.ingredients) {
        if (selectedIng.id == ing.id) {
            extIng = true;
            break;
        }
    }
    if (extIng) {
        alert("This Ingredient is already selected");
    } else {
        //for loop ekk dala okkom ekin ek anith paththata push krnw
        for (const ingredient of ingredientsFilter) {
            supplier.ingredients.push(ingredient);
        }
        //filldataintoselect eken e paththe items tika select eke pennawa
        fillDataIntoSelect(slctIngrediant, "", supplier.ingredients, "name");

        //tibba array ek empty krla ek mukuth nathi ek pennada oni nisa filldataintoselect ek dagannwa
        ingredientsFilter = [];
        fillDataIntoSelect(allIngrediant, "", ingredientsFilter, "name")
    }
}

//function for remove selected item (<)
const btnRemoveSelectIngrediant = () => {
    let selectedIngredientForRemove = JSON.parse(slctIngrediant.value);

    ingredientsFilter.push(selectedIngredientForRemove);
    fillDataIntoSelect(allIngrediant, "", ingredientsFilter, "name");

    let extIndex = supplier.ingredients.map(ingredient => ingredient.name).indexOf(selectedIngredientForRemove.name);
    if (extIndex != -1) {
        supplier.ingredients.splice(extIndex, 1)
    }
    fillDataIntoSelect(slctIngrediant, "", supplier.ingredients, "name");
}

//function for remove all item (<<)
const btnRemoveAll = () => {
    for (const ingredient of supplier.ingredients) {
        ingredientsFilter.push(ingredient);
    }
    fillDataIntoSelect(allIngrediant, "", ingredientsFilter, "name");

    supplier.ingredients = [];
    fillDataIntoSelect(slctIngrediant, "", supplier.ingredients, "name");

}