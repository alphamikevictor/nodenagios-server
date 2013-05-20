/*
    Require service
    Return JSON:
    {
        service_name: ,
        service_status: 
    }
*/

var action = {
    run: function(petition, configuration, utils, response) {
        if (!petition.service) {
            utils.responseWrong(response, "No service specified");
            return;
        }
        if (!((process.platform == 'win32')||(process.platform == 'win64'))){
            utils.responseWrong(response,"Platform " + process.platform + " is not allowed on this plugin, only win32 and win64");
            return;
        }
        command="%SystemRoot%/system32/sc query " + petition.service;
        try {
            var cmdutil = require(configuration.pluginsdir + '/plugin_cmd.js');
        }
        catch (err){
            utils.responseWrong(response,"Can not open plugin_cmd.js file");
            return;
        }
        var serviceProcessed = false;
        cmdutil.runafterexp(command,/^SERVICE_NAME/);
        cmdutil.on('data',function(data){
            if (data[0] == "STATE"){
                var information = {
                        service_name: petition.service,
                        service_status: data[3]
                    }
                serviceProcessed = true;
                utils.responseOk(response,JSON.stringify(information));
                return;
            }
        });
        cmdutil.on('end',function(){
            if (serviceProcessed == false) {
                utils.responseWrong(response,"Service " + petition.service + " is not present on the system");
                return;
                }
        });
    }
}

module.exports = action;
