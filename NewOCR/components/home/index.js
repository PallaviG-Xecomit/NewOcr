'use strict';
var analogScanCount; 
var jObj;
var isAnalog;

app.home = kendo.observable({
    onShow: function() {},
    afterShow: function() {
        jObj = new Object();
        app.home.scanQRCode(true);
    }
});

app.home.showHideReadings = function(shouldShow)
{
    if(!shouldShow){
        $("#trRdngHead").hide();
        $("#trRdngVal").hide();
        $("#trQrScan").hide();
        $("#trQrScanHead").hide()
        $("#trMeterType").hide();        
    }   
    else{
        $("#trInput").hide();
        $("#trQrScan").show();
        $("#trQrScanHead").show()
        $("#trMeterType").show();
    }   
}

app.home.readyForQr = function()
{
    $("#trInput").hide();
    $("#trSave").hide();  
    $("#trNewRead").hide();
    app.home.clearMeterReadings();    
}

app.home.clearMeterReadings = function()
{
    var divMeter = document.getElementById('output');
    while (divMeter.hasChildNodes()) {
        divMeter.removeChild(divMeter.lastChild);
    }
}



app.home.scanQRCode = function(disPrev)
{
    try
    {
        $("#lblQrRes").val();
        if(!disPrev)
        {
            if($("#qrResult").text().trim() != "")
                disPrev = confirm("Starting next set of readings. continue?");
        }
        if(!disPrev && $("#qrResult").text().trim() != "")
            return;

        app.home.clearQrReadings();
        app.home.readyForQr();
        app.home.showHideReadings(false);
    }
    catch(error)
    {
        alert(error);
    }
    if (!window.navigator.simulator) { 
        try {
            cordova.plugins.barcodeScanner.scan(
            app.home.processQrResult,
            app.home.qrError,
            {
                preferFrontCamera : false, // iOS and Android
                showFlipCameraButton : true, // iOS and Android
                showTorchButton : true, // iOS and Android
                torchOn: false, // Android, launch with the torch switched on (if available)
                prompt : "Place a barcode inside the scan area", // Android
                resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
                formats : "all but PDF_417 and RSS_EXPANDED", // default: all but PDF_417 and RSS_EXPANDED
                orientation : "default", // Android only (portrait|landscape), default unset so it rotates with the device
                disableAnimations : true, // iOS
                disableSuccessBeep: false // iOS
            }
        );} catch(e){ 
            //alert(e);
            alert("Error occured while scanning QR code. Please try again.");
            }
    }
    else
    {
        app.home.showDummyQRResult();
    }
}

app.home.qrError = function (error) {
          //alert("Scanning failed: " + error);
          alert("Error occured while scanning QR code. Please try again.");
      }

app.home.showDummyQRResult = function()
{
    
    var lblHeading = '';
    $("#qrResult").html(lblHeading);
    
    var jResult; 
    $("#trMeterType").show();

            var resText = 'sample text sample text sample text sample text';

            $("#qrText").val(resText);

            var isJson = true;
            //alert($.type(resText));

            try {jResult = $.parseJSON(resText);}
            catch(e) {isJson = false;}
            
            if(isJson)
            {
                $.each(jResult, function( key, val ) {
                    var entry = val[0];                
                    for (name in entry) {
                        if (entry.hasOwnProperty(name)) {
                            var lblCaption = '<label>' + name + ':</label>';
                            var lblValue = '<label><b>' + entry[name] + '</label></b></br>';
                            var finalAttr =  lblCaption + lblValue;
                            $("#qrResult").html($("#qrResult").html()+finalAttr);
                            app.home.showHideReadings(true);
                            jObj[name] = entry[name];
                        }
                    }
                }); 
            }
            else
            {
                app.home.showHideReadings(true);
                $("#qrResult").html($("#qrResult").html()+resText);
            }
            
            analogScanCount = 0; 
}

app.home.processQrResult = function (result) {

        //app.home.getFormatedText("qrResult");
        if(result.text == "")
        {
            alert("Please try again.");
        }
        else
        {

            var lblHeading = '';
            $("#qrResult").html(lblHeading);

            var jResult; 
            
            $("#trMeterType").show();
        
            $("#qrText").val(result.text);

            var isJson = true;
            //alert(result.text);

            try {jResult = $.parseJSON(result.text);}
            catch(e) {isJson = false;}
            //alert(isJson);
            if(isJson)
            {
                $.each(jResult, function( key, val ) {
                    var entry = val[0];                
                    for (name in entry) {
                        if (entry.hasOwnProperty(name)) {
                            var lblCaption = '<label>' + name + ':</label>';
                            var lblValue = '<label><b>' + entry[name] + '</label></b></br>';
                            var finalAttr =  lblCaption + lblValue;
                            $("#qrResult").html($("#qrResult").html()+finalAttr);
                            app.home.showHideReadings(true);
                            jObj[name] = entry[name];

                        }
                    }
                }); 
            }
            else
            {
                app.home.showHideReadings(true);
                $("#qrResult").html($("#qrResult").html()+result.text);
            }
            
            analogScanCount = 0; 
        } 
      }

