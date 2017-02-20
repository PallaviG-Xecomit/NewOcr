'use strict';
var fileHandler = {};

fileHandler.getAppFilesRoot = function(){
        var devicePlatform = device.platform;
         switch(devicePlatform)
            {
                case "Android":
			        return cordova.file.applicationStorageDirectory;
                case "iOS":
			        return cordova.file.applicationStorageDirectory + "/Documents";
            }
    }; 

fileHandler.writeToFile = function(text){
        window.resolveLocalFileSystemURL(fileHandler.getAppFilesRoot(), function(dir) {
            //alert("got main dir",dir);
            dir.getFile("Readings.txt", {create:true}, function(file) {
                //alert("got the file", file);
                //app.fileHandler.writeLog(file,"App started");    
                //alert(text.toString()); 
                fileHandler.writeLog(file,text);   
            });
        });
    };

fileHandler.readFile = function(file)
{
    window.resolveLocalFileSystemURL(fileHandler.getAppFilesRoot(), function(dir) {
            //alert("got main dir",dir);
            dir.getFile("Readings.txt", {create:false}, function(fileEntry) {
               //alert('got file');
               fileEntry.file(function(file){

                var reader = new FileReader();
                reader.onloadend = function(e) {
                    //alert(this.result);
                    fileHandler.deleteFile(file);
                };
                reader.readAsText(file);
               }, function(evt) {
        //alert(evt.target.error.code);
    }
);
                
            });
        });
    
}

fileHandler.writeLog = function(logOb, str) {
    try{
        if(!logOb) return;
        var log = str + " [" + (new Date()) + "]\n";
        //alert("going to log ");
        logOb.createWriter(function(fileWriter) {
            
            //fileWriter.seek(fileWriter.length);
            fileWriter.seek(0);
            var blob = new Blob([log], {type:'text/plain'});
            fileWriter.write(blob);
            //alert("ok, in theory i worked");
            try{

            logOb.file(function(file) {
                var reader = new FileReader();

                reader.onloadend = function(e) {
                    //alert(this.result);
                };

                reader.readAsText(file);
            }, function(){alert('fail');});
            }
            catch(e)
            {
                //alert(e);
            }
        }, function(){alert("fail");});
    }
    catch(e)
    {
        //alert(e);
    }
}


fileHandler.uploadToServer = function () {
            window.resolveLocalFileSystemURL(fileHandler.getAppFilesRoot(), function(dir) {
                //alert("got main dir",dir);
                dir.getFile("Readings.txt", {create:false}, 
                    function(logOb) {
                     
                    fileHandler.bfrUpload(logOb);
                });
            });
         	        	
        };

fileHandler.bfrUpload = function(fileEntry)
{
    //alert(fileEntry.toURL());
                    
        var fileURI = fileEntry.toURL();
        var options = new FileUploadOptions(); 
        options.headers = { Connection: "close" }

        options.chunkedMode = true;
        options.fileKey = "file"; 
        var imagefilename = fileURI; 
        options.fileName = imagefilename.substr(fileURI.lastIndexOf('/') + 1);
        options.mimeType = "text/plain";
        
        var ft = new FileTransfer(); 
        alert("Data upload started");
        //fileHandler.readFile(fileEntry);
        ft.upload(fileURI, "http://api.marinecenterupload.com/MediaUploaderService.svc/SaveImage?location=TextFile", fileHandler.deleteFile, fileHandler.fail, options);
}


fileHandler.deleteFile = function(r)
    {
        //alert(r.response);
        //return;
        window.resolveLocalFileSystemURL(fileHandler.getAppFilesRoot()
                                    , function(dir) 
                                    {
                                        //alert("got main dir",dir);
                                        dir.getFile("Readings.txt", {create:false}
                                                    , function(fileEntry) {
                                                        fileEntry.remove(function(){alert('Data uploaded successfully.');}, null);
                                                        app.DALLocations.clearData();
                                                        app.DALMeterReadings.clearData();
                                                        //app.logView.clearDiv(resDiv);
                                                    });
                                    });
    }


fileHandler.win =   function(r) {
            //alert(jQuery.type(r));
            //alert(r.response);
    };

fileHandler.fail = function(error) {
            alert('upload error: ' + error.code + ": "+error.http_status+" ; source " + error.source+" ; target " + error.target );
            //fileHandler.deleteFile();
    };




app.fileHandler = fileHandler;


        
