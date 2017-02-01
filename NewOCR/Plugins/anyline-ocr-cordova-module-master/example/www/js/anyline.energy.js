/*
 * Anyline Cordova Plugin
 * anyline.energy.js
 *
 * Copyright (c) 2016 Anyline GmbH
 */

if (anyline === undefined) {
    var anyline = {};
}
anyline.energy = {
    onResult: function (result) {
        alert(result);
        //this is called for every energy scan result
        //the result is a json-object containing the reading the meter type and a path to a cropped and a full image.

        console.log("Energy result: " + JSON.stringify(result));

        if (result.detectedBarcodes) {
            var detailsBarcodes = "";
            for (var i = 0; i < result.detectedBarcodes.length; i++) {
                detailsBarcodes += result.detectedBarcodes[i].value;
                detailsBarcodes += " (" + result.detectedBarcodes[i].format + ")";
                if (i < result.detectedBarcodes.length - 1) {
                    detailsBarcodes += ", ";
                }
            }
        }
        var div = document.getElementById('results');

        div.innerHTML = "<p>"
            + "<img src=\"" + result.imagePath + "\" width=\"100%\" height=\"auto\"/><br/>"
            + "<b>" + result.meterType + ":</b> " + result.reading
            + (detailsBarcodes ? "<br/><i><b>Detected Barcodes:</b> " + detailsBarcodes + "</i>" : "")
            + "</p>"
            + div.innerHTML;

        document.getElementById("details_scan_modes").removeAttribute("open");
        document.getElementById("details_results").setAttribute("open", "");
    },

    onError: function (error) {
        //called if an error occurred or the user canceled the scanning
        if (error == "Canceled") {
            //do stuff when user has canceled
            // this can be used as an indicator that the user finished the scanning if canclelOnResult is false
            console.log("Energy scanning canceled");
            return;
        }

        alert("Error: " + error);
    },

    energyConfig: [
        "eyAiYW5kcm9pZElkZW50aWZpZXIiOiBbICJpby5hbnlsaW5lLmV4YW1wbGVzLmNv"+
        "cmRvdmEiIF0sICJkZWJ1Z1JlcG9ydGluZyI6ICJvbiIsICJpb3NJZGVudGlmaWVy"+
        "IjogWyAiaW8uYW55bGluZS5leGFtcGxlcy5jb3Jkb3ZhIiBdLCAibGljZW5zZUtl"+
        "eVZlcnNpb24iOiAyLCAibWFqb3JWZXJzaW9uIjogIjMiLCAicGluZ1JlcG9ydGlu"+
        "ZyI6IHRydWUsICJwbGF0Zm9ybSI6IFsgImlPUyIsICJBbmRyb2lkIiBdLCAic2Nv"+
        "cGUiOiBbICJBTEwiIF0sICJzaG93V2F0ZXJtYXJrIjogdHJ1ZSwgInRvbGVyYW5j"+
        "ZURheXMiOiAxLCAidmFsaWQiOiAiMjAxOC0wMS0zMCIgfQowYnYrOVRqbWtxWkJx"+
        "c1pSL3hmNnNaaWNSVzFOSkJ3aHFpdGdGb2xXMEp1VHlZWHR4RkpTVWhnYUE5SVcv"+
        "YzlHCmxQdW9MUGVyYlVFdHBySzVSSXdqOGIzbjRvSmpWakpFakdhb2p3Umcxdzd4"+
        "L1RrYnZJb3RyZXIvWkJRdEd5eSsKMGZObk1CTGQrRFY2WmhWNW1URDBUWmxobkIz"+
        "dEhEcGN1WmNWSkVDNzc3WldHb0tWT1BzdzJyMWVkZVpMSGcyQwpqZG9lbnUwSGdX"+
        "VjZzRFgxMUJwSVpLZDJHSzZ0TUxGaXJiYnJLbDBpR3FWZlBqbFd3TjM4VE1mMEtz"+
        "M2xkVGM0ClV2VzZOcFlLVk41bGcxRU4rc2pWMHZIZDhUVVhZVmg0YmVEdFRveTVP"+
        "RzRzRzlwQUd6WVZnWUI1UVNNNlZNWnAKc2p5SExzblBGQkRjWHVmRDZ4OUN2Zz09"+
        "Cg==",
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
            "beepOnResult": true,
            "vibrateOnResult": true,
            "blinkAnimationOnResult": true,
            "cancelOnResult": true,
            "reportingEnabled": true
        },
        {"nativeBarcodeEnabled": true}

    ],

    energyConfigWithSegment: [
        "eyAiYW5kcm9pZElkZW50aWZpZXIiOiBbICJpby5hbnlsaW5lLmV4YW1wbGVzLmNv"+
        "cmRvdmEiIF0sICJkZWJ1Z1JlcG9ydGluZyI6ICJvbiIsICJpb3NJZGVudGlmaWVy"+
        "IjogWyAiaW8uYW55bGluZS5leGFtcGxlcy5jb3Jkb3ZhIiBdLCAibGljZW5zZUtl"+
        "eVZlcnNpb24iOiAyLCAibWFqb3JWZXJzaW9uIjogIjMiLCAicGluZ1JlcG9ydGlu"+
        "ZyI6IHRydWUsICJwbGF0Zm9ybSI6IFsgImlPUyIsICJBbmRyb2lkIiBdLCAic2Nv"+
        "cGUiOiBbICJBTEwiIF0sICJzaG93V2F0ZXJtYXJrIjogdHJ1ZSwgInRvbGVyYW5j"+
        "ZURheXMiOiAxLCAidmFsaWQiOiAiMjAxOC0wMS0zMCIgfQowYnYrOVRqbWtxWkJx"+
        "c1pSL3hmNnNaaWNSVzFOSkJ3aHFpdGdGb2xXMEp1VHlZWHR4RkpTVWhnYUE5SVcv"+
        "YzlHCmxQdW9MUGVyYlVFdHBySzVSSXdqOGIzbjRvSmpWakpFakdhb2p3Umcxdzd4"+
        "L1RrYnZJb3RyZXIvWkJRdEd5eSsKMGZObk1CTGQrRFY2WmhWNW1URDBUWmxobkIz"+
        "dEhEcGN1WmNWSkVDNzc3WldHb0tWT1BzdzJyMWVkZVpMSGcyQwpqZG9lbnUwSGdX"+
        "VjZzRFgxMUJwSVpLZDJHSzZ0TUxGaXJiYnJLbDBpR3FWZlBqbFd3TjM4VE1mMEtz"+
        "M2xkVGM0ClV2VzZOcFlLVk41bGcxRU4rc2pWMHZIZDhUVVhZVmg0YmVEdFRveTVP"+
        "RzRzRzlwQUd6WVZnWUI1UVNNNlZNWnAKc2p5SExzblBGQkRjWHVmRDZ4OUN2Zz09"+
        "Cg==",
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
                "alignment": "top_left"
            },
            "beepOnResult": true,
            "vibrateOnResult": true,
            "blinkAnimationOnResult": true,
            "cancelOnResult": true,
            "reportingEnabled": true,
            "segment": {
                "titles": ["Analog", "Digital"],
                "modes": ["ELECTRIC_METER", "DIGITAL_METER"],
                "tintColor": "CCCCCC",
                "offset": {
                    "x": 0,
                    "y": 600
                }
            }
        },
        {"nativeBarcodeEnabled": true}
    ],

    heatConfigWithSegment: [
        "eyAiYW5kcm9pZElkZW50aWZpZXIiOiBbICJpby5hbnlsaW5lLmV4YW1wbGVzLmNv"+
        "cmRvdmEiIF0sICJkZWJ1Z1JlcG9ydGluZyI6ICJvbiIsICJpb3NJZGVudGlmaWVy"+
        "IjogWyAiaW8uYW55bGluZS5leGFtcGxlcy5jb3Jkb3ZhIiBdLCAibGljZW5zZUtl"+
        "eVZlcnNpb24iOiAyLCAibWFqb3JWZXJzaW9uIjogIjMiLCAicGluZ1JlcG9ydGlu"+
        "ZyI6IHRydWUsICJwbGF0Zm9ybSI6IFsgImlPUyIsICJBbmRyb2lkIiBdLCAic2Nv"+
        "cGUiOiBbICJBTEwiIF0sICJzaG93V2F0ZXJtYXJrIjogdHJ1ZSwgInRvbGVyYW5j"+
        "ZURheXMiOiAxLCAidmFsaWQiOiAiMjAxOC0wMS0zMCIgfQowYnYrOVRqbWtxWkJx"+
        "c1pSL3hmNnNaaWNSVzFOSkJ3aHFpdGdGb2xXMEp1VHlZWHR4RkpTVWhnYUE5SVcv"+
        "YzlHCmxQdW9MUGVyYlVFdHBySzVSSXdqOGIzbjRvSmpWakpFakdhb2p3Umcxdzd4"+
        "L1RrYnZJb3RyZXIvWkJRdEd5eSsKMGZObk1CTGQrRFY2WmhWNW1URDBUWmxobkIz"+
        "dEhEcGN1WmNWSkVDNzc3WldHb0tWT1BzdzJyMWVkZVpMSGcyQwpqZG9lbnUwSGdX"+
        "VjZzRFgxMUJwSVpLZDJHSzZ0TUxGaXJiYnJLbDBpR3FWZlBqbFd3TjM4VE1mMEtz"+
        "M2xkVGM0ClV2VzZOcFlLVk41bGcxRU4rc2pWMHZIZDhUVVhZVmg0YmVEdFRveTVP"+
        "RzRzRzlwQUd6WVZnWUI1UVNNNlZNWnAKc2p5SExzblBGQkRjWHVmRDZ4OUN2Zz09"+
        "Cg==",
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
                "alignment": "top_left"
            },
            "beepOnResult": true,
            "vibrateOnResult": true,
            "blinkAnimationOnResult": true,
            "cancelOnResult": true,
            "reportingEnabled": true,
            "segment": {
                "titles": ["Heat Meter 4", "Heat Meter 5", "Heat Meter 6"],
                "modes": ["HEAT_METER_4", "HEAT_METER_5", "HEAT_METER_6"],
                "tintColor": "CCCCCC",
                "offset": {
                    "x": 0,
                    "y": 600
                }
            }
        },
        {"nativeBarcodeEnabled": true}
    ],

    scan: function (scanMode) {
        console.log("start scan with mode " + scanMode);
        // start the Energy scanning for the given scan mode
        // pass the success and error callbacks, as well as the license key and the config to the plugin
        // see http://documentation.anyline.io/#anyline-config for config details
        // and http://documentation.anyline.io/#energy for energy-module details

        cordova.exec(this.onResult, this.onError, "AnylineSDK", scanMode, this.energyConfig);
    },

    scanElectricDigitalSegment: function () {
        // start the Energy scanning for the given scan mode
        // pass the success and error callbacks, as well as the license key and the config to the plugin
        // see http://documentation.anyline.io/#anyline-config for config details
        // and http://documentation.anyline.io/#energy for energy-module details
        cordova.exec(this.onResult, this.onError, "AnylineSDK", "ELECTRIC_METER", this.energyConfigWithSegment);
    },

    scanHeatMeterWithSegment: function () {
        // start the Energy scanning for the given scan mode
        // pass the success and error callbacks, as well as the license key and the config to the plugin
        // see http://documentation.anyline.io/#anyline-config for config details
        // and http://documentation.anyline.io/#energy for energy-module details
        cordova.exec(this.onResult, this.onError, "AnylineSDK", "HEAT_METER_4", this.heatConfigWithSegment);
    },

    scanElectricMeter: function () {
        //scanmode scanElectricMeter can also be used for backwards compatibility)
        this.execMode("ELECTRIC_METER");
    },

    scanGasMeter: function () {
        //scanmode scanGasMeter can also be used for backwards compatibility)
        this.execMode("GAS_METER");
    }
};