app.home.takeNewRead = function(meterType)
{
    isAnalog = meterType;
    $("#trNewRead").hide();
    $("#scanCount").val('0');
    $("#trMeterType").hide(); 
    if(window.navigator.simulator)
        app.home.dummyMeterScan();
    else
        app.home.meterScan(isAnalog);
}

app.home.dummyMeterScan = function()
{
    try
    {
        $("#trInput").show();
        //$("#trSave").hide();  
        
        $("#txtText").val("123456789012345");
        $("#trSave").show();        
        try{
        var div = document.getElementById('imgScanned');
        while (div.hasChildNodes()) {
            div.removeChild(div.lastChild);
        }
        div.innerHTML = "<p>"
            + "<img src=\"" + result.imagePath + "\" width=\"100%\" height=\"auto\"/><br/>"
            + "</p>"
            + div.innerHTML;
        }
        catch(error)
        {
            //alert(error);
        }

    }
    catch(Error)
    {
        alert(Error);
    }
}

app.home.meterScan = function(isAnalog)
{
    try
    {
        $("#trInput").show();
        $("#trSave").hide();  
        if(isAnalog)
            cordova.exec(app.home.scanSuccess, app.home.scanFailure, "AnylineSDK", 'ANALOG_METER', app.home.energyConfig);
        else
            cordova.exec(app.home.scanSuccess, app.home.scanFailure, "AnylineSDK", 'DIGITAL_METER', app.home.energyConfig);
    }
    catch(Error)
    {
        alert(Error);
    }
}

app.home.energyConfig =  [
        "eyAiYW5kcm9pZElkZW50aWZpZXIiOiBbICJpby5hbnlsaW5lLmV4YW1wbGVzLmNvcmRvdmEiIF0sICJkZWJ1Z1JlcG9ydGluZyI6ICJvbiIsICJpb3NJZGVudGlmaWVyIjogWyAiaW8uYW55bGluZS5leGFtcGxlcy5jb3Jkb3ZhIiBdLCAibGljZW5zZUtleVZlcnNpb24iOiAyLCAibWFqb3JWZXJzaW9uIjogIjMiLCAicGluZ1JlcG9ydGluZyI6IHRydWUsICJwbGF0Zm9ybSI6IFsgImlPUyIsICJBbmRyb2lkIiBdLCAic2NvcGUiOiBbICJBTEwiIF0sICJzaG93V2F0ZXJtYXJrIjogdHJ1ZSwgInRvbGVyYW5jZURheXMiOiAxLCAidmFsaWQiOiAiMjAxOC0wMS0zMCIgfQowYnYrOVRqbWtxWkJxc1pSL3hmNnNaaWNSVzFOSkJ3aHFpdGdGb2xXMEp1VHlZWHR4RkpTVWhnYUE5SVcvYzlHCmxQdW9MUGVyYlVFdHBySzVSSXdqOGIzbjRvSmpWakpFakdhb2p3Umcxdzd4L1RrYnZJb3RyZXIvWkJRdEd5eSsKMGZObk1CTGQrRFY2WmhWNW1URDBUWmxobkIzdEhEcGN1WmNWSkVDNzc3WldHb0tWT1BzdzJyMWVkZVpMSGcyQwpqZG9lbnUwSGdXVjZzRFgxMUJwSVpLZDJHSzZ0TUxGaXJiYnJLbDBpR3FWZlBqbFd3TjM4VE1mMEtzM2xkVGM0ClV2VzZOcFlLVk41bGcxRU4rc2pWMHZIZDhUVVhZVmg0YmVEdFRveTVPRzRzRzlwQUd6WVZnWUI1UVNNNlZNWnAKc2p5SExzblBGQkRjWHVmRDZ4OUN2Zz09Cg==",
        {
            "captureResolution": "1080",
            "visualFeedback": {
                    "style": "CONTOUR_RECT",
                    "strokeWidth": 2,                    
                },
            "cutout": {
                "style": "rect",
                "alignment": "top",
                "offset": {
                    "x": 0,
                    "y": 120
                },
                "strokeWidth": 2,
                "cornerRadius": 4,
                "strokeColor": "FFFFFF",
                "outerColor": "000000",
                "outerAlpha": 0.3
            },
            "flash": {
                "mode": "manual",
                "alignment": "bottom_right"
            },
            "beepOnResult": false,
            "vibrateOnResult": true,
            "blinkAnimationOnResult": true,
            "cancelOnResult": true,
            "reportingEnabled": true
        },
        {"nativeBarcodeEnabled": false}

    ]
