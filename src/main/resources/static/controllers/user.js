//browser load option
window.addEventListener('load', () => {
    //mek methanin load krnn form eke withrak nwi table eketh button tiyenonh privilege balal enable/disable wennd oni
    userPrivilege = ajaxGetRequest("/privilage/bymodule/USER");

    //call table rerfresh function
    refershUserTable();
    //table refresh function ekk wenam load krnn --> table ek kiipasarayakm refersh wennd oni nisa 

    refershUserForm();

});

//define function for refresh user table 
const refershUserTable = () => {

    //define array for store data
    users = ajaxGetRequest("/user/printall");

    //text --> string, number, date
    //function --> object,array, boolean --> craete function 
    //column count == object count
    //piliwelata dann 
    const displayPropertyList = [
        { dataType: "function", propertyName: getEmployeeName },//function wlt double code use krnn naa
        { dataType: "text", propertyName: "username" },
        { dataType: "text", propertyName: "email" },
        { dataType: "function", propertyName: getRoles },
        { dataType: "function", propertyName: getUserStatus }
    ];

    //fillDataIntoTable = (tableId, dataList, columnList, editfunction, deleteFuction, printFunction, buttonVisibility = true)
    fillDataIntoTable(tabeleUser, users, displayPropertyList, refillUserForm, deleteUser, printUser, true, userPrivilege);

    //me ara delete krl tiyen ekk aaye delete krnnd bari wennd hadala tiyenn
    /*  employees.forEach((element, index) => {
       if (userPrivilege.prividelete && element.employeestatus_id.name == "Delete") {
           //table eke body ek allgen, eken table column ek allgen, eketh delete button ek allgnnd oni
           tableEmployee.children[1].children[index].children[10].children[1].disabled = "disabled";
           tableEmployee.children[1].children[index].children[10].children[1].style.cursor = "not-allowed";
       }
   }); */

    //basicma jquery datatable active krgnn widiha
    $('#tabeleUser').dataTable();
}

//define function get employee full name
const getEmployeeName = (ob) => {
    return ob.employee_id.fullname;
}

//define function for get user roles
//ob --> printall datalist eke single object
const getRoles = (ob) => {
    let roles = "";
    for (const index in ob.roles) {

        if (index == ob.roles.length - 1) {
            roles = roles + ob.roles[index].name;
        } else {
            roles = roles + ob.roles[index].name + ", ";
        }
    }
    return roles;
}

//define functoin for get user status
const getUserStatus = (ob) => {
    if (ob.status) {
        return '<i class="fa-solid fa-user-check" style="color: #17ba48;"></i>';
    } else {
        return '<i class="fa-solid fa-user-xmark" style="color: #f03333;"></i>';
    }
}

const refershUserForm = () => {

    user = new Object();//craete variable user as new object

    //set ekk ena nisa tmi methna array ekk hdgnn
    user.roles = new Array();

    //get data list for fill dynamic select element (1weni properety ekt gnnd oni unique ek)
    employeeListWithoutUserAccount = ajaxGetRequest("/employee/listwithoutuseraccount");
    fillDataIntoSelect2(nameEmployee, "Select Employee", employeeListWithoutUserAccount, "nic", "fullname");

    //get role list for generate roles in form 
    //ajax call eken role list ek gnno (meka hdgththe RoleController ekedi)
    roleList = ajaxGetRequest("/role/getRoleListWithoutAdmin");
    //rolesDiv id ek tiyen div ek athule mona hari tiyeno nm issla ek null krnn innd oni
    rolesDiv.innerHTML = "";
    //label ek hdgnnw
    rolesDiv.innerHTML = '<label class="col-4 col-form-label fw-bold text-start"> Role : <span class="text-danger">*</span> </label>';
    //role list ek piliwelata check box wlt gnnw foreach ekkin
    roleList.forEach(element => {
        //div tag ekk create krgen inno
        let div = document.createElement('div');
        //check box tikat class ekk dala thani line eke ena widihata hdgnnw
        div.className = "form-check form-check-inline";
        //input tag ekk hdnw
        let input = document.createElement('input');
        //methana ek checkbox ekk withrak nwi list ekkm enonh ek nisa tmi classlist ekk dagen add krgnn
        input.classList.add('form-check-input');
        //checkbox ek argnnw 
        input.type = "checkbox";
        //checkbox ekt label ek dagannw
        let label = document.createElement('label');
        label.classList.add('form-check-label');
        //checkbox eke label ekt db eken nama(roleList array eke elemnt eke tiyen name ek) dagannw
        label.innerText = element.name;

        //select krn ewa array ekt dagann widiha----------------------------------------------------------------???????????
        input.onchange = function () {
            if (this.checked) {
                user.roles.push(element);
            } else {
                //user.roles.pop(element); <-- meka welawkt hariyann naa waradi ek tmi pop wenn welawkt(pop karanna wenne anthimata enter wuna item eka misak apita one eka neme wenna puluwan,,e nisa index walin yanawa)
                //ek nisa e wenuwata map eken me wade krgnn puluwn 
                //map() --> ek element ekk tiyen id ek illganno 
                //splice() --> dena index ekata adala element ek remove krno
                let extIndex = user.roles.map(role => role.id).indexOf(element.id);
                if (extIndex != -1) {
                    user.roles.splice(extIndex, 1);
                }
            }
        }

        //uda hagaththa ewa piliwelata append krgen yano
        div.appendChild(input);
        div.appendChild(label);

        rolesDiv.appendChild(div);

        if (userPrivilege.priviinsert) {
            btnUserAdd.disabled = "";
        } else {
            btnUserAdd.disabled = "disabled"
        }

    });

    //form ek refersh weddi ar thibba widihata mek unchecked krl hdagnnd epai
    user.status = false;
    userStatus.checked = false;
    userStatusLabel.innerText = "User account is NOT acctive"

    //kenekw add krl form ek refersh weddi 
    nameEmployee.style.border = "1px solid #ced4da";
    textUserName.style.border = "1px solid #ced4da";
    userPassword.style.border = "1px solid #ced4da";
    userRePassword.style.border = "1px solid #ced4da";
    userEmail.style.border = "1px solid #ced4da";
    textNote.style.border = "1px solid #ced4da";
}

