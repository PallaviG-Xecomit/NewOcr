'use strict';

	var DALLocations = {};
        
    DALLocations.dropTable = function(){
        var db = app.DALMain.db;
        var dropTable = "DROP TABLE IF EXISTS QRResults";
        db.transaction(function(tx) { 
            tx.executeSql(dropTable, [], function(){}, function(tr, err){alert(err.message);}); 
        }); 
    };
    
    DALLocations.createTable = function(callback){
        
        var db = app.DALMain.db; 
         
        var tblDef = "CREATE TABLE IF NOT EXISTS QRResults(locationId INTEGER, locationDetails Text, addedOn INTEGER);";	
                       

        db.transaction(function(tx) { 
             tx.executeSql(tblDef, [], function(){
             	if (callback != null){
                    callback();
                }    
             }, function(tx, err){alert(err.message);}); 
        });        
    };   
    
    DALLocations.clearData = function(){
        var db = app.DALMain.db;
        var dropTable = "DELETE FROM QRResults";
         db.transaction(function(tx) { 
            tx.executeSql(dropTable, []); 
        });        
    };
    
    DALLocations.addResult = function(textRead, callBack) { 
        var db = app.DALMain.db;
        var addedOn = commonScriptManager.parseDateMMDDYY(new Date()); 
        //alert(addedOn);
        try{
            DALLocations.getMaxLocationId(function(txId, locationId)
            {
                console.log(locationId);
                //alert(locationId.rows.length);
                var maxId;
                if(locationId.rows.length == 0 || locationId.rows.item(0).mxLocId == null)
                    maxId = 1;
                else
                {
                    maxId = locationId.rows.item(0).mxLocId + 1;
                }
                //alert(maxId);
                db.transaction(function(tx) { 
                    tx.executeSql("INSERT INTO QRResults(locationId, locationDetails, addedOn) VALUES (?, ?, ?)", 
                                [maxId, textRead, addedOn], 
                                callBack(maxId), 
                                DALLocations.onError); 
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
    
    DALLocations.onSuccess = function(tx, results){
    };
    
    DALLocations.onError = function(tr, err){
        alert(err.message);
    };
    
    DALLocations.getMaxLocationId = function(callback){
        var db = app.DALMain.db;
        var updatedOn = new Date(); 
        db.transaction(function(tx) { 
            tx.executeSql("Select MAX(LocationId) AS mxLocId FROM QRResults", 
                          [], 
                          callback, 
                          DALLocations.onError); 
        });         
    };
    
    DALLocations.updateCompletion = function(projectID, percentComplete){
        var db = app.DALMain.db;
       	var updatedOn = new Date(); 
        db.transaction(function(tx) { 
            tx.executeSql("UPDATE QRResults SET  percentComplete = round(?, 2), updatedOn = ? WHERE ProjectID = ?", 
                          [percentComplete, updatedOn, projectID], 
                          DALLocations.onSuccess, 
                          DALLocations.onError); 
        });         
    };
    
    DALLocations.getAllQRResults = function(resultsCallback){
        var db = app.DALMain.db;
        try{
             db.transaction(function(tx) { 
                    tx.executeSql('SELECT * FROM QRResults', [], resultsCallback,  DALLocations.onError)  
            });
        }
        catch(err){
            alert(err.message);
        }
    };
    
    DALLocations.getProject = function(projectID, resultsCallback){
        var db = app.DALMain.db;
        db.transaction(function(tx) { 
				tx.executeSql('SELECT * FROM QRResults WHERE ProjectID = ? ', [projectID], resultsCallback,  DALLocations.onError)  
        });
    };
    
    DALLocations.calculateCompletionStatus = function(projectID)
    {
        var db = app.DALMain.db;
        db.transaction(function(tx){
            tx.executeSql("SELECT (SELECT round(SUM(PercentComplete), 2) FROM Buildings WHERE ProjectID = ? AND IsDeleted = 0) / (SELECT Count(*) FROM Buildings WHERE ProjectID = ? AND IsDeleted = 0) as Percentage",
                          [projectID, projectID],
                          function(tx, result)
                            {
                                if(result.rows.length > 0)
                                    {
                                        DALLocations.updateCompletion(projectID, result.rows.item(0).Percentage);
                                    }
                            }, 
                          DALLocations.onError);
        });
    };
    
    DALLocations.saveNotes = function(projectID, notes, resultsCallback)
    {
        var db = app.DALMain.db;
        var updateQuery = "UPDATE QRResults SET Notes = ? WHERE ProjectID = ? AND Status > 0";
        db.transaction(function(tx){
            tx.executeSql(updateQuery, [notes, projectID], resultsCallback, DALLocations.onError);
        });
    };
    app.DALLocations = DALLocations;