'use strict';

var commonScriptManager = {};
       
   commonScriptManager.parseDateMMDDYY = function(date){

        var dd = date.getDate();
        var mm = date.getMonth()+1; //January is 0!
        var yyyy = date.getFullYear();
        if(dd<10){
            dd='0'+dd
        } 
        if(mm<10){
            mm='0'+mm
        } 
        var date = mm+'/'+dd+'/'+yyyy;
       return date;
   }

commonScriptManager.parseDateMMDDYYhhmmss = function(date){

        var dd = date.getDate();
        var mm = date.getMonth()+1; //January is 0!
        var yyyy = date.getFullYear();

        var hh = date.getHours();
        var min = date.getMinutes();
        var sec = date.getSeconds();


        if(dd<10){
            dd='0'+dd
        } 
        if(mm<10){
            mm='0'+mm
        } 
        if(h<10){
            h='0'+h
        } 
        if(min<10){
            min='0'+min
        } 
        if(sec<10){
            sec='0'+sec
        } 

        var date = mm+'-'+dd+'-'+yyyy+'-'+hh+'-'+min+'-'+sec;
       return date;
   }

commonScriptManager.getGUID = function(){
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
            return v.toString(16);
        });
    };

app.commonScriptManager = commonScriptManager;
    