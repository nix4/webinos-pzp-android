#!/usr/bin/env node
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
 * This script runs unit tests, functionality test of the pzh and android CI tests
 * Android CI tests will only be executed if an env variable '"RUN_ANDROID_CI"="yes"' has been set
 * @type {*}
 */
var async = require('async');
var Utils = require('./ci-utils'),
    utils = new Utils();

var args = process.argv.splice(2);
var inWebinosRoot = false;

/* The first argument is used to determine whether the script is running
 under webinos-pzp-android or under tools/android-ci. This is necessary to
 avoid issues with some path dependencies
*/
if(args !== undefined && args[0] !== undefined)
    if(args[0] === "0")
        inWebinosRoot = true;
var cwd = process.cwd();

if(process.env["RUN_ANDROID_CI"] === "yes"){
    var androidCi = require('./android-ci');
    androidCi.run(inWebinosRoot, function(code, message){
        //We assume that errors would have been returned through the call
        process.exit(code);
    });
}else{
    console.log("Android CI is disabled. Enable CI execution by running 'export RUN_ANDROID_CI=yes'");
//    callback(null);
}
