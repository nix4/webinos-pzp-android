
var WebinosMonitor = function(config, emulator,  settings){

    var async = require('async');
    var Utils = require('./ci-utils'),
        colors = require('colors'),
        utils = new Utils(),
        Logcat = require("./logcat");


    var payloadPath = settings.PAYLOAD_PATH;
    var deviceCopyPath = config.MONITOR_SETTINGS.DEVICE_COPY_PATH;
    var executionTimeout = config.MONITOR_SETTINGS.EXEC_TIMEOUT;
    var timeoutExitCode = config.MONITOR_SETTINGS.TIMEOUT_EXIT_CODE;
    var payload = config.MONITOR_SETTINGS.PAYLOAD_FILE;

    var self = this;
    var logcat;

    this.run = function(cb){
        console.log("Preparing log monitoring".blue.bold);

        //Set up notification for PZP Monitor events
        var notifications = {};
        notifications["PZP Monitor"] = function(data){
            var statusIndicator = "Status=";
            //parses the line to get the specified status
            function getStatus(line){
                if(line !== undefined && line.indexOf(statusIndicator) >= 0)
                    return line.substr(line.indexOf(statusIndicator) + statusIndicator.length);
                else
                    return "Unknown::on line::" + line;
            }
            return getStatus(data);
        }

        //Set to true to clear the current entries
        logcat = new Logcat(notifications, true);
        logcat.on("PZP Monitor", function(status){
            var msg = "PZP Monitor Reporting status::" + status;
            console.log(msg.blue.bold);
            if(status === "PZP_Initialized"){
                cb(0);
            }
        });

        //if there is no initialization event within a set time, we dump the
        // entries in the log and exit with an error code
        setTimeout(function(){
            console.log("Timeout Expired, Dumping Entire Log".blue.bold);
            logcat.dump();
            cb(timeoutExitCode);
        }, executionTimeout);

        async.series({
            copyPayload: function(callback){
                utils.executeCommandViaSpawn("adb", ['-s', emulator.getDeviceId,
                                            'push',
                                             payloadPath + payload,
                                             deviceCopyPath],
                    function(code, argsToForward, stdout){
                        if(code !== 0)
                            callback(new Error("Error copying payload to device"), stdout);
                        else
                            callback(null, stdout);
                    }, {}, {});
            }
        },
        function(err, results){
            if(!err){
                console.log("Payload copied to device".blue.bold);
                async.series({
                    execPayload : function(callback){
                        self.runNodeJsAppOnDevice(emulator.getDeviceId, deviceCopyPath + "/" + payload, callback);
                    },
                    //execute the PZP
                    execPZP : function(callback){
                        utils.executeCommandViaSpawn("adb", ['-s', emulator.getDeviceId, 'shell', 'am',
                                                    'start', '-n',
                                                    'org.webinos.app/org.webinos.app.wrt.ui.WidgetListActivity'],
                                                    function(code, argsToForward, stdout){
                                                        if(code !== 0)
                                                            callback(new Error("Error Starting PZP"), stdout);
                                                        else
                                                            callback(null, stdout);
                        }, {}, {});
                    }
                }, function(err, results){
                    if(err){
                        console.log(err);
                        self.reportTestFailure();
                    }else{

                    }
                });
            } else{
                console.log(err);
                self.reportTestFailure();
            }
        });
    }

    this.reportTestFailure = function(getDeviceId, callback){
        logcat.dump();
        cb(1);
    }

    this.runNodeJsAppOnDevice = function(getDeviceId, fullPathToNodeScript, callback){
        utils.executeCommandViaSpawn("adb", ['-s', getDeviceId, 'shell', 'am', 'broadcast', '-a',
                                    'org.webinos.app.START', '-e',
                                    'cmdline', fullPathToNodeScript],
            function(code, argsToForward, stdout){
                if(code !== 0)
                    callback(new Error("Error copying payload to device"), stdout);
                else
                    callback(null, stdout);
            }, {}, {});
    }
}

module.exports =  WebinosMonitor;

/*
 Start PZP
 adb -s,emulator-5554 push /home/corn/devel/ci/webinos-pzp-android/test/tools/android-ci/monitor-payload.js /data
 adb -s emulator-5556 shell am start -n org.webinos.app/org.webinos.app.wrt.ui.WidgetListActivity

 Copy Script
 adb -s emulator-5556 push ../../../test-echo.js data

 Execute Script
 adb -s emulator-5556 shell am broadcast -a org.webinos.app.START -e cmdline /data/test-echo.js

 Monitor logcat entries
 adb -s emulator-5556 logcat | grep 'PZP Monitor::*'

 adb -s emulator-5554 push /home/corn/devel/travis-ci-dev/Webinos-Platform/tools/android-ci/monitor-payload.js data

 Stop PZP
 adb -s emulator-5554 shell am kill org.webinos.app/org.webinos.app.wrt.ui.WidgetListActivity

 Install webinos                                        ', deviceId
 adb -s emulator-5554 install -r /home/corn/devel/ci/webinos-pzp-android/wrt/bin/wrt-debug.apk
 */