window.addEventListener('load', () => {
     //mek methanin load krnn form eke withrak nwi table eketh button tiyenonh privilege balal enable/disable wennd oni
     userPrivilege = ajaxGetRequest("/privilage/bymodule/GARBAGEREMOVAL");

    refreshGarbageTable();
    refreshGarbageForm();
});

const refreshGarbageTable = () => {
    //pass the data in db to the table
    garbages = ajaxGetRequest("/garbage/printall");

    //text --> string, number, date
    //function --> object,array, boolean --> craete function 
    //column count == object count
    //piliwelata dann
    const displayProperty = [
        { dataType: 'function', propertyName: getIngredientName },
        { dataType: 'text', propertyName: 'quntity' },
        { dataType: 'text', propertyName: 'reason' },
        { dataType: 'function', propertyName: getGarbageStatus }
    ];

    //call fillDataIntoTable function (tableId,dataList,displayPropertyArrayName,editFunctionName, deleteFuctionName,PrintFuctionName)
    fillDataIntoTable(tableGarbage, garbages, displayProperty, refillGarbage, deleteGarbage, printGarbage, true, userPrivilege);

    //basicma jquery datatable active krgnn widiha
    $('#tableGarbage').dataTable();

}

const getIngredientName = (ob) => {
    return ob.ingredientinvetory_id.ingredients_id.name
}

const getGarbageStatus = (ob) => {
    if (ob.garbageremovalstatus_id.name == 'Complete') {
        return '<span class="text-success fw-bold">Complete</span>'
    } else {
        return '<span class="text-info fw-bold">Not-Completed</span>';
    }
}

const checkFormError = () => {
    let errors = "";

    if (garbage.ingredientinvetory_id == null) {
        errors = errors + "Please Select Ingredient \n";
        nameIngreadient.style.background = 'rgba(255,0,0,0.1)';
    }
    if (garbage.quntity == null) {
        errors = errors + "Please Enter Quntity \n";
        reasonTxt.style.background = 'rgba(255,0,0,0.1)';
    }
    if (garbage.reason == null) {
        errors = errors + "Please Enter Reason \n";
        qtyTxt.style.background = 'rgba(255,0,0,0.1)';
    }
    /* if (garbage.expiredate == null) {
        errors = errors + "Please Enter Reason \n";
        qtyTxt.style.background = 'rgba(255,0,0,0.1)';
    } */
    if (garbage.garbageremovalstatus_id == null) {
        errors = errors + "Please Select Garbage Removal Status \n";
        slctGarbageStatus.style.background = 'rgba(255,0,0,0.1)';
    }
    return errors;
}

const garbageSubmit = () => {
    //1)check the button
    console.log("submit");

    //2)check errors in from
    const errors = checkFormError();
    if (errors == "") {
        //3)get suer confirmation
        let userConfirm = confirm("Are you sure to SAVE following Grabage Removal Details..? \n" +
            "Garbage Name : " + garbage.ingredientinvetory_id.name + "\n" +
            "Quntity : " + garbage.quntity);
        if (userConfirm) {
            //4)call post service
            let postServerResponce = ajaxHTTPRequest("/garbage", "POST", garbage);
            //5)check post service responce
            if (postServerResponce == "OK") {
                alert("Save Successfully ✔");
                refreshGarbageTable();
                formGarbage.reset();
                refreshGarbageForm();
                $('#offcanvasGarbageAdd').offcanvas('hide');
            } else {
                alert("Fail to submit Garbage ❌ \n" + postServerResponce);
            }
        }
    } else {
        alert("The form has following errors... please check the form again..\n" + errors);
    }
}

const textQtyValidator = () => {
    if (new RegExp("^([1-9][0-9]{0,3})|([1-9][0-9]{0,3}[.][0-9]{1,3})$").test(qtyTxt.value)) {
        qtyTxt.style.border = "2px solid green";
        garbage.quntity = qtyTxt.value;
        
    } else {
        qtyTxt.style.border = "2px solid #ced4da";
        garbage.quntity = null;
    }
}

const refillGarbage = (ob) => {
    //1)check refill button
    console.log("refill");

    //disabled krl tibba update button ek enable krno
    btnGarbageUpdate.disabled = false;

    //define menu n oldmenu objects
    //JSON. parse() : This method takes a JSON string and then transforms it into a JavaScript object.
    //assign table row object into hall object
    //object ek  string wlt covert kre hall ek update krddi oldHall ekath update nowi tiyennd oni nisa
    garbage = JSON.parse(JSON.stringify(ob));
    oldGarbage = JSON.parse(JSON.stringify(ob));

    //open irn from
    $('#offcanvasGarbageAdd').offcanvas('show');

    //set value into ui element
    //elementId.value = object.property
    reasonTxt.value = garbage.reason;
    qtyTxt.value = garbage.quntity;
    textNote.value = garbage.note;

    //fill wela tmi select wenn
    ingredients = ajaxGetRequest("/ingredients/printall");
    fillDataIntoSelect(nameIngreadient, "Select Ingreadient", ingredients, "name", ob.ingredientinvetory_id.ingredients_id.name);

    garbageStatus = ajaxGetRequest("/garbagestatus/list");
    fillDataIntoSelect(slctGarbageStatus, "Select Status", garbageStatus, "name", ob.garbageremovalstatus_id.name);

    btnGarbageSubmit.disabled = "disabled";

    if (userPrivilege.priviupdate) {
        btnGarbageUpdate.disabled = "";
    } else {
        btnGarbageUpdate.disabled = "disabled"
    }
}

