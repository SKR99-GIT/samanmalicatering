const fillDataIntoTable = (tableId, dataList, columnList, editfunction, deleteFuction, printFunction, buttonVisibility = true, userPrivilege) => {

    //const table = document.querySelector('#tableEmployee');
    const tableBody = tableId.children[1];
    tableBody.innerHTML = '';

    dataList.forEach((element, index) => {

        const tr = document.createElement('tr');

        const tdIndex = document.createElement('td');
        tdIndex.innerText = index + 1;
        tr.appendChild(tdIndex);

        columnList.forEach(column => {
            const td = document.createElement('td');

            if (column.dataType == 'text') {
                td.innerText = element[column.propertyName];
            }
            if (column.dataType == 'function') {
                td.innerHTML = column.propertyName(element);
            }
            if (column.dataType == 'imagearray') {
                let img = document.createElement('img');
                img.style.width = "50px";
                img.style.height = "50px";
                if (element[column.propertyName] != null) {
                    img.src = atob(element[column.propertyName])
                } else {
                    img.src = "/resources/images/user.png";
                }
                td.appendChild(img);
            }
            tr.appendChild(td);
        });

        const tdButton = document.createElement('td');

        const buttonEdit = document.createElement('button');
        const buttonDelete = document.createElement('button');
        const buttonPrint = document.createElement('button');

        buttonEdit.className = 'btn', 'custom-btn', 'bg-warning';
        buttonDelete.className = 'btn', 'custom-btn', 'bg-danger', 'ms-2';
        buttonPrint.className = 'btn', 'custom-btn', 'bg-success', 'ms-2';

        buttonEdit.innerHTML = '<i class = "fa-solid fa-pen-to-square fa-beat"></i>';
        buttonDelete.innerHTML = '<i class = "fa-solid fa-trash fa-beat"></i>';
        buttonPrint.innerHTML = '<i class = "fa-solid fa-eye fa-beat"></i>';

        buttonEdit.onclick = function () {
            editfunction(element, index);
        }

        buttonDelete.onclick = function () {
            //conform ('are you sure to delete following employee')
            deleteFuction(element, index);
        }

        buttonPrint.onclick = function () {
            printFunction(element, index);
        }

        buttonEdit.style.pointerEvents = "all";//mek dmme naththm not allowed ek penn naa 
        if (!userPrivilege.priviupdate) {
           buttonEdit.disabled= true;
           buttonEdit.style.cursor="not-allowed";
        }

        buttonDelete.style.pointerEvents = "all";
        if (!userPrivilege.prividelete) {
            buttonDelete.disabled= true;
            buttonDelete.style.cursor="not-allowed";
        }

        buttonPrint.style.pointerEvents = "all";
        if (!userPrivilege.priviselect) {
            buttonPrint.disabled= true;
            buttonPrint.style.cursor="not-allowed";
        } 

        tdButton.appendChild(buttonEdit);
        tdButton.appendChild(buttonDelete);
        tdButton.appendChild(buttonPrint);

        if (buttonVisibility) {
            tr.appendChild(tdButton);
        }

        tableBody.appendChild(tr);

    });
}

//define functon for fill data into select element
const fillDataIntoSelect = (feildId, message, dataList, property, selectedValue) => {

    //feildId eke athule tiyen ek null krno
    feildId.innerHTML = '';

    if (message != "") {
        //option tag ekk create krno
        const optionMsg = document.createElement('option');
        //message ekk daganno 
        optionMsg.innerText = message;
        //me ilagata comment krl tiyen ek nathath kmk naa, message eke value ekk oni nathi nisa ek null krl tiyenn
        //optionMsg.value=''
        optionMsg.selected = "selected";
        optionMsg.disabled = "disabled";
        feildId.appendChild(optionMsg);
    }

    //while loop ek gann run wennd oni waara gaana dn nathi unam
    //for ek run krnn ek run wen waara gaana dnno nm
    //foreach array eke hama object ek paaram
    dataList.forEach(element => {
        const option = document.createElement('option');
        option.innerText = element[property];
        option.value = JSON.stringify(element);//meka dynamic drop down ekk,json string ekk create krgnn oni nisa (convert javascript object into json string -> option element value type is string)

        //refill ekedi data ek pura wann me parameter eken
        if (selectedValue == element[property]) {
            option.selected = "selected";
        }
        feildId.appendChild(option);
    });
}

