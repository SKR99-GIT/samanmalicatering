//browser onload event 
window.addEventListener('load', () => {

     //mek methanin load krnn form eke withrak nwi table eketh button tiyenonh privilege balal enable/disable wennd oni
     userPrivilege = ajaxGetRequest("/privilage/bymodule/FUNCTIONHALL");

    refershHallTable();

    refershHallForm();

});

const refershHallTable = () => {

    //pass the data in db to the table  
    halls = ajaxGetRequest("/hall/printall");

    //text --> string, number, date
    //function --> object,array, boolean --> craete function 
    //column count == object count
    //piliwelata dann 
    const displayProperty = [
        { dataType: 'text', propertyName: 'name' },
        { dataType: 'text', propertyName: 'maxparticipantcount' },
        { dataType: 'function', propertyName: getFeatures },
        { dataType: 'function', propertyName: getHallStatus }
    ];

    //call fillDataIntoTable function (tableId,dataList,displayPropertyArrayName,editFunctionName, deleteFuctionName,PrintFuctionName)
    fillDataIntoTable(tableHall, halls, displayProperty, HallFormRefill, deleteHall, printHall, true, userPrivilege);


     //me ara delete krl tiyen ekk aaye delete krnnd bari wennd hadala tiyenn
     /* employees.forEach((element, index) => {
        if (userPrivilege.prividelete && element.employeestatus_id.name == "Delete") {
            //table eke body ek allgen, eken table column ek allgen, eketh delete button ek allgnnd oni
            tableEmployee.children[1].children[index].children[10].children[1].disabled = "disabled";
            tableEmployee.children[1].children[index].children[10].children[1].style.cursor = "not-allowed";
        }
    }); */

    
    //basicma jquery datatable active krgnn widiha
    $('#tableHall').dataTable();
}

const getHallStatus = (ob) => {
    if (ob.hallstatus_id.name == 'Available') {
        return '<span class="text-success fw-bold">Available</span>'
    } else {
        return '<span class="text-danger fw-bold">Unavailable</span>';
    }
}

const getFeatures = (ob) => {
    let features = "";
    for (const index in ob.features) {
        if (index == ob.features.length - 1) {
            features = features + ob.features[index].name;
        } else {
            features = features + ob.features[index].name + ", ";
        }
    }
    return features;
}

//define fn ckeckerror
const checkFormError = () => {
    let errors = '';

    if (hall.name == null) {
        errors = errors + "Please Enter Hall Name \n";
        textName.style.background = 'rgba(255,0,0,0.1)';
    }
    if (hall.maxparticipantcount == null) {
        errors = errors + "Please Enter Max Participate Count \n";
        countTxt.style.background = 'rgba(255,0,0,0.1)';
    }

    //features eke validation----------------------------------------????????????????
    //gender ekt validation daana wididha hoyagnnd----------------------------------------------------??????????????????????
    return errors;
}

const hallSubmit = () => {
    //1)check the button
    console.log("submit");
    console.log(hall);

    //2) check errors
    const errors = checkFormError();
    if (errors == "") {
        //3)get user comfirmation
        let userConfirm = confirm("Are you sure to SAVE following Hall details..? \n" +
            "Hall name: " + hall.name);
        if (userConfirm) {
            //4)call post request
            let postServerResponce = ajaxHTTPRequest("/hall", "POST", hall);
            //5)check post service responce
            if (postServerResponce == "OK") {
                alert("Save Successfully ✔");
                refershHallTable();
                formHall.reset();
                refershHallForm();
                $('#offcanvasHallAdd').offcanvas('hide');
            } else {
                alert("Fail to submit Hall ❌ \n" + postServerResponce);
            }
        }
    } else {
        alert("The form has following errors... please check the form again..\n" + errors);
    }
}

