var runner = function(device, execTime, settings, cb){
    var Config = require("./config");
    var WebinosMonitor = require("./webinos-monitor");
    if(!isNaN(execTime) && device !== undefined){
        config = new Config(execTime);

        var emulator = {};
        emulator.getDeviceId = device;
        //TODO: Check if emulator is available
        var monitor = new WebinosMonitor(config, emulator, settings);
        //The monitor expects that there is a device running.
        monitor.run(cb);
    }
}
//run("emulator-5554", 35000);
//Specify the device and the timeout period for executing the monitor
module.exports = runner;