const fillDataIntoSelect2 = (feildId, message, dataList, property, propertyTwo, selectedValue) => {

    //feildId eke athule tiyen ek null krno
    feildId.innerHTML = '';

    //create option tag
    const optionMsg = document.createElement("option");
    //put a message into that 
    optionMsg.innerText = message;
    //ek selected disabled krnw
    optionMsg.selected = "selected";
    optionMsg.disabled = "disabled";
    feildId.appendChild(optionMsg);

    //foreach eken datalist ekt value tika gannw 
    dataList.forEach(element => {
        //Isslama opton tag ekk hadagnnw 
        const option = document.createElement('option');
        //ita psse element eke property ek genn gannwa tag eke innertext ek athulata
        option.innerText = "(" + element[property] + ") " + element[propertyTwo];
        //meka dynamic drop down ekk,json string ekk create krgnn oni nisa (convert javascript object into json string -> option element value type is string)
        option.value = JSON.stringify(element);

        //refill ekedi select krl tibba data ek pirenn meken 
        if (selectedValue == element[property]) {
            option.selected = "selected";
        }
        feildId.appendChild(option);
    });
}

//define functon for fill data into select element
const fillDataIntoSelect3 = (feildId, message, dataList, dataListTwo, property, propertyTwo, selectedValue) => {

    //feildId eke athule tiyen ek null krno
    feildId.innerHTML = '';

    if (message != "") {
        //option tag ekk create krno
        const optionMsg = document.createElement('option');
        //message ekk daganno 
        optionMsg.innerText = message;
        //me ilagata comment krl tiyen ek nathath kmk naa, message eke value ekk oni nathi nisa ek null krl tiyenn
        //optionMsg.value=''
        optionMsg.selected = "selected";
        optionMsg.disabled = "disabled";
        feildId.appendChild(optionMsg);
    }

    //while loop ek gann run wennd oni waara gaana dn nathi unam
    //for ek run krnn ek run wen waara gaana dnno nm
    //foreach array eke hama object ek paaram
    dataList.forEach(element => {
        const option = document.createElement('option');
        option.innerText = "(" + element[property] + ") " + getValueFromObjectArray(element[propertyTwo]);
        option.value = JSON.stringify(element);//meka dynamic drop down ekk,json string ekk create krgnn oni nisa (convert javascript object into json string -> option element value type is string)

        //refill ekedi data ek pura wann me parameter eken
        if (selectedValue == element[property]) {
            option.selected = "selected";
        }
        feildId.appendChild(option);
    });
} 


//wenama table ekka tiyen data ekkuth oni nm select ekedi penngand apit meka oni weno
const getValueFromObjectArray = (dataOb, propertyString) => {
    // Define a function called getValueFromObjectArray that takes two parameters:
    // dataOb (an object) and propertyString (a string representing a property path).

    let finalValue = (dataO, ps) => {
        // Inside getValueFromObjectArray, define another function called finalValue.
        // This function takes two parameters: dataO (an object) and ps (a property string).

        let propertyList = ps.split(".");
        // Split the property string by '.' to get an array of properties.

        console.log(propertyList);
        // Log the property list array to the console for debugging purposes.

        if (propertyList.length > 1 && typeof dataO[propertyList[0]] === "object") {
            // If the property list has more than one element and the first property in dataO is an object:

            return finalValue(dataO[propertyList[0]], propertyList.splice(1).join("."));
            // Recursively call finalValue with the nested object and the remaining property string.

        } else {
            // If the property list has only one element or the first property in dataO is not an object:

            return dataO[propertyList[0]];
            // Return the value of the first property in dataO.
        }
    };

    let value = finalValue(dataOb, propertyString);
    // Call finalValue with the original object and property string, and store the result in value.

    return value;
    // Return the final value.
};


