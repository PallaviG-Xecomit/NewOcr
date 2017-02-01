'use strict';

app.home = kendo.observable({
    onShow: function() {},
    afterShow: function() {
        app.home.takeNewRead();
    }
});

app.home.takeNewRead = function()
{
    $("#trNewRead").hide();
    $("#scanCount").val('0');
    app.home.localScan();

    var div = document.getElementById('output');
    while (div.hasChildNodes()) {
        div.removeChild(div.lastChild);
    }

}

app.home.localScan = function()
{
    try
    {
        $("#aScan").hide(); 
        $("#trInput").show();
        $("#trSave").hide();  
        cordova.exec(app.home.scanSuccess, app.home.scanFailure, "AnylineSDK", 'ANALOG_METER', app.home.energyConfig);        
    }
    catch(Error)
    {
        alert(Error);
    }
}

app.home.energyConfig =  [
        "eyAiYW5kcm9pZElkZW50aWZpZXIiOiBbICJpby5hbnlsaW5lLmV4YW1wbGVzLmNvcmRvdmEiIF0sICJkZWJ1Z1JlcG9ydGluZyI6ICJvbiIsICJpb3NJZGVudGlmaWVyIjogWyAiaW8uYW55bGluZS5leGFtcGxlcy5jb3Jkb3ZhIiBdLCAibGljZW5zZUtleVZlcnNpb24iOiAyLCAibWFqb3JWZXJzaW9uIjogIjMiLCAicGluZ1JlcG9ydGluZyI6IHRydWUsICJwbGF0Zm9ybSI6IFsgImlPUyIsICJBbmRyb2lkIiBdLCAic2NvcGUiOiBbICJBTEwiIF0sICJzaG93V2F0ZXJtYXJrIjogdHJ1ZSwgInRvbGVyYW5jZURheXMiOiAxLCAidmFsaWQiOiAiMjAxOC0wMS0zMCIgfQowYnYrOVRqbWtxWkJxc1pSL3hmNnNaaWNSVzFOSkJ3aHFpdGdGb2xXMEp1VHlZWHR4RkpTVWhnYUE5SVcvYzlHCmxQdW9MUGVyYlVFdHBySzVSSXdqOGIzbjRvSmpWakpFakdhb2p3Umcxdzd4L1RrYnZJb3RyZXIvWkJRdEd5eSsKMGZObk1CTGQrRFY2WmhWNW1URDBUWmxobkIzdEhEcGN1WmNWSkVDNzc3WldHb0tWT1BzdzJyMWVkZVpMSGcyQwpqZG9lbnUwSGdXVjZzRFgxMUJwSVpLZDJHSzZ0TUxGaXJiYnJLbDBpR3FWZlBqbFd3TjM4VE1mMEtzM2xkVGM0ClV2VzZOcFlLVk41bGcxRU4rc2pWMHZIZDhUVVhZVmg0YmVEdFRveTVPRzRzRzlwQUd6WVZnWUI1UVNNNlZNWnAKc2p5SExzblBGQkRjWHVmRDZ4OUN2Zz09Cg==",
        {
            "captureResolution": "720p",

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
        $("#aScan").show();  
        $("#trInput").hide();  
        var div = document.getElementById('imgScanned');
        while (div.hasChildNodes()) {
            div.removeChild(div.lastChild);
        }    
        return;
    }

    alert("Error:" + error);
} 

app.home.addResult = function()
{
    var currentText = $("#txtText").val();
    var prevText = $("#output").html();
    if(prevText == "")
        prevText = "</br><div style='font-size: large; font-weight: bold;'>Result</div>"
    $("#output").html(prevText +"</br>"+currentText);
    var cntText = $("#scanCount").val();
    var cntNum = parseInt(cntText);
    cntNum = cntNum + 1;
    $("#scanCount").val(cntNum.toString());
    //alert(cntNum);
    $("#txtText").val("");
    $("#trSave").hide();
    var div = document.getElementById('imgScanned');
    while (div.hasChildNodes()) {
        div.removeChild(div.lastChild);
    }
    if(cntNum < 5)
        app.home.localScan();
    else
    {
        $("#trNewRead").show();
        $("#trInput").hide();
    }

};

app.home.newScan = function()
{
    app.home.takeNewRead();
}

app.home.cancelResult = function()
{
    app.home.localScan();
}

app.home.scanSuccess = function (result) {
        //this is called for every energy scan result
        //the result is a json-object containing the reading the meter type and a path to a cropped and a full image.
        //alert("Energy result: " + JSON.stringify(result));
        
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
        }
        catch(error)
        {
            alert(error);
        }

        //document.getElementById("details_scan_modes").removeAttribute("open");
        //document.getElementById("details_results").setAttribute("open", "");
}

app.localization.registerView('home');

// START_CUSTOM_CODE_home
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes

// END_CUSTOM_CODE_home