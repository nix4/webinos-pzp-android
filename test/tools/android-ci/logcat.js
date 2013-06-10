var nodeUtil = require("util"),
    events = require("events");
var util = require('util'),
    colors = require('colors'),
    spawn = require('child_process').spawn,
    state = {
        'success': ['success', 'D\/DroidGap', 'D\/CordovaLog'],
        'error': ['error', 'E\/'],
        'warning': ['warning', 'W\/Web Console'],
        'info': ['info']
    };

var LogType = {
    Error: "Error",
    Warning: "Warning",
    Success: "Success",
    Info: "Info"
}
var Logcat = function(notificationSettings, clearEntries){
    events.EventEmitter.call(this);
    this._curlCMD = 'curl';
    this.notificationSettings = notificationSettings;
    this.entries = {};
    this.entries[LogType.Error] = [];
    this.entries[LogType.Info] = [];
    this.entries[LogType.Success] = [];
    this.entries[LogType.Warning] = [];
    this.start(clearEntries);
}

nodeUtil.inherits(Logcat, events.EventEmitter);

Logcat.prototype.start = function(clear){
    //Start by clearing current log
    if(clear){
        var exec = require('child_process').exec;
        exec("adb logcat -c");
    }
    var logcat = spawn('adb', ['logcat']),
        self = this;
    var parseStdout = function(data, _class) {
        data.toString().split('\n').forEach(function(line) {
            //if(line.indexOf("ActivityManager") >= 0) line = line + "OnPZPInitialized";
            if(line != '') {
                var type = ['info'];
                if(state.hasOwnProperty(_class)) {
                    type.push(_class);
                } else {
                    Object.keys(state).forEach(function(k) {
                        if(util.isArray(state[k])) {
                            state[k].forEach(function(rx) {
                                var r = new RegExp(rx);
                                if(r.test(line)) {
                                    type.push(k);
                                }
                            });
                        }
                    });
                }

                var eventParser;
                //console.log(self.notificationSettings);
                for(var event in self.notificationSettings){
                    eventParser = self.notificationSettings[event];
                    if(line.indexOf(event) >= 0)
                        self.emit(event, eventParser(line));
                }
                if(type.indexOf('error') >= 0 ) {
                    self.entries['Error'].push(line.red.bold);
                } else if(type.indexOf('warning') >= 0 ) {
                    self.entries['Warning'].push(line.yellow.bold);
                } else if(type.indexOf('success') >= 0 ) {
                    self.entries['Success'].push(line.green.bold);
                } else {
                    self.entries['Info'].push(line.blue.bold);
                }
                /*if(type.indexOf('error') >= 0 ) {
                    console.log(line.red.bold);
                } else if(type.indexOf('warning') >= 0 ) {
                    console.log(line.yellow.bold);
                } else if(type.indexOf('success') >= 0 ) {
                    console.log(line.green.bold);
                } else {
                    console.log(line.blue.bold);
                }  */
            }
        });
    };

    logcat.stdout.on('data', function(data){parseStdout(data);});

    logcat.stderr.on('data', function(data){parseStdout(data, 'error');});

    logcat.on('exit', function (code) {
        logcat = spawn('adb', ['logcat']);
    });
}
function format(type, line){
    if(type === LogType.Error)
        return line.red.bold;
    else if(type === LogType.Warning)
        return line.yellow.bold;
    else if(type === LogType.Success)
        return line.green.bold;
    else
        return line.blue.bold;
}
Logcat.prototype.dump = function(type){
    var self = this;
    if(type === undefined){
        //for(var i in this.entries)
        for(var type in LogType){
            for(var i in self.entries[type])
                console.log(format(type, self.entries[type][i]));
        }
            //console.log(self.entries);
    } else{
        for(var i in self.entries[type])
       // if(!filter(entries[i]))
            console.log(format(type, self.entries[type][i]));
    }

}

module.exports = Logcat;

/*var logc = new Logcat(notifications);
//logc.start();
logc.on("PZP Monitor", function(status){
    console.log("PZP Monitor is reporting::" + status);
})

setTimeout(function(){
    logc.dump();
}, 1000);     */