const fillDataIntoInnerTable = (tableId, dataList, columnList, deleteFuction, buttonVisibility = true) => {

    //const table = document.querySelector('#tableEmployee');
    const tableBody = tableId.children[1];
    tableBody.innerHTML = '';

    dataList.forEach((element, index) => {

        const tr = document.createElement('tr');

        const tdIndex = document.createElement('td');
        tdIndex.innerText = index + 1;
        tr.appendChild(tdIndex);

        columnList.forEach(column => {
            const td = document.createElement('td');

            if (column.dataType == 'text') {
                td.innerText = element[column.propertyName];
            }
            if (column.dataType == 'function') {
                td.innerHTML = column.propertyName(element);
            }

            tr.appendChild(td);
        });

        const tdButton = document.createElement('td');

        const buttonDelete = document.createElement('button');

        buttonDelete.className = 'btn', 'custom-btn', 'bg-danger', 'ms-2';

        buttonDelete.innerHTML = '<i class = "fa-solid fa-trash fa-beat"></i>';


        buttonDelete.onclick = function () {
            //confirm ('are you sure to delete following employee')
            deleteFuction(element, index);
        }

        tdButton.appendChild(buttonDelete);

        if (buttonVisibility) {
            tr.appendChild(tdButton);
        }
        tableBody.appendChild(tr);
    });
}

const fillDataIntoTableWithRefill = (tableId, dataList, columnList, editfunction, buttonVisibility = true, userPrivilege) => {

    //const table = document.querySelector('#tableEmployee');
    const tableBody = tableId.children[1];
    tableBody.innerHTML = '';

    dataList.forEach((element, index) => {

        const tr = document.createElement('tr');

        const tdIndex = document.createElement('td');
        tdIndex.innerText = index + 1;
        tr.appendChild(tdIndex);

        columnList.forEach(column => {
            const td = document.createElement('td');

            if (column.dataType == 'text') {
                td.innerText = element[column.propertyName];
            }
            if (column.dataType == 'function') {
                td.innerHTML = column.propertyName(element);
            }

            tr.appendChild(td);
        });

        const tdButton = document.createElement('td');

        const buttonEdit = document.createElement('button');

        buttonEdit.className = 'btn', 'custom-btn', 'bg-warning';

        buttonEdit.innerHTML = '<i class = "fa-solid fa-pen-to-square fa-beat"></i>';

        buttonEdit.onclick = function () {
            editfunction(element, index);
        }

        buttonEdit.style.pointerEvents = "all"; 
        if (!userPrivilege.priviupdate) {
           buttonEdit.disabled= true;
           buttonEdit.style.cursor="not-allowed";
        }

        tdButton.appendChild(buttonEdit);

        if (buttonVisibility) {
            tr.appendChild(tdButton);
        }
        tableBody.appendChild(tr);
    });
}

