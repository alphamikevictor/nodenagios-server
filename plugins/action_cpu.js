/*
    Optional vmtime
    Return JSON:
    {
        cpu_user: ,
        cpu_system: ,
        cpu_wait: ,
        cpu_total:
    }
*/

var action = {
    run: function(petition, configuration, utils, response) {
        var vmtime = petition.vmtime || 10;
        switch (process.platform) {
        case 'darwin':
        case 'linux':
            var command = "vmstat " + vmtime + " 2";
            try {
                var pluginsdir = configuration.pluginsdir || __dirname;
                var cmdutil = require(pluginsdir + '/plugin_cmd.js');
            }
            catch (err){
                utils.responseWrong(response,"Can not open plugin_cmd.js file");
                return;
            }
            cmdutil.runafterexp(command,/^\ +[0-9]/);
            cmdutil.once('data',function(data){
                information = {
                                cpu_user: data[12],
                                cpu_system: data[13],
                                cpu_wait: data[15],
                                cpu_total: (parseInt(data[12]) + parseInt(data[13]) + parseInt(data[15])).toString()
                                };
                utils.responseOk(response,JSON.stringify(information));
            });
            break;
/*      
        Currently I am running with troubles trying to get wmic cpu get loadpercentage working :'(

        case 'win64':
        case 'win32':
            command = "wmic cpu get loadpercentage";
            try{
                var pluginsdir = configuration.pluginsdir || __dirname;
                var cmdutil = require(pluginsdir + '/plugin_cmd.js');
            }
            catch (err){
                utils.responseWrong(response,"Unable to run command: " + command);
                return;
            }
            cmdutil.runafterexp(command,/^LoadPercentage/);
            var informationSend = false;
            var processorLoad = 0;
            var processorCount = 0;
            cmdutil.on('data',function(data){
                if(data[0].match(/^[0-9]+$/)){
                    processorLoad+=parseInt(data[0]);
                    processorCount++;
                }
            });
            cmdutil.on('end',function() {
                if(data[0].match(/^[0-9]+$/)){
                    processorLoad+=parseInt(data[0]);
                    processorCount++;
                }
                processorLoad = processorLoad / processorCount;
                information = {
                                cpu_user: null,
                                cpu_system: null,
                                cpu_wait: null,
                                cpu_total: processorLoad.toString()
                                };
                utils.responseOk(response,JSON.stringify(information));
            });
            break; */
        default:
            utils.responseWrong(response,"I have no knowledge about platform " + process.platform);
            break;
        }
    }
}
module.exports = action;