//define fn ckeckerror 
const checkFormError = () => {

    //errors tibboth errors return krgnn oni nisa tmi mek gnn
    let errors = '';
    //let errors; dammoth undifed kiyl tmi check krnn oni

    if (user.employee_id == null) {
        errors = errors + "Please Select Employee Name.. \n";
    }
    if (user.username == null) {
        errors = errors + "Please Enter User Name \n";
    }
    if (user.password == null) {
        errors = errors + "Please Enter Password \n";
    }
    //bind wenn field ekk naa, ek nisa html eken tag id ek arnn tmi check krnn ekai ek null nathuw emptyd kiyl blnn
    if (userRePassword.value == "") {
        errors = errors + "Please Enter your Password again \n";
    }
    if (user.email == null) {
        errors = errors + "Please Enter Email \n";
    }
    if (user.roles.length == null) {
        errors = errors + "Please Select Role... \n";
    }

    return errors;
}

const userSubmit = () => {
    //1) button ek wadad n object ek pass wenod blnnd  
    console.log("submit");
    console.log(user);

    //2) check errors
    const errors = checkFormError();
    if (errors == "") {
        //3) get user confirmation
        let userConfirm = confirm("Are you sure to SAVE following user details..? \n" +
            "User Name : " + user.username + "\n" +
            "Email : " + user.email);
        if (userConfirm) {
            //4) call post request 
            let serverResponce = ajaxHTTPRequest("/user", "POST", user);
            //5) check post service response 
            if (serverResponce == "OK") {
                alert("Save Successfully ✔");
                refershUserTable();
                formUser.reset();
                refershUserForm();
                $('#offcanvasUserAdd').offcanvas('hide');
            } else {
                alert("Fail to submit User ❌ \n" + serverResponce);
            }
        }
    } else {
        alert("The form has following errors... please check the form again..\n" + errors);
    }

}

const refillUserForm = (ob) => {
    //1) check button
    console.log("refill");

    //disable krl tibba update button ek enable krno
    btnUserUpdate.disabled = false;

    //2) define user n oldUser object
    //JSON. parse() : This method takes a JSON string and then transforms it into a JavaScript object.
    //assign table row object into user object
    //object ek  string wlt covert kre user ek update krddi oldUser ekath update nowi tiyennd oni nisa 
    user = JSON.parse(JSON.stringify(ob));
    oldUser = JSON.parse(JSON.stringify(ob));

    //open user form
    $('#offcanvasUserAdd').offcanvas('show');

    //get data list for fill dynamic select element
    employeeListWithoutUserAccount = ajaxGetRequest("/employee/listwithoutuseraccount");
    employeeListWithoutUserAccount.push(user.employee_id);
    fillDataIntoSelect2(nameEmployee, "Select Employee", employeeListWithoutUserAccount, "nic", "fullname", user.employee_id.nic);

    nameEmployee.disabled = true;

    //get role list for refill roles 
    roleList = ajaxGetRequest("/role/getRoleListWithoutAdmin");
    rolesDiv.innerHTML = "";
    rolesDiv.innerHTML = '<label class="col-4 col-form-label fw-bold text-start"> Role : <span class="text-danger">*</span> </label>';
    roleList.forEach(element => {
        let div = document.createElement('div');
        div.className = "form-check form-check-inline";
        let input = document.createElement('input');
        input.classList.add('form-check-input');
        input.type = "checkbox";
        let label = document.createElement('label');
        label.classList.add('form-check-label');
        label.innerText = element.name;

        input.onchange = function () {
            if (this.checked) {
                user.roles.push(element);
            } else {
                //user.roles.pop(element); <-- meka welawkt hariyann naa waradi ek tmi pop wenn welawkt
                //ek nisa e wenuwata map eken me wade krgnn puluwn 
                //map() --> ek element ekk tiyen id ek illganno 
                //splice() --> dena index ekata adala element ek remove krno
                let extIndex = user.roles.map(role => role.id).indexOf(element.id);
                if (extIndex != -1) {
                    user.roles.splice(extIndex, 1);
                }
            }
        }
        //adala check boxes checkd kiyl balal check krwno
        let extIndex = user.roles.map(role => role.id).indexOf(element.id);
        if (extIndex != -1) {
            input.checked = true;
        }
        div.appendChild(input);
        div.appendChild(label);

        rolesDiv.appendChild(div);
    });

    if (user.status) {
        userStatus.checked = true;
        userStatusLabel.innerText = 'User Account is Active';
    } else {
        userStatus.checked = false;
        userStatusLabel.innerText = 'User Account is NOT Active';
    }

    //set value into ui element
    //elementId.value = object.property
    textUserName.value = user.username;
    userPassword.value = user.password;
    userRePassword.value = user.password;
    userEmail.value = user.email;
    textNote.value = user.note;

    if (userPrivilege.priviupdate) {
        btnUserUpdate.disabled = "";
    } else {
        btnUserUpdate.disabled = "disabled"
    }
}

