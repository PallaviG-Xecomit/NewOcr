'use strict';


	var DALMain = {};
    
    DALMain.dbName = "SmartSiteSurvey.sqlite";
    
    DALMain.db = null;
    
    DALMain.init = function(){
        if (window.navigator.simulator === true) { 
            try{
                 // For debugin in simulator fallback to native SQL Lite 
            console.log("Use built in SQL Lite"); 
            DALMain.db = window.openDatabase(DALMain.dbName, "1.0", "SmartSiteSurvey", 200000); 
            }
            catch(err){
                alert("db err : " + err.message);
            }
           
        } 
        else { 
            try {
                //alert(DALMain.dbName);
        		DALMain.db = window.sqlitePlugin.openDatabase({name: DALMain.dbName, location: 0}); 
            }
            catch(err){
                alert(err.message);
            }
        } 
    };  
    
    app.DALMain = DALMain;