const HallFormRefill = (ob) => {
    //1) check button
    console.log("refill");

    //disabled krl tibba update button ek enable krno
    btnHallUpdate.disabled = false;

    //2)deine hall n oldHall objects
    //JSON. parse() : This method takes a JSON string and then transforms it into a JavaScript object.
    //assign table row object into hall object
    //object ek  string wlt covert kre hall ek update krddi oldHall ekath update nowi tiyennd oni nisa
    hall = JSON.parse(JSON.stringify(ob));
    oldHall = JSON.parse(JSON.stringify(ob));

    //open hall form
    $('#offcanvasHallAdd').offcanvas('show');

    //get features list for refill features
    featuresList = ajaxGetRequest("/hallfeatures/list");
    featuresDiv.innerHTML = "";
    featuresDiv.innerHTML = '<label class="col-4 col-form-label fw-bold text-start"> Features : <span class="text-danger">*</span> </label>';
    featuresList.forEach(element => {
        let div = document.createElement('div');
        div.className = "form-check form-check-inline";
        let input = document.createElement("input");
        input.classList.add("form-check-input");
        input.type = "checkbox";
        let label = document.createElement("label");
        label.classList.add("form-check-label");
        label.innerText = element.name;

        input.onchange = function () {
            if (this.checked) {
                hall.features.push(element);
            } else {
                //this code snippet removes an element from the hall.features array if an element with a matching id is found in the array. If the element is found, it is removed from the array using the splice method. If the element is not found (i.e., extIndex equals -1), no action is taken.
                let extIndex = hall.features.map(feature => feature.id).indexOf(element.id);
                if (extIndex != -1) {
                    //1 is the number of elements to remove from the array starting at the extIndex.
                    hall.features.splice(extIndex, 1)
                }
            }
        }
        //adala check boxes checked kiyl balala check krwno
        let extIndex = hall.features.map(feature => feature.id).indexOf(element.id);
        if (extIndex != -1) {
            input.checked = true;
        }
        div.appendChild(input);
        div.appendChild(label);
        featuresDiv.appendChild(div);
    });

    //set value into ui element
    //elementId.value = object.property
    textName.value = hall.name;
    countTxt.value = hall.maxparticipantcount;
    textNote.value = hall.note;

    //fill wela tmi select wenn
    hallStatus = ajaxGetRequest("/hallstatus/list");
    fillDataIntoSelect(slctHallStatus, "Select Status...", hallStatus, "name", hall.hallstatus_id.name);

    btnHallSubmit.disabled = "disabled";

    if (userPrivilege.priviupdate) {
        btnHallUpdate.disabled = "";
    } else {
        btnHallUpdate.disabled = "disabled"
    }
}

const checkFormUpdate = () => {
    let updates = "";

    if (hall.name != oldHall.name) {
        updates = updates + "Hall name is changed " + oldHall.name + " into " + hall.name + "\n";
    }
    if (hall.maxparticipantcount != oldHall.maxparticipantcount) {
        updates = updates + "Max Participant Count is changed " + oldHall.maxparticipantcount + " into " + hall.maxparticipantcount + "\n";
    }
    if (hall.note != oldHall.note) {
        updates = updates + "Note is changed " + oldHall.note + " into " + hall.note + "\n";
    }
    if (hall.hallstatus_id.name != oldHall.hallstatus_id.name) {
        updates = updates + "Hall status is changed " + oldHall.hallstatus_id.name + " into " + hall.hallstatus_id.name + "\n";
    }
    //explain this----------------------------------------------???????????
    //mt therena widhata meke blnn isslaama leesiyen allgnnd puluwn widiha, length ek wenss welad kiyl blno, eken wade allgnnd bari unam map eke(map() --> ek element ekk tiyen id ek illganno) wade allgnnd balano eyalage id check krl
    if (hall.features.length != oldHall.features.length) {
        alert("Features Changed")
    } else {
        for (let element of hall.features) {
            let extFeatureCount = oldHall.features.map(item => item.id).indexOf(element.id)
            if (extFeatureCount == -1) {
                updates = updates + " Feature has changed";
                break;
            }
        }
    }
    return updates;
}

const hallUpdate = () => {
    //1)check button n objects
    console.log("update");
    console.log(hall);
    console.log(oldHall);
    //2)check form errors
    let errors = checkFormError();
    if (errors == "") {
        //3)check what we have to update
        let updates = checkFormUpdate();
        if (updates == "") {
            alert("Nothing to Update..!")
        } else {
            //4)get user confirmation
            let userConfirm = confirm("Are you sure to UPDATE following record? \n" + updates);
            if (userConfirm) {
                //5)call put service
                let putServiceResponce = ajaxHTTPRequest("/hall", "PUT", hall)
                //6)check put service responce
                if (putServiceResponce == "OK") {
                    alert("Update Successfully ✔");
                    refershHallTable();
                    formHall.reset();
                    refershHallForm();
                    $('#offcanvasHallAdd').offcanvas('hide');
                } else {
                    alert("Fail to Update Hall Details ❌ \n" + putServiceResponce);
                }
            }
        }
    } else {
        alert("Form has some errors... please check the form again..\n" + errors);
    }
}

