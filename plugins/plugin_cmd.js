var exec = require('child_process').exec,child;
var EventEmitter=require("events").EventEmitter;

var cmdutil = new EventEmitter();

cmdutil.runafterexp = function(command,regexp){
    child = exec(command);
    var childdata='';
    child.stdout.on('data',function(data){childdata+=data});
    child.stdout.on('end',function(){
        var lines=childdata.split('\n');
        var startEmitting = false;
        lines.forEach(function(line,index){
            if (startEmitting){
                var lineAux=[];
                line.split(' ').forEach(function(content,element){ if (content != '') {lineAux.push(content);}});
                cmdutil.emit('data',lineAux);
            }
            if (line.match(regexp)) { startEmitting = true;}
        });
        cmdutil.emit('end');
    });
}

module.exports = cmdutil;