app.home.scanFailure = function (error) 
{
    //called if an error occurred or the user canceled the scanning
    if (error == "Canceled") {
        //do stuff when user has canceled
        // this can be used as an indicator that the user finished the scanning if canclelOnResult is false
        console.log("Energy scanning canceled");
        app.home.showHideReadings(true);
        var div = document.getElementById('imgScanned');
        while (div.hasChildNodes()) {
            div.removeChild(div.lastChild);
        }    
        return;
    }

    //alert("Error:" + error);
    alert("Error occured while scanning meter reading. Please try again.")
} 

app.home.addResult = function()
{    
    var currentText = $("#txtText").val();
    
    var currentImage =  $("#txtImageSrc").val();

    var prevText = $("#output").html();
    
    var prevImagePath = $("#outputImagePath").html();

    $("#output").html(prevText +"</br>"+currentText);
    
    $("#outputImagePath").html(prevImagePath +"</br>"+currentImage);

    $("#trRdngHead").show();
    $("#trRdngVal").show();

    var cntText = analogScanCount;
    var cntNum = parseInt(cntText);
    
    cntNum = cntNum + 1;    
    
    //jObj["reading"+cntNum.toString()] = $("#txtText").val();
    
    $("#scanCount").val(cntNum.toString());
    
    $("#MeterText").val($("#MeterText").val()+","+$("#txtText").val());
    $("#txtText").val("");
    $("#trSave").hide();

    var div = document.getElementById('imgScanned');
    while (div.hasChildNodes()) {
        div.removeChild(div.lastChild);
    }
    analogScanCount++;
    //alert(cntNum);
    if(cntNum < 5)
    {
        if(window.navigator.simulator)
            app.home.dummyMeterScan();
        else
            app.home.meterScan(isAnalog);        
    }
    else
    {
        $("#trNewRead").show();
        $("#trInput").hide();
        //alert(jObj.length);
         var finalJ = JSON.stringify(jObj);
         //alert("from");
         
    }

};

app.home.clearQrReadings = function()
{
    var divQR = document.getElementById('qrResult');
    while (divQR.hasChildNodes()) {
        divQR.removeChild(divQR.lastChild);
    }    
}

app.home.cancelResult = function()
{
    if(window.navigator.simulator)
        app.home.dummyMeterScan();
    else
        app.home.meterScan(isAnalog);
}

app.home.scanSuccess = function (result) {
        
        $("#txtText").val(result.reading);
        $("#trSave").show();        
        try{
        var div = document.getElementById('imgScanned');
        while (div.hasChildNodes()) {
            div.removeChild(div.lastChild);
        }
        div.innerHTML = "<p>"
            + "<img src=\"" + result.imagePath + "\" width=\"100%\" height=\"auto\"/><br/>"
            + "</p>"
            + div.innerHTML;
        $("#txtImageSrc").val(result.imagePath);    


        }
        catch(error)
        {
            //alert(error);
        }

        //document.getElementById("details_scan_modes").removeAttribute("open");
        //document.getElementById("details_results").setAttribute("open", "");
}
    
app.home.addToLog= function()
{
    try{

        var finalJ = JSON.stringify(jObj);
        if(finalJ == '{}')
            {
                var qrRes = $("#qrResult").text();
                finalJ = qrRes;
            }
         //alert("from");
         //app.fileHandler.writeToFile("Result:" +finalJ);

        //var txtQR = $("#qrResult").text();
        //app.home.getFormatedText($("#qrResult"));
        //alert(finalJ);
        app.DALLocations.addResult(finalJ, function(addedLocId){
            var txtOutPut = $("#output").html();
            var txtImageOutput = $("#outputImagePath").html();
            var meterReadings = txtOutPut.split("<br>");
            var imageReaderPaths = txtImageOutput.split("<br>");
            //alert(meterReadings.length);
            var i=0;
            for(i=0; i< meterReadings.length; i++)
            {
                if(meterReadings[i].trim() != "")
                    {
                        //alert(meterReadings[i]);

                        app.DALMeterReadings.addResult(addedLocId, meterReadings[i], imageReaderPaths[i], function(readingId){
                            
                            /*if(readingId == meterReadings.length - 1)
                            {
                                var cont = confirm("Data saved successfully. Do you want to continue scanning?");
                                if(cont)
                                    app.home.scanQRCode(true);
                            }*/
                        });
                    }
                if(i == meterReadings.length-1)
                {
                    alert("Data saved successfully");
                    $("#trNewRead").hide();
                }
                    
            }
        });
    }
    catch(error)
    {
        alert(error);
    }
    //var splitMeterText = txtMeter.split(',');
    //for(textd in splitMeterText)
    //{
        //alert(textd);
    //}

    //alert(txtQR + "   " + txtMeter);
}

    

app.localization.registerView('home');

// START_CUSTOM_CODE_home
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes

// END_CUSTOM_CODE_home