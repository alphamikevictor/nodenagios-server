/*
    Require counter
    Optional index
    Return JSON:
    {
        perfmon_value:
    }
    
    Request a counter and its index (some like CPU return multiple indexes)
    In order to see the available list of counters in your system type
    "typeperf -q" on a cmd 
    
    If index is not set will get the first available
    
    Unfortunately the counter name are localized so if you want to monitor some
    value in serverA the counter name will be different on server B if they
    were installed on a different language. Windows ...
*/

var action = {
    run: function(petition, configuration, utils, response) {
        var processed=false;
        var retvalue=null;
        var index = petition.index || 1;
        if (!petition.counter) {
            utils.responseWrong(response, "No counter was specified");
            return;
        }
        if (!((process.platform == 'win32')||(process.platform == 'win64'))){
            utils.responseWrong(response,"Platform " + process.platform + " is not allowed on this plugin, only win32 and win64");
            return;
        }
        command="typeperf -sc 1 \""+ petition.counter +"\"";
        try {
            var pluginsdir = configuration.pluginsdir || __dirname;
            var cmdutil = require(pluginsdir + '/plugin_cmd.js');
        }
        catch (err){
            utils.responseWrong(response,"Can not open plugin_cmd.js file");
            return;
        }
        cmdutil.runafterexp(command,/^\"\(/);
        cmdutil.once('data',function(data){
            values = data[1].split(',');
            retvalue = values[index].match(/\"([0-9]+\.[0-9]+)\"/)[1];
            processed=true;
        });
        cmdutil.on('end',function(){
            if (processed == true){
                information={
                    perfmon_value: retvalue
                }
                utils.responseOk(response,JSON.stringify(information));
                return;
            }
            else{
                utils.responseWrong(response,"Could not obtain counter " + petition.counter);
                return;
            }
        });
    }
}

module.exports = action;
