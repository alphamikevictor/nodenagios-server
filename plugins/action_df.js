var action={
	run: function(petition,configuration,utils,response){
		var information={action: 'df'};
		utils.responseOk(response,JSON.stringify(information));
	}
}
module.exports = action;
