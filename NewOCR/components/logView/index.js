'use strict';

app.logView = kendo.observable({
    onShow: function() {},
    afterShow: function() {
        //app.logView.showTemp();
        app.DALMeterReadings.getAllMeterReadings(app.logView.showAllReadings);
    }
});

app.logView.clearDiv = function(divToBeCleared)
{
    while (divToBeCleared.hasChildNodes()) {
            divToBeCleared.removeChild(divToBeCleared.lastChild);
        }
}

app.logView.showAllReadings = function(tx, allReading)
{
    try{
        var resDiv = document.getElementById('readingsList');
        app.logView.clearDiv(resDiv);
        var dynTable = document.createElement("table");
        dynTable.setAttribute("cellpadding","5px");
        dynTable.setAttribute("style","border: 1px solid black;");
        dynTable.setAttribute("width","100%");
        
        var dynRowHead = document.createElement("tr");
        var dynTh1 = document.createElement("th");
        dynTh1.innerHTML = "QR Code text";
        var dynTh2 = document.createElement("th");
        dynTh2.innerHTML = "Meter readings";                
        dynRowHead.appendChild(dynTh1);
        dynRowHead.appendChild(dynTh2);
        dynTable.appendChild(dynRowHead);

        var readingsData = [];
        var loc = '';
        for(var i=0; i < allReading.rows.length; i++) {
                readingsData.push( allReading.rows.item(i));
                if(loc != allReading.rows.item(i).locationDetails)
                {
                    loc = allReading.rows.item(i).locationDetails;
                    var dynTr = document.createElement("tr");
                    var dynTd = document.createElement("td");
                    dynTd.setAttribute("rowspan", 5);
                    dynTd.setAttribute("style","border: 1px solid black;");
                    
                    dynTd.setAttribute("width", "60%")
                    dynTd.innerHTML = app.logView.getformatedData(loc);
                    dynTr.appendChild(dynTd);

                    var dynReadTd1 = document.createElement("td");
                    dynReadTd1.setAttribute("style","border: 1px solid black;");
                    dynReadTd1.innerHTML = allReading.rows.item(i).reading;
                    dynTr.appendChild(dynReadTd1);
                    dynTable.appendChild(dynTr);

                    for(var j=i+1; j<i+5;j++)
                    {
                        var dynReadTr = document.createElement("tr");
                        var dynReadTd = document.createElement("td");
                        dynReadTd.setAttribute("style","border: 1px solid black;");
                        
                        dynReadTd.innerHTML = allReading.rows.item(j).reading;
                        dynReadTr.appendChild(dynReadTd);
                        dynTable.appendChild(dynReadTr); 
                    }

                }
        }

        //alert(dynTable.innerHTML);
        resDiv.appendChild(dynTable);
        
        /*var datasource = new kendo.data.DataSource({
            data : readingsData,
            type: "json"
        });
                    
        $('#readingsList').kendoMobileListView({
            dataSource 	:  datasource,
            template	:  $("#readingsTemplate").text()
        });
        */
        app.fileHandler.writeToFile(JSON.stringify(readingsData));
        
    }
    catch(err)
        {
            alert(err.message);
        }
}

app.logView.getformatedData = function(textToBeShown)
{
    var resultText = '';
    var isJson = false;
    //alert(textToBeShown);
    try{    var jResult = $.parseJSON(textToBeShown); isJson = true;}
    catch(error){} 
    if(isJson)
    {

    $.each(jResult, function( key, val ) {
                    //alert(key);
                    //alert(val);
                    resultText = resultText + key + ':' + val + ' ';  
                    //alert(resultText);
                }); 
    }
    else
    {
        resultText = textToBeShown;
    }
    return resultText;
}

var data = kendo.observable({
    customers: [{
        customerName: "Bob",
        notes: "Wants his order by Saturday",
        reading1:1244,
        reading2:12453

    },{
        customerName: "Jim",
        notes: "Owes us $300",
        reading1:1233,
        reading2:124556
    },{
        customerName: "Anton",
        notes: "2 items outstanding on last order",
        reading1:12222,
        reading2:1233333
    }]
});




app.logView.showTemp = function()
{


$('#listview').kendoMobileListView({
    dataSource:{data:data.customers},
    template: kendo.template($('#customer-template').html())
});



}
function renderNotesTemplate(data) {
    return kendo.Template.compile($('#notes-template').html())(data);
}

app.localization.registerView('logView');

// START_CUSTOM_CODE_logView
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes

// END_CUSTOM_CODE_logView