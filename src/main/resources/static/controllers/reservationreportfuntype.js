//browser onload event
window.addEventListener('load', () => {

    //mek methanin load krnn form eke withrak nwi table eketh button tiyenonh privilege balal enable/disable wennd oni
    userPrivilege = ajaxGetRequest("/privilage/bymodule/REPORT");
  
    functionTypes = ajaxGetRequest("/functiontype/list");
    fillDataIntoSelect(slctFunctionType, "Select Function Type", functionTypes, "name");
  
    reservations = ajaxGetRequest("/reservation/printall");
    reservations.sort((a, b) => b.id - a.id);
  
    refreshReservationReportTable();
  });
  
  
  //create function for refresh table
  const refreshReservationReportTable = () => {
  
    //text --> string, number, date
    //function --> object,array, boolean --> craete function 
    //column count == object count
    //piliwelata dann 
    const displayProperty = [
      { dataType: 'text', propertyName: 'reservationcode' },
      { dataType: 'function', propertyName: getCustomerName },
      { dataType: 'function', propertyName: getFunctionType },
      { dataType: 'text', propertyName: 'functiondate' },
      { dataType: 'text', propertyName: 'functionstarttime' },
      { dataType: 'text', propertyName: 'participatecount' },
      { dataType: 'function', propertyName: getTotalAmount },
      { dataType: 'function', propertyName: getReservationStatus }
    ];
  
    //call fillDataIntoTable function (tableId,dataList,displayPropertyArrayName,editFunctionName, deleteFuctionName,PrintFuctionName, buttonvisibility, privilegeob)
    fillDataIntoTableWithoutModify(tableReservationReport, reservations, displayProperty);
  
  }
  
  const getCustomerName = (ob) => {
    return ob.customer_id.name;
  }
  
  const getFunctionType = (ob) => {
    return ob.functiontype_id.name;
  }
  
  const getTotalAmount = (ob) => {
    return parseFloat(ob.totalprice).toFixed(2);
  }
  const getReservationStatus = (ob) => {
    if (ob.reservationstatus_id.name == 'Fully paid') {
      return '<span class="text-success fw-bold">Fully paid</span>'
    } else if (ob.reservationstatus_id.name == 'Completed') {
      return '<span class="text-success fw-bold">Completed</span>';
    } else if (ob.reservationstatus_id.name == 'Cancelled') {
      return '<span class="text-danger fw-bold">Cancelled</span>';
    } else if (ob.reservationstatus_id.name == 'Confirmed') {
      return '<span class="text-primary fw-bold">Confirmed</span>';
    } else {
      return '<span class="text-info fw-bold">Pending</span>';
    }
  }
  
  
  const resRepoTablePrint = () => {
    let newWindow = window.open();
    newWindow.document.write(
      "<html><head>" +
      "<link rel='stylesheet'href='/resources/bootstrap-5.3.1-dist/bootstrap-5.3.1-dist/css/bootstrap.min.css'></link>" + " <link rel='stylesheet' href='/resources/fontawesome-free-6.4.2-web/fontawesome-free-6.4.2-web/css/all.css'>" +
      "<title>" + "Reservation Report" + "</title>"
      + "</head><body>" +
      "<h2>" + "Reservation Report" + "</h2>" +
      tableReservationReport.outerHTML
    );
    setTimeout(() => {
      newWindow.stop();
      newWindow.print();
      newWindow.close();
    }, 500)
  }
  
  
  const generateReport = () => {
  
    reservations = ajaxGetRequest("/reservation/getresbydatesandfunctiontype?startDate=" + slctStartDate.value
      + "&endDate=" + slctEndDate.value + "&functiontype=" + JSON.parse(slctFunctionType.value).id);
  
    refreshReservationReportTable();
  }