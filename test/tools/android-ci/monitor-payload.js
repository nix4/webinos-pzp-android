/**
 * This function is deployed to an android device/emulator to listen for events
 * form the PZP. It is copied to the device using:
 * adb -s emulator-5556 push ../../../test-echo.js data
 * @param settings
 * @constructor
 */
var Payload = function(settings){
    this.run = function(){
        var os = require("os");
        if(os.platform().toLowerCase() == "android") {
            try {
                var bridge = require('bridge');
                if(bridge !== undefined){
                    console.log("PZP Monitor:: Bridge found ");
                    var notification = bridge.load('org.webinos.impl.PZPNotificationManagerImpl', this);
                    if(notification !== undefined){
                        notification.eventRegister(function(status){
                            console.log("PZP Monitor:: Receiving event on PZP status:" + status);
                            if(status === "Initialized")
                                console.log("PZP Monitor:: Status=PZP_Initialized");
                        });
                    }else{
                        console.log("PZP Monitor:: notification Implementation not found");
                    }
                }else{
                    console.log("PZP Monitor:: Bridge NOT found");
                }
            }
            catch(e) {
                console.error("PZP Monitor:: Android pzp register event notification - error: " + e.message);
            }
        }
    }
}

new Payload().run();