const checkFormUpdate = () => {
    let updates = "";

    if (garbage.quntity != oldGarbage.quntity) {
        updates = updates + "Garbage Removal quntity is " + oldGarbage.quntity + " into " + garbage.quntity + "\n";
    }
    if (garbage.reason != oldGarbage.reason) {
        updates = updates + "Garbage Removal reason is " + oldGarbage.reason + " into " + garbage.reason + "\n";
    }
    if (garbage.note != oldGarbage.note) {
        updates = updates + "Garbage Removal Note is " + oldGarbage.note + " into " + garbage.note + "\n";
    }
    if (garbage.garbageremovalstatus_id.name != oldGarbage.garbageremovalstatus_id.name) {
        updates = updates + "Garbage Removal Status is changed " + oldGarbage.garbageremovalstatus_id.name + " into " + garbage.garbageremovalstatus_id.name + "\n";
    }
    if (garbage.ingredientinvetory_id.name != oldGarbage.ingredientinvetory_id.name) {
        updates = updates + "Ingredient name  is changed " + oldGarbage.ingredientinvetory_id.name + " into " + garbage.ingredientinvetory_id.name + "\n";
    }
    return updates;
}

const garbageUpdate = () => {
    //1)check button
    console.log("update");
    console.log(garbage);
    console.log(oldGarbage);

    //2)check form errors 
    let errors = checkFormError();
    if (errors == "") {
        //3)check what we have to update
        let updates = checkFormUpdate();
        if (updates == "") {
            alert("Nothing to Update..!");
        } else {
            //4)get user confirm
            let userConfirm = confirm("Are you sure to UPDATE following record? \n" + updates);
            if (userConfirm) {
                //5)call put service
                let putServiceResponce = ajaxHTTPRequest("/garbage", "PUT", garbage);
                //6)check put service responce 
                if (putServiceResponce == "OK") {
                    alert("Update Successfully ✔");
                    refreshGarbageTable();
                    formGarbage.reset();
                    refreshGarbageForm();
                    $('#offcanvasGarbageAdd').offcanvas('hide');
                } else {
                    alert("Fail to Update Garbage Details ❌ \n" + putServiceResponce);
                }
            }
        }
    } else {
        alert("Form has some errors... please check the form again..\n" + errors);
    }
}

const deleteGarbage = (ob) => {
    //1)check button 
    console.log("delete");
    //2)get user confirmation 
    let userConfirm = confirm("Are you sure to DELETE following garbage details..? \n" +
        "Garbage Details : " + ob.ingredientinvetory_id.name);
    if (userConfirm) {
        //3)call delete request
        let deleteServerResponce = ajaxHTTPRequest("/garbage", "DELETE", ob);
        //4)check delete service responce
        if (deleteServerResponce == "OK") {
            alert("Delete Successfully ✔");
            refreshGarbageTable();
        } else {
            alert("Fail to delete garbage ❌ \n" + deleteServerResponce)
        }
    }
}

const printGarbage = (rowOb, rowIndex) => {

    //open view details 
    $('#garbageViewModal').modal('show');

    viewIng.innerHTML = rowOb.ingredientinvetory_id.name;
    viewQty.innerHTML = rowOb.quntity;
    viewReason.innerHTML = rowOb.reason;
    viewExpDate.innerHTML = rowOb.expiredate;
    viewBatchNumber.innerHTML = rowOb.batch_number;
    viewNote.innerHTML = rowOb.note;
}

const btnPrintRow = () => {
    console.log("print");
    console.log(garbage);

    let newWindow = window.open();
    newWindow.document.write("<html><head>" +
        "<link rel='stylesheet' href='resources/bootstrap-5.3.1-dist/bootstrap-5.3.1-dist/css/bootstrap.min.css'></link>" +
        "<title>" + "Garbage Removal Details" + "</title>"
        + "</head><body>" +
        printGarbageTable.outerHTML + "<script>printGarbageTable.classList.remove('d-none');</script></body></html>"
    );

    setTimeout(() => {
        newWindow.stop();//table ek load wena ek nawathinw
        newWindow.print();//table ek print weno
        newWindow.close();//aluthin open una window tab ek close weno
        //ar data load wenn nm  time out ekk oni weno aduma 500k wth
    }, 500)
}

const refreshGarbageForm = () => {
    garbage = {};
    oldGarbage = null;

    ingredients = ajaxGetRequest("/ingredients/printall");
    fillDataIntoSelect(nameIngreadient, "Select Ingreadient", ingredients, "name");

    garbageStatus = ajaxGetRequest("/garbagestatus/list");
    fillDataIntoSelect(slctGarbageStatus, "Select Status", garbageStatus, "name");

    nameIngreadient.style.boder = "1px solid #ced4da";
    reasonTxt.style.boder = "1px solid #ced4da";
    qtyTxt.style.boder = "1px solid #ced4da";
    slctGarbageStatus.style.boder = "1px solid #ced4da";
    textNote.style.boder = "1px solid #ced4da";

    if (userPrivilege.priviinsert) {
        btnGarbageSubmit.disabled = "";
    } else {
        btnGarbageSubmit.disabled = "disabled"
    }
}