const deleteHall = (ob) => {
    //1)check button 
    console.log("delete");
    //2)get user confirmation
    let userConfirm = confirm("Are you sure to DELETE following Hall Details..? \n" +
        "Hall Name : " + ob.name);
    if (userConfirm) {
        //3)call delete request
        let deleteserverResponce = ajaxHTTPRequest("/hall", "DELETE", ob);
        //4)check delete service responce
        if (deleteserverResponce == "OK") {
            alert("Delete Successfully ✔");
            refershHallTable();
        } else {
            alert("Fail to delete Hall ❌ \n" + deleteserverResponce)
        }
    }
}

const printHall = (ob) => {
    console.log("print");
    let newWindow = window.open();
    newWindow.document.write(
        "<head>" +
        " <link rel='stylesheet' href='resources/bootstrap-5.3.1-dist/bootstrap-5.3.1-dist/css/bootstrap.min.css'></link>"
        + "</head>" +
        "<body>" + "<table class='table table-primary table-bordered'>" +
        "<thead>" +
        "<tr>" +
        "<th>Hall Name</th>" +
        "<th>Max Count</th>" +
        "<th>Per Hour Charge</th>" +
        "<th>Price Start Date</th>" +
        "<th>Price End Date</th>" +
        "<th>Features</th>" +
        "</tr>" +
        "</thead>" +
        "<tbody>" +
        "<tr>" +
        "<td>" + ob.name + "</td>" +
        "<td>" + ob.maxparticipantcount + "</td>" +
        "<td>" + ob.features + "</td>" + //mek ahgnnd--------------??????????(user eke role ekatath dann)
        "</tbody>" +
        "</table>" +
        "</body>"
    );
    setTimeout(function () {
        newWindow.print()
    }, 500)
}

const refershHallForm = () => {

    hall = new Object();
    oldHall = null;

    hall.features = new Array();

    //fill data into a select (from database)
    hallStatus = ajaxGetRequest("/hallstatus/list");
    fillDataIntoSelect(slctHallStatus, "Select Status..", hallStatus, "name");

    //get features list fro generate features in form
    //ajax call eke features list ek gnno
    featuresList = ajaxGetRequest("/hallfeatures/list")
    //featuresDiv id ek tiyen div ek athule mona hari tiyenonm issla ek null krnn innd oni
    featuresDiv.innerHTML = "";
    //label ek hdgnnw
    featuresDiv.innerHTML = '<label class="col-4 col-form-label fw-bold text-start"> Features : <span class="text-danger">*</span> </label>';
    //features list ek piliwelata check box wlt gnnw foreach ellin 
    featuresList.forEach(element => {
        //div tag ekk create krgen inno 
        let div = document.createElement('div');
        //check box tikat class ekk dala thani line eke ena widihata hdgnnw
        div.className = "form-check form-check-inline";
        //input tag ekk hdnw 
        let input = document.createElement('input');
        //methana ek checkbox ekk withrak nwi list ekkm enonh ek nisa tmi classlist ekk dagen add krgnn
        input.classList.add('form-check-input')
        //checkbox ek argnnw
        input.type = "checkbox";
        //checkbox  ekt label ek dgnnw
        let label = document.createElement('label');
        label.classList.add('form-check-label');
        //checkbox eke label ekt db eken nama(featuresList array eke elemnt eke tiyen name ek) dagannw
        label.innerText = element.name;

        //select krn ewa array ekt dagann widiha
        input.onchange = function () {
            if (this.checked) {
                hall.features.push(element)
            } else {
                //hall.features.pop(element); <-- meka welawkt hariyann naa waradi ek tmi pop wenn welawkt(pop karanna wenne anthimata enter wuna item eka misak apita one eka neme wenna puluwan,,e nisa index walin yanawa)
                //ek nisa e wenuwata map eken me wade krgnn puluwn 
                //map() --> ek element ekk tiyen id ek illganno 
                //splice() --> dena index ekata adala element ek remove krno
                let extIndex = hall.features.map(feature => feature.id).indexOf(element.id);
                if (extIndex != -1) {
                    hall.features.splice(extIndex, 1);
                }
            }
        }

        //uda hagaththa ewa piliwelata append krgen yano
        div.appendChild(input);
        div.appendChild(label);
        featuresDiv.appendChild(div);
    });

    //reset form
    textName.style.border = "1px solid #ced4da";
    countTxt.style.border = "1px solid #ced4da";
    slctHallStatus.style.border = "1px solid #ced4da";
    textNote.style.border = "1px solid #ced4da";

    if (userPrivilege.priviinsert) {
        btnHallSubmit.disabled = "";
    } else {
        btnHallSubmit.disabled = "disabled"
    }
}