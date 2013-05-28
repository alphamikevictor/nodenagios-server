/*
    Require directory
    Return JSON:
    {
        directory: ,
        files:
    }
    
*/

var action = {
    run: function(petition, configuration, utils, response) {
        if (!petition.directory) {
            utils.responseWrong(response, "No directory was specified");
            return;
        }
        var fs=require("fs");
        if (! fs.existsSync(petition.directory)){
            utils.responseWrong(response,"ERROR: directory " + petition.directory + " does not exist.");
            return;
        }
        var fstat=fs.statSync(petition.directory);
        if(fstat.isDirectory()){
            var files=0;
            var filenames=fs.readdirSync(petition.directory);
            filenames.forEach(function(filename,index){
                try{
                    var fstat = fs.statSync(petition.directory + "/" + filename);
                    if (fstat.isFile()) {
                        files++;
                        }
                }
                catch (err){
                    console.warn("WARN: could not access right now to " + petition.directory + "/" + filename);
                }
            });
            var information = {
                directory: petition.directory,
                files: files
            }
            utils.responseOk(response,JSON.stringify(information));
            return;
        }
        else{
            utils.responseWrong(response,"ERROR: " + petition.directory +" is not a directory");
            return;
        }
    }
}

module.exports = action;