//create function for check form updates
const checkFormUpdate = () => {
    let updates = "";

    if (user.employee_id.id != oldUser.employee_id.id) {
        updates = updates + "Employee changed \n";
    }
    if (user.username != oldUser.username) {
        updates = updates + "Username is changed \n";
    }
    if (user.password != oldUser.password) {
        updates = updates + "Password is changed \n";
    }
    if (user.email != oldUser.email) {
        updates = updates + "Email is changed \n";
    }
    if (user.status != oldUser.status) {
        updates = updates + "Status is changed \n";
    }
    if (user.note != oldUser.note) {
        updates = updates + "Note is changed \n";
    }
    //explain this---------------------------------------------------------------------------????????????????????????????????
    if (user.roles.length != oldUser.roles.length) {
        alert("role changed");
    } else {
        for (let element of user.roles) {
            let existRoleCount = oldUser.roles.map(item => item.id).indexOf(element.id);

            if (existRoleCount == -1) {
                updates = updates + " role has changed";
                break;
            }
        }
    }
    return updates;
}

const userUpdate = (ob) => {
    console.log("Update");
    console.log(user);
    console.log(oldUser);

    //check errors
    let errors = checkFormError();
    if (errors == "") {
        //check available update 
        let updates = checkFormUpdate();
        if (updates == "") {
            alert("Nothing to Update..!");
        } else {
            //get user confirmation
            let userConfirm = confirm("Are you sure to UPDATE following record? \n" + updates);

            if (userConfirm) {
                //call put service
                let putServiceResponce = ajaxHTTPRequest("/user", "PUT", user);
                //check put service response 
                if (putServiceResponce == "OK") {
                    alert("Update Successfully ✔");
                    refershUserTable();
                    formUser.reset();
                    refershUserForm();
                    $('#offcanvasUserAdd').offcanvas('hide');
                } else {
                    alert("Fail to update User ❌ \n" + putServiceResponce);
                }
            }
        }
    } else {
        alert("Form has some errors... please check the form again..\n" + errors);
    }
}

const deleteUser = (ob) => {
    //1) check buuton 
    console.log("delete");

    //2) get user confirmation 
    let userConfirm = confirm("Are you sure to DELETE following user accounut..? \n" +
        "User Name : " + ob.username + "\n" +
        "Email : " + ob.email);
    if (userConfirm) {
        //3) call DELETE request
        let deleteserverResponce = ajaxHTTPRequest("/user", "DELETE", ob);
        //4) check delete service response
        if (deleteserverResponce == "OK") {
            alert("Delete Successfully ✔");
            refershUserTable();
        } else {
            alert("Fail to delete User ❌ \n" + deleteserverResponce)
        }
    }
}

const printUser = (ob, rowIndex) => {
    console.log("print");
    let newWindow = window.open();
    newWindow.document.write(
        "<head>" +
        " <link rel='stylesheet' href='resources/bootstrap-5.3.1-dist/bootstrap-5.3.1-dist/css/bootstrap.min.css'></link>"
        + "</head>" +
        "<body>" + "<table class='table table-primary table-bordered'>" +
        "<thead>" +
        "<tr>" +
        "<th>Employee Name</th>" +
        "<th>User Name</th>" +
        "<th>Email</th>" +
        "<th>Role</th>" +
        "</tr>" +
        "</thead>" +
        "<tbody>" +
        "<tr>" +
        "<td>" + ob.employee_id.name + "</td>" +
        "<td>" + ob.username + "</td>" +
        "<td>" + ob.email + "</td>" +
        "<td>" + ob.roles + "</td>" +
        "</tbody>" +
        "</table>" +
        "</body>"
    );
    setTimeout(function () {
        newWindow.print()
    }, 500)
}

//generatr user email auto
const generateEmail = () => {
    userEmail.value = JSON.parse(nameEmployee.value).email;  //set value
    user.email = userEmail.value; //bind value
    userEmail.style.border = "2px solid green";
}


