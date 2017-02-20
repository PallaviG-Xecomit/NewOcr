'use strict';

	var DALMeterReadings = {};
        
    DALMeterReadings.dropTable = function(){
        var db = app.DALMain.db;
        var dropTable = "DROP TABLE IF EXISTS MeterReadings";
        db.transaction(function(tx) { 
            tx.executeSql(dropTable, [], function(){}, function(tr, err){alert(err.message);}); 
        }); 
    };
    
    DALMeterReadings.createTable = function(callback){
        
        var db = app.DALMain.db; 
         
        var tblDef = "CREATE TABLE IF NOT EXISTS MeterReadings(readingID INTEGER, locationID INTEGER, reading Text, addedOn INTEGER);";	
                       

        db.transaction(function(tx) { 
             tx.executeSql(tblDef, [], function(){
             	if (callback != null){
                    callback();
                }    
             }, function(tx, err){alert(err.message);}); 
        });        
    };   
    
    DALMeterReadings.clearData = function(){
        var db = app.DALMain.db;
        var dropTable = "DELETE FROM MeterReadings";
         db.transaction(function(tx) { 
            tx.executeSql(dropTable, []); 
            //alert('data cleared');
        });        
    };
    
    DALMeterReadings.addResult = function(locId, textRead, callBack) { 
        var db = app.DALMain.db;
        var addedOn = commonScriptManager.parseDateMMDDYY(new Date()); 
        //alert(addedOn);
        try{
            DALMeterReadings.getMaxLocationId(function(txId, readingID)
            {
                console.log(readingID);
                //alert(readingID.rows.length);
                var maxId;
                if(readingID.rows.length == 0 || readingID.rows.item(0).mxLocId == null)
                    maxId = 1;
                else
                {
                    maxId = readingID.rows.item(0).mxLocId + 1;
                }
                //alert(maxId);
                db.transaction(function(tx) { 
                    tx.executeSql("INSERT INTO MeterReadings(readingID, locationID, reading, addedOn) VALUES (?, ?, ?, ?)", 
                                [locId, maxId, textRead, addedOn], 
                                callBack(maxId), 
                                DALMeterReadings.onError); 
                },
                function(tx, err){
                    alert('err.message');
                });   
            }); 
        }
        catch(err){
            alert(err.message);
        }
    } 
    
    DALMeterReadings.onSuccess = function(tx, results){
    };
    
    DALMeterReadings.onError = function(tr, err){
        alert(err.message);
    };
    
    DALMeterReadings.getMaxLocationId = function(callback){
        var db = app.DALMain.db;
        var updatedOn = new Date(); 
        db.transaction(function(tx) { 
            tx.executeSql("Select MAX(LocationId) AS mxLocId FROM MeterReadings", 
                          [], 
                          callback, 
                          DALMeterReadings.onError); 
        });         
    };
    
    DALMeterReadings.updateCompletion = function(projectID, percentComplete){
        var db = app.DALMain.db;
       	var updatedOn = new Date(); 
        db.transaction(function(tx) { 
            tx.executeSql("UPDATE MeterReadings SET  percentComplete = round(?, 2), updatedOn = ? WHERE ProjectID = ?", 
                          [percentComplete, updatedOn, projectID], 
                          DALMeterReadings.onSuccess, 
                          DALMeterReadings.onError); 
        });         
    };
    
    DALMeterReadings.getAllMeterReadings = function(resultsCallback){
        var db = app.DALMain.db;
        try{
             db.transaction(function(tx) { 
                    tx.executeSql('SELECT QRResults.locationDetails, MeterReadings.* FROM MeterReadings INNER JOIN QRResults ON QRResults.locationId = MeterReadings.locationID', [], resultsCallback,  DALMeterReadings.onError)  
            });
        }
        catch(err){
            alert(err.message);
        }
    };
    
    DALMeterReadings.getProject = function(projectID, resultsCallback){
        var db = app.DALMain.db;
        db.transaction(function(tx) { 
				tx.executeSql('SELECT * FROM MeterReadings WHERE ProjectID = ? ', [projectID], resultsCallback,  DALMeterReadings.onError)  
        });
    };
    
    DALMeterReadings.calculateCompletionStatus = function(projectID)
    {
        var db = app.DALMain.db;
        db.transaction(function(tx){
            tx.executeSql("SELECT (SELECT round(SUM(PercentComplete), 2) FROM Buildings WHERE ProjectID = ? AND IsDeleted = 0) / (SELECT Count(*) FROM Buildings WHERE ProjectID = ? AND IsDeleted = 0) as Percentage",
                          [projectID, projectID],
                          function(tx, result)
                            {
                                if(result.rows.length > 0)
                                    {
                                        DALMeterReadings.updateCompletion(projectID, result.rows.item(0).Percentage);
                                    }
                            }, 
                          DALMeterReadings.onError);
        });
    };
    
    DALMeterReadings.saveNotes = function(projectID, notes, resultsCallback)
    {
        var db = app.DALMain.db;
        var updateQuery = "UPDATE MeterReadings SET Notes = ? WHERE ProjectID = ? AND Status > 0";
        db.transaction(function(tx){
            tx.executeSql(updateQuery, [notes, projectID], resultsCallback, DALMeterReadings.onError);
        });
    };
    app.DALMeterReadings = DALMeterReadings;