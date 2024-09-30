
//create function validate fullname and generate calling name 
const textNameVali = (feildId) => {
    const fullnamePattern = '^([A-Z][a-z]{2,15}[\\s]){1,10}([A-Z][a-z]{2,15}){1}$';
    const regPattern = new RegExp(fullnamePattern);

    if (feildId.value != '') {
        if (regPattern.test(feildId.value)) {
            feildId.style.border = '2px solid green';

            employee.fullname = feildId.value;
            //generate calling name list

            //const callingNameDataList = feildId.value.split(' ');
            callingNameDataList = feildId.value.split(' ');
            //console.log(callingNameDataList);
            callingNameList.innerHTML = '';

            callingNameDataList.forEach(element => {
                const option = document.createElement('option');
                option.value = element;
                callingNameList.appendChild(option);
            });

        } else {
            employee.fullname = null;
            feildId.style.border = '2px solid yellow';
        }

    } else {
        employee.fullname = null;
        feildId.style.border = '2px solid red';
    }
}

//create function validate calling name
const callingNameVali = (feildId) => {
    const callingNameValue = feildId.value;
    //let extCN 

    const index = callingNameDataList.map(element => element).indexOf(callingNameValue);
    console.log(index);
    if (index != -1) {
        feildId.style.border = '2px solid green';
    } else {
        feildId.style.border = '2px solid red';
    }

}


//define function for validate text element 
const textFeildVali = (feildId, pattern, object, property, oldobject) => {

    //create variable for assign regexp object
    const regPattern = new RegExp(pattern);

    if (feildId.value != "") {
        //if value ext
        if (regPattern.test(feildId.value)) {
            //if value valid (bind value into object property)
            window[object][property] = feildId.value;

           if (window[oldobject] != null && window [object] [property] != window[oldobject] [property]) {
            feildId.style.border = '2px solid purple';
           } else {
            feildId.style.border = '2px solid green';
           }
        } else {
            //if value in-valid
            window[object][property] = null;

            feildId.style.border = '2px solid red';
        }

    } else {
        //value not ext
        if (feildId.required) {
            feildId.style.border = '2px solid red';
        } else {
            feildId.style.border = '2px solid #ced4da';
        }
    }
}

//define function for validate select element
const selectDVali = (feildId, pattern, object, property, oldobject) => {
    if (feildId.value != '') {
        //valid
        feildId.style.border = '2px solid green';
        window[object][property] = JSON.parse(feildId.value); //convert js object

        if (window[oldobject] != null && window [object] [property] ['id'] != window[oldobject] [property] ['id']) {
            feildId.style.border = '2px solid purple';
           } else {
            feildId.style.border = '2px solid green';
           }

    } else {
        //if value in-valid
        feildId.style.border = '2px solid red';
        window[object][property] = null;
    }
}

//define function for validate select element
const selectSVali = (feildId, pattern, object, property, oldobject) => {
    if (feildId.value != '') {
        //valid
        feildId.style.border = '2px solid green';
        window[object][property] = feildId.value;//select element value type is string need to converrt as javascript object

        if (window[oldobject] != null && window [object] [property] ['id'] != window[oldobject] [property] ['id']) {
            feildId.style.border = '2px solid purple';
        } else {
            feildId.style.border = '2px solid green';
        }
    } else {
        //if value in-valid
        feildId.style.border = '2px solid red';
        window[object][property] = null;
    }
}

//define fn for password retype
const retypePasswordVali = () => {
    if (userPassword.value == userRePassword.value) {
        userRePassword.style.border = "2px solid green";
        userAdd.password = userPassword.value;
    } else {
        userRePassword.style.border = "2px solid red";
        userAdd.password = null;
    }
}

// file elemet eke value ek arnn wadak naa
//file ek argen ek encrypt krl ek pass krno backend ekt
const fileValidator = (fileElement, object, imageProperty, imageNameProperty, PreviewId) => {

    if (fileElement.files != null) {
        //0 index eken tmi file eke tmi apita oni details tiyenn (file object ek enn)
        let file = fileElement.files[0];
        //object.name kiuwam enn object eke nama
        window[object][imageNameProperty] = file.name;

        //file ek read krnn oni nisa filereader ekk hadagththa, ekt adala details tiyeno fileReader constructor eke
        let filereader = new FileReader();

        //source ekt oni krn dewal tiyenn meke???????
        filereader.onload = function (e) {
            PreviewId.src = e.target.result;
            //image ek enn string array ekk widihata ek encryption ekkt covert db eke save wenn
            window[object][imageProperty] = btoa(e.target.result)
        }

        filereader.readAsDataURL(file);
    }

}
