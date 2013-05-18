var utils={
    responseOk: function(response,content){
        response.writeHead(200,{'Content-Type': 'application/json'});
        response.end(content);
    },
    responseWrong: function(response,message,errcode){
        if (!errcode) {errcode=400}
        response.writeHead(errcode,{'Content-Type': 'text/plain'})
        response.end(message);
    }
};
module.exports = utils;