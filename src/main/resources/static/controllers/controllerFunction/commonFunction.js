//define function for ajax get request
const ajaxGetRequest = (url) => {
    let servicesResponce;

    $.ajax(url, {
        async: false,
        type: "GET",
        contentType: 'json',
        success: function (data) {
            console.log("success");
            console.log(url);
            console.log(data);
            servicesResponce = data;
        },

        error: function (resOb) {
            console.log("error");
            console.log(url);
            console.log(resOb);
            servicesResponce = [];
        }

    });

    return servicesResponce;
}

//define function for ajax get request
//request body eke tmi me 3 dena ynn
const ajaxHTTPRequest = (url, method, ob) => {

    let serverResponce;

    $.ajax(url, {
        type: method,
        async: false,
        contentType: "application/json",
        data: JSON.stringify(ob),
        success: function (data) {
            console.log("success" + data);
            serverResponce = data;
        },
        error: function (resOb) {
            console.log("failed : " + resOb);
            serverResponce
        }
    });

    return serverResponce;

}