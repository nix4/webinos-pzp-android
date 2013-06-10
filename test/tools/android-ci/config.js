/*******************************************************************************
 *  Code contributed to the webinos project
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Copyright 2012 - 2013 University of Oxford
 * AUTHOR: Cornelius Namiluko (corni6x@gmail.com)
 *******************************************************************************/
/**
 * This function provides some static settings for using in running android pzp tests
 */
var Config = function(execTime){
    this.ANODE_REPO = "git://github.com/paddybyers/anode.git";

    this.ANODE_DOWNLOAD_PATH = "/tmp/anode";
    this.ANDROID_INSTALL_PATH = "/tmp/android";
    this.EMULATOR_START_SCRIPT = "emul.sh";
    // We stick to r21.1 because changing to r22 prompts for license agreement and I can't find an easy way of
    // automating that part
    this.ANDROID_DOWNLOAD_SOURCE = "http://dl.google.com/android/android-sdk_r21.1-linux.tgz";
    this.ANDROID_DEVICE_TARGET = 2;
    //We are working with android 2.3.3
    this.ANDROID_API_LEVEL = 10;

    this.WEBINOS_AVD = "PZP_AVD";
    this.CONSOLE_PORT = 5554;

    this.MONITOR_SETTINGS = {};
    this.MONITOR_SETTINGS.PAYLOAD_PATH = process.cwd();
    this.MONITOR_SETTINGS.DEVICE_COPY_PATH = "/data";
    this.MONITOR_SETTINGS.PAYLOAD_FILE = "monitor-payload.js";

    this.MONITOR_SETTINGS.EXEC_TIMEOUT = execTime;
    this.MONITOR_SETTINGS.TIMEOUT_EXIT_CODE = 199;
;
}

module.exports = Config;