const fillDataIntoTableWithPrint = (tableId, dataList, columnList, printFunction, buttonVisibility = true, userPrivilege) => {

    //const table = document.querySelector('#tableEmployee');
    const tableBody = tableId.children[1];
    tableBody.innerHTML = '';

    dataList.forEach((element, index) => {

        const tr = document.createElement('tr');

        const tdIndex = document.createElement('td');
        tdIndex.innerText = index + 1;
        tr.appendChild(tdIndex);

        columnList.forEach(column => {
            const td = document.createElement('td');

            if (column.dataType == 'text') {
                td.innerText = element[column.propertyName];
            }
            if (column.dataType == 'function') {
                td.innerHTML = column.propertyName(element);
            }

            tr.appendChild(td);
        });

        const tdButton = document.createElement('td');

        const buttonPrint = document.createElement('button');

        buttonPrint.className = 'btn', 'custom-btn', 'bg-success', 'ms-2';

        buttonPrint.innerHTML = '<i class = "fa-solid fa-eye fa-beat"></i>';

        buttonPrint.onclick = function () {
            printFunction(element, index);
        }

        buttonPrint.style.pointerEvents = "all";
        if (!userPrivilege.priviselect) {
            buttonPrint.disabled= true;
            buttonPrint.style.cursor="not-allowed";
        } 

        tdButton.appendChild(buttonPrint);

        if (buttonVisibility) {
            tr.appendChild(tdButton);
        }

        tableBody.appendChild(tr);

    });
}
const fillDataIntoTableWithoutModify = (tableId, dataList, columnList ) => {

    //const table = document.querySelector('#tableEmployee');
    const tableBody = tableId.children[1];
    tableBody.innerHTML = '';

    dataList.forEach((element, index) => {

        const tr = document.createElement('tr');

        const tdIndex = document.createElement('td');
        tdIndex.innerText = index + 1;
        tr.appendChild(tdIndex);

        columnList.forEach(column => {
            const td = document.createElement('td');

            if (column.dataType == 'text') {
                td.innerText = element[column.propertyName];
            }
            if (column.dataType == 'function') {
                td.innerHTML = column.propertyName(element);
            }
            if (column.dataType == 'imagearray') {
                let img = document.createElement('img');
                img.style.width = "50px";
                img.style.height = "50px";
                if (element[column.propertyName] != null) {
                    img.src = atob(element[column.propertyName])
                } else {
                    img.src = "/resources/images/user.png";
                }
                td.appendChild(img);
            }

            tr.appendChild(td);
        });

        tableBody.appendChild(tr);

    });
}

const fillDataIntoTableWithoutPrint = (tableId, dataList, columnList, editfunction, deleteFuction, buttonVisibility = true, userPrivilege) => {

    //const table = document.querySelector('#tableEmployee');
    const tableBody = tableId.children[1];
    tableBody.innerHTML = '';

    dataList.forEach((element, index) => {

        const tr = document.createElement('tr');

        const tdIndex = document.createElement('td');
        tdIndex.innerText = index + 1;
        tr.appendChild(tdIndex);

        columnList.forEach(column => {
            const td = document.createElement('td');

            if (column.dataType == 'text') {
                td.innerText = element[column.propertyName];
            }
            if (column.dataType == 'function') {
                td.innerHTML = column.propertyName(element);
            }
            tr.appendChild(td);
        });

        const tdButton = document.createElement('td');

        const buttonEdit = document.createElement('button');
        const buttonDelete = document.createElement('button');

        buttonEdit.className = 'btn', 'custom-btn', 'bg-warning';
        buttonDelete.className = 'btn', 'custom-btn', 'bg-danger', 'ms-2';

        buttonEdit.innerHTML = '<i class = "fa-solid fa-pen-to-square fa-beat"></i>';
        buttonDelete.innerHTML = '<i class = "fa-solid fa-trash fa-beat"></i>';

        buttonEdit.onclick = function () {
            editfunction(element, index);
        }

        buttonDelete.onclick = function () {
            //conform ('are you sure to delete following employee')
            deleteFuction(element, index);
        }



        buttonEdit.style.pointerEvents = "all";//mek dmme naththm not allowed ek penn naa 
        if (!userPrivilege.priviupdate) {
           buttonEdit.disabled= true;
           buttonEdit.style.cursor="not-allowed";
        }

        buttonDelete.style.pointerEvents = "all";
        if (!userPrivilege.prividelete) {
            buttonDelete.disabled= true;
            buttonDelete.style.cursor="not-allowed";
        }

        tdButton.appendChild(buttonEdit);
        tdButton.appendChild(buttonDelete);

        if (buttonVisibility) {
            tr.appendChild(tdButton);
        }

        tableBody.appendChild(tr);

    });
}
