/*
    Require Partition
    Return JSON:
    {
        partition_name: ,
        partition_size: ,
        partition_usage: ,
        partition_available: ,
        partition_percent
    }
*/

var action = {
    run: function(petition, configuration, utils, response) {
        if (!petition.partition) {
            utils.responseWrong(response, "No partition selected");
            return;
        }
        switch (process.platform) {
        case 'darwin':
            var command = "df -k " + petition.partition;
        case 'linux':
            /* 
                On linux we use -P to printout with POSIX format,
                otherwise partition with long device or mount point names
                are splited in more than 1 line causing application to fail
            */
            var command = command || "df -kP " + petition.partition;
            try {
                var pluginsdir = configuration.pluginsdir || __dirname;
                var cmdutil = require(pluginsdir + '/plugin_cmd.js');
            }
            catch (err){
                utils.responseWrong(response,"Can not open plugin_cmd.js file");
                return;
            }
            cmdutil.runafterexp(command,/^Filesystem/);
            cmdutil.once('data',function(data){
                information = {
                                partition_name: data[0],
                                partition_size: data[1],
                                partition_usage: data[2],
                                partition_available: data[3],
                                partition_percent: data[4].match(/[0-9]+/)[0]
                                };
                utils.responseOk(response,JSON.stringify(information));
            });
            break;
        case 'win64':
        case 'win32':
            command = configuration.sysinternalsdir + "psinfo -d";
            try{
                var pluginsdir = configuration.pluginsdir || __dirname;
                var cmdutil = require(pluginsdir + '/plugin_cmd.js');
            }
            catch (err){
                utils.responseWrong(response,"Unable to run command: " + command);
                return;
            }
            cmdutil.runafterexp(command,/^Volume Type/);
            var informationSend = false;
            cmdutil.on('data',function(data){
                if (data[0] == petition.partition){
					/*
						Probably we can expect empty labels or with spaces so we need
						at least 8 fields
					*/
                    if (data.length < 8) {
                        utils.responseWrong(response,"I cannot extract information for drive " + petition.partition);
                        return;
                    }
                    /*
                        PsInfo gives you % free space instead of %used space like linux will, so
                        you need to perform little calculation :)
						
						positions for Size, free will depend on data.length
                    */
                    information = {
                                    partition_name: data[0],
                                    partition_size: data[data.length - 5]+data[data.length -4],
                                    partition_usage: null,
                                    partition_available: data[data.length -3]+data[data.length -2],
                                    partition_percent: Math.round(100*(100 - data[data.length -1].match(/[0-9]+/)[0]))/100
                                    };
                    informationSend = true;
                    utils.responseOk(response,JSON.stringify(information));
                    return;
                }
            });
            cmdutil.on('end',function() {
                if (informationSend == false){
                    utils.responseWrong(response,"Drive " + petition.partition + " not present");
                    return;
                }
            });
            break;
        default:
            utils.responseWrong(response,"I have no knowledge about platform " + process.platform);
            break;
        }
    }
}
module.exports = action;
