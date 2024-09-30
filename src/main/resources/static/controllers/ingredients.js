window.addEventListener('load', () => {

    //mek methanin load krnn form eke withrak nwi table eketh button tiyenonh privilege balal enable/disable wennd oni
    userPrivilege = ajaxGetRequest("/privilage/bymodule/INGREDIENT");

    refreshingredientsTable();
    refreshingredientsForm();
});

const refreshingredientsTable = () => {
    //pass the data in db to the table
    ingredients = ajaxGetRequest("/ingredients/printall");

    //text --> string, number, date
    //function --> object,array, boolean --> craete function 
    //column count == object count
    //piliwelata dann 
    const displayProperty = [
        { dataType: 'text', propertyName: 'name' },
        { dataType: 'text', propertyName: 'code' },
        { dataType: 'function', propertyName: getIngredientsCategory },
        { dataType: 'function', propertyName: getIngredientsStatus }
    ];

    //call fillDataIntoTable function (tableId,dataList,displayPropertyArrayName,editFunctionName, deleteFuctionName,PrintFuctionName)
    fillDataIntoTableWithoutPrint(tableIngredient, ingredients, displayProperty, ingredientsRefill, deleteingredients, true, userPrivilege);

    //me ara delete krl tiyen ekk aaye delete krnnd bari wennd hadala tiyenn
    ingredients.forEach((element, index) => {
        if (userPrivilege.prividelete && element.ingredientstatus_id.name == "Delete") {
            //table eke body ek allgen, eken table column ek allgen, eketh delete button ek allgnnd oni
            tableIngredient.children[1].children[index].children[5].children[1].disabled = "disabled";
            tableIngredient.children[1].children[index].children[5].children[1].style.cursor = "not-allowed";
        }
    });

    //basicma jquery datatable active krgnn widiha
    $('#tableIngredient').dataTable();
}

const getIngredientsCategory = (ob) => {
    return ob.ingredientcategory_id.name;
}
const getIngredientsStatus = (ob) => {
    if (ob.ingredientstatus_id.name == 'Available') {
        return '<span class="text-success fw-bold">Available</span>'
    } else {
        return '<span class="text-danger fw-bold">Delete</span>';
    }
}

const checkFormError = () => {
    let errors = "";

    if (ingredient.name == null) {
        errors = errors + "Please Enter Name \n";
        textName.style.background = 'rgba(255,0,0,0.1)';
    }
    if (ingredient.ingredientcategory_id == null) {
        errors = errors + "Please select Ingredient Category \n";
        slctIngredientCategory.style.background = 'rgba(255,0,0,0.1)';
    }
    if (ingredient.ingredientstatus_id == null) {
        errors = errors + "Please select Ingredient Status \n";
        slctIngredientStatus.style.background = 'rgba(255,0,0,0.1)';
    }
    return errors;
}

const IngredientSubmit = () => {
    //1)check the button
    console.log("Submit");
    console.log(ingredient);

    //2)check errors
    const errors = checkFormError();
    if (errors == "") {
        //3)get user confirmation
        let userConfirm = confirm("Are you sure to SAVE following Ingredient details..? \n" +
            "Ingredient Category : " + ingredient.ingredientcategory_id.name + "\n" +
            "Ingredient Name : " + ingredient.name);
        if (userConfirm) {
            //4)call post service
            let postServerResponce = ajaxHTTPRequest("/ingredients", "POST", ingredient);
            //5)check post service responce
            if (postServerResponce == "OK") {
                alert("Save Successfully ✔");
                refreshingredientsTable();
                fromIngredient.reset();
                refreshingredientsForm();
                $('#offcanvasIngredientAdd').offcanvas('hide');
            } else {
                alert("Fail to submit Service ❌ \n" + postServerResponce);
            }
        }
    } else {
        alert("The form has following errors... please check the form again..\n" + errors);
    }
}

const ingredientsRefill = (ob) => {
    console.log("Refil");

    btnIngredientUpdate.disabled = false;

    //JSON. parse() : This method takes a JSON string and then transforms it into a JavaScript object.
    //assign table row object into employee object
    //object ek  string wlt covert kre employee ek update krddi oldEmployee ekath update nowi tiyennd oni nisa
    ingredient = JSON.parse(JSON.stringify(ob));
    oldIngredient = JSON.parse(JSON.stringify(ob));

    //open employee offcanves
    $('#offcanvasIngredientAdd').offcanvas('show');

    //set value into ui element
    //elementId.value = object.property
    textName.value = ingredient.name;
    unitPriceText.value = ingredient.unitprice;
    textNote.value = ingredient.note;

    //fill wela tmi select wenn
    IngredientCategory = ajaxGetRequest("/ingredientscategory/list");
    fillDataIntoSelect(slctIngredientCategory, "Select Category", IngredientCategory, "name", ob.ingredientcategory_id.name);

    IngredientStatus = ajaxGetRequest("/ingredientsstatus/list");
    fillDataIntoSelect(slctIngredientStatus, "Select Status", IngredientStatus, "name", ob.ingredientstatus_id.name);

    btnIngredientSubmit.disabled = "disabled";

    if (userPrivilege.priviupdate) {
        btnIngredientUpdate.disabled = "";
    } else {
        btnIngredientUpdate.disabled = "disabled"
    }
}

