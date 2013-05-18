var action={
	run: function(petition,configuration,utils,response){
		if (!petition.partition){
			utils.responseWrong(response,"No partition selected");
			return;
		}
		switch(process.platform){
			case 'darwin' || 'linux':
				command="df -k " + petition.partition;
				information={ action: 'df', command: command};
				utils.responseOk(response,JSON.stringify(information));
				break;
			case 'windows':
				command=configuration.sysinternalsdir + "psinfo";
				break;
		}
	}
}
module.exports = action;
