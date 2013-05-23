if (process.argv.length == 3){ var configFile=process.argv[2]}
else {var configFile=__dirname + '/config.js'}

try{
    var configuration=require(configFile);
}
catch (err){
    console.log("ERROR: could not load/parse configfile " + configFile);
    process.exit(1);
}
try{
    var utilsfile=__dirname+ '/utils.js'
    var utils=require(utilsfile);
}
catch (err){
    console.log("ERROR: could not load/parse utils file " + utilsfile);
    process.exit(1);
}

var http=require("http");

http.createServer(function(request, response) {
    if (request.method != 'POST'){
        utils.responseWrong(response,"Only POST is allowed",405);
        return;
    }
    var bodyData='';
    request.on('data',function(data){bodyData+=data});
    request.on('end',function() {
       try{
           var petition=JSON.parse(bodyData);
       }
       catch(err){
           console.error(err);
           utils.responseWrong(response,"Could not parse JSON");
           return;
       }
       if (!petition.phrase || petition.phrase != configuration.phrase){
           utils.responseWrong(response,"Not authentication provided",401);
           return;
       }
       if (!petition.action){
           utils.responseWrong(response,"There is no action to perform");
           return;
       }
       try{
           var pluginsdir = configuration.pluginsdir || __dirname + '/plugins';
           var action=require(pluginsdir + '/action_' + petition.action + '.js');
       }
       catch(err){
           console.error(err);
           utils.responseWrong(response,"Could not perform action " + petition.action,405);
           return;
       }
       try{
       action.run(petition,configuration,utils,response);
       }
       catch(err){
           console.error(err);
           utils.responseWrong(response,"Error trying to perform action " + petition.action,500);
       }
    });
}).listen(configuration.port);
