/*
    Require directory
    Return JSON:
    {
        filename: ,
        match:
    }
    
*/

var action = {
    run: function(petition, configuration, utils, response) {
        if (!petition.filename || !petition.match) {
            utils.responseWrong(response, "No filename or match specified");
            return;
        }
        var fs=require("fs");
        if (! fs.existsSync(petition.filename)){
            utils.responseWrong(response,"ERROR: " + petition.filename + " does not exist.");
            return;
        }
        var pluginsdir = configuration.pluginsdir || __dirname;
        var cmdutil = require(pluginsdir + '/plugin_cmd.js');
        switch (process.platform) {
            case 'darwin':
            case 'linux':
                var command = "grep \"" + petition.match + "\" " + petition.filename + " wc -l";
                cmdutil.runafterexp(command,/[0-9]/);
                cmdutil.once('data',function(data){
                    information = {
                        filename: petition.filename,
                        match: petition.match,
                        matches: data
                    }
                    utils.responseOk(response,JSON.stringify(information));
                });
                break;
            case 'win32':
            case 'win64':
                var command = "find /c \"" + petition.match + "\" " + petition.filename;
                cmdutil.runafterexp(command,/.*/);
                cmdutil.once('data',function(data) {
					console.log(data);
                    information = {
                        filename: petition.filename,
                        match: petition.match,
                        matches: data[data.length - 1].match(/[0-9]+/)[0]
                    }
                    utils.responseOk(response,JSON.stringify(information));
                });
                break;
            default:
                utils.responseWrong(response,"I have no knowledge about platform " + process.platform);
                break;
        }

    }
}

module.exports = action;
