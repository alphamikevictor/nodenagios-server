/*
    Require ID
    Optional eventlog => Default System
    Require time how many steps of timeunits
    Require timeunits h => hour , d => days , m => minutes
    Optional filter a combination of iwe (information warning error) to filter only those events
    Return JSON:
    {
        event_id: ,
        event_quantity: 
    }
*/

var action = {
    run: function(petition, configuration, utils, response) {
        var errors = '';
        if (!((process.platform == 'win32')||(process.platform == 'win64'))){
            utils.responseWrong(response,"Platform " + process.platform + " is not allowed on this plugin, only win32 and win64");
            return;
        }
        if (!petition.ID) {
            errors += "No ID to check was specified. ";
        }
        if (!petition.time){
            errors += "No amount of time was specified. ";
        }
        if (!petition.timeunits){
            errors += "No time units were specified. ";
        }
        if (petition.timeunits != null && petition.timeunits != 'h' && petition.timeunits != 'd' && petition.timeunits != 'm'){
            errors += "Time units must be h for hours, d for days or m for minutes"
        }
        if (errors != ''){
            utils.responseWrong(response,errors);
            return;
        }
        var filter='';
        if (petition.filter != null){
            filter = "-f " + petition.filter;
        }
        var eventlog = petition.eventlog || "System";
        var command=configuration.sysinternalsdir + "psloglist -i " + petition.ID + " -" + petition.timeunits + " " + petition.time + " " + filter + " " + eventlog;
        try {
            var pluginsdir = configuration.pluginsdir || __dirname;
            var cmdutil = require(pluginsdir + '/plugin_cmd.js');
        }
        catch (err){
            utils.responseWrong(response,"Can not open plugin_cmd.js file");
            return;
        }
        var serviceProcessed = false;
        var quantity = 0;
        cmdutil.runafterexp(command,/.*/);
        cmdutil.on('data',function(data){
            if (data.length > 0 && data[0].match(/^\[[0-9]/)) {quantity++}
        });
        cmdutil.on('end',function(){
            information = {
                event_id: petition.ID,
                event_quantity: quantity
            }
            utils.responseOk(response,JSON.stringify(information));
            return;
        });
    }
}

module.exports = action;
