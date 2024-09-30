window.addEventListener('load', () => {
    //mek methanin load krnn form eke withrak nwi table eketh button tiyenonh privilege balal enable/disable wennd oni
    userPrivilege = ajaxGetRequest("/privilage/bymodule/INVENTORY");
    refreshInventoryTable();
});

const refreshInventoryTable = () => {

    inventory = {};

    //pass the data in db to the table
    inventorys = ajaxGetRequest("/inventory/printall");

    //text --> string, number, date
    //function --> object,array, boolean --> craete function 
    //column count == object count
    //piliwelata dann
    const displayProperty = [
        { dataType: 'function', propertyName: getIngredientName },
        { dataType: 'text', propertyName: 'reservedate' },
        { dataType: 'text', propertyName: 'expiredate' },
        { dataType: 'text', propertyName: 'totalqty' },
        { dataType: 'text', propertyName: 'availableqty' },
        { dataType: 'text', propertyName: 'removeqty' },
    ];

    //call fillDataIntoTable function (tableId,dataList,displayPropertyArrayName,editFunctionName, deleteFuctionName,PrintFuctionName)
    fillDataIntoTableWithPrint(tableInventory, inventorys, displayProperty, printInventory, true, userPrivilege);

    //basicma jquery datatable active krgnn widiha
    $('#tableInventory').dataTable();
}

const getIngredientName = (ob) => {
    return ob.ingredients_id.name;
}

const printInventory = (rowOb, rowIndex) => {

    //open view details
    $('#inventoryViewModal').modal('show');

    viewIng.innerHTML = rowOb.ingredients_id.name;
    viewRDate.innerHTML = rowOb.reservedate;
    viewEDate.innerHTML = rowOb.expiredate;
    viewAQty.innerHTML = rowOb.availableqty;
    viewRQty.innerHTML = rowOb.removeqty;
    viewTQty.innerHTML = rowOb.totalqty;
    viewBatchNumber.innerHTML = rowOb.batch_number;
}

const btnPrintRow = () => {
    console.log("print");
    console.log(inventory);

    let newWindow = window.open();
    newWindow.document.write("<html><head>" +
        "<link rel='stylesheet' href='resources/bootstrap-5.3.1-dist/bootstrap-5.3.1-dist/css/bootstrap.min.css'></link>" +
        "<title>" + "Inventoty Details" + "</title>"
        + "</head><body>" +
        printInventoryTable.outerHTML + "<script>printInventoryTable.classList.remove('d-none');</script></body></html>"
    );

    setTimeout(() => {
        newWindow.stop();//table ek load wena ek nawathinw
        newWindow.print();//table ek print weno
        newWindow.close();//aluthin open una window tab ek close weno
        //ar data load wenn nm  time out ekk oni weno aduma 500k wth
    }, 500)
}