const checkFormUpdate = () => {
    let updates = "";

    if (ingredient.name != oldIngredient.name) {
        updates = updates + "Name is changed " + oldIngredient.name + " into " + ingredient.name + "\n";
    }
    if (ingredient.unitprice != oldIngredient.unitprice) {
        updates = updates + "Unit Price is changed " + oldIngredient.unitprice + " into " + ingredient.unitprice + "\n";
    }
    if (ingredient.note != oldIngredient.note) {
        updates = updates + "Note is changed " + oldIngredient.note + " into " + ingredient.note + "\n";
    }
    if (ingredient.ingredientcategory_id.name != oldIngredient.ingredientcategory_id.name) {
        updates = updates + "Ingredient Category is changed " + oldIngredient.ingredientcategory_id.name + " into " + ingredient.ingredientcategory_id.name + "\n";
    }
    if (ingredient.ingredientstatus_id.name != oldIngredient.ingredientstatus_id.name) {
        updates = updates + "Ingredient status is changed " + oldIngredient.ingredientstatus_id.name + " into " + ingredient.ingredientstatus_id.name + "\n";
    }
    return updates;
}

const IngredientUpdate = () => {
    //1)check update button
    console.log("Update");
    console.log(ingredient);
    console.log(oldIngredient);
    //2)check form errors
    let errors = checkFormError();
    if (errors == "") {
        //3)check what we have to update 
        let updates = checkFormUpdate();
        if (updates == "") {
            alert("Nothing to Update..!");
        } else {
            //4)get user confirmation 
            let userConfirm = confirm("Are you sure to UPDATE following record? \n" + updates);
            if (userConfirm) {
                //5)call put service
                let putServiceResponce = ajaxHTTPRequest("/ingredients", "PUT", ingredient);
                //6)check put service responce
                if (putServiceResponce == "OK") {
                    alert("Update Successfully ✔");
                    refreshingredientsTable();
                    fromIngredient.reset();
                    refreshingredientsForm();
                    $('#offcanvasIngredientAdd').offcanvas('hide');
                } else {
                    alert("Fail to Update Service Details ❌ \n" + putServiceResponce);
                }
            }
        }
    } else {
        alert("Form has some errors... please check the form again..\n" + errors);
    }
}

const deleteingredients = (ob) => {
    //1)check button 
    console.log("Delete");
    //2)get user confirmation
    let userConfirm = confirm("Are you sure to DELETE following Ingredient Details..? \n" +
        "Ingredient Category : " + ob.ingredientcategory_id.name + "\n" +
        "Ingredient Name : " + ob.name);
    if (userConfirm) {
        //3)call delete request 
        let deleteserverResponce = ajaxHTTPRequest("/ingredients", "DELETE", ob);
        //4)check delete responce
        if (deleteserverResponce == "OK") {
            alert("Delete Successfully ✔");
            refreshingredientsTable();
        } else {
            alert("Fail to delete Ingredient ❌ \n" + deleteserverResponce)
        }
    }
}

const refreshingredientsForm = () => {

    ingredient = {};
    oldIngredient = null;

    IngredientCategory = ajaxGetRequest("/ingredientscategory/list");
    fillDataIntoSelect(slctIngredientCategory, "Select Category", IngredientCategory, "name");

    IngredientStatus = ajaxGetRequest("/ingredientsstatus/list");
    fillDataIntoSelect(slctIngredientStatus, "Select Status", IngredientStatus, "name", "Available");

    //reset form
    textName.style.border = "1px solid #ced4da";
    slctIngredientCategory.style.border = "1px solid #ced4da";
    unitPriceText.style.border = "1px solid #ced4da";
    slctIngredientStatus.style.border = "1px solid #ced4da";
    textNote.style.border = "1px solid #ced4da";

    ingredient.ingredientstatus_id = JSON.parse(slctIngredientStatus.value);
    slctIngredientStatus.style.border = "1px solid green";

    if (userPrivilege.priviinsert) {
        btnIngredientSubmit.disabled = "";
    } else {
        btnIngredientSubmit.disabled = "disabled"
    }
}

const ingTablePrint = () => {
    let newWindow = window.open();
    newWindow.document.write(
        "<html><head>" +
        "<link rel='stylesheet'href='resources/bootstrap-5.3.1-dist/bootstrap-5.3.1-dist/css/bootstrap.min.css'></link>" +
        "<title>" + "Ingredient Table" + "</title>"
        + "</head><body>" +
        "<h2>" + "Ingredient Table" + "</h2>" +
        tableIngredient.outerHTML
    );
    setTimeout(() => {
        newWindow.stop();
        newWindow.print();
        newWindow.close();
    }, 500)
}

