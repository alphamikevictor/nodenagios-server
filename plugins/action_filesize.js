/*
    Require file
    Return JSON:
    {
        file_name: ,
        file_size:
    }
    
*/

var action = {
    run: function(petition, configuration, utils, response) {
        if (!petition.file) {
            utils.responseWrong(response, "No file was specified");
            return;
        }
        var fs=require("fs");
        if (! fs.existsSync(petition.file)){
            utils.responseWrong(response,"ERROR: file " + petition.file + " does not exist.");
            return;
        }
        var fstat=fs.statSync(petition.file);
        if(fstat.isFile()){
            var information = {
                file_name: petition.file,
                file_size: fstat.size
            }
            utils.responseOk(response,JSON.stringify(information));
            return;
        }
        else{
            utils.responseWrong(response,"ERROR: " + petition.file +" is not a file");
            return;
        }
    }
}

module.exports = action;
