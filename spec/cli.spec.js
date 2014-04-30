/**
    Licensed to the Apache Software Foundation (ASF) under one
    or more contributor license agreements.  See the NOTICE file
    distributed with this work for additional information
    regarding copyright ownership.  The ASF licenses this file
    to you under the Apache License, Version 2.0 (the
    "License"); you may not use this file except in compliance
    with the License.  You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing,
    software distributed under the License is distributed on an
    "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, either express or implied.  See the License for the
    specific language governing permissions and limitations
    under the License.
*/

var CLI = require("../src/cli"),
    Q = require('q'),
    cordova_lib = require('cordova-lib'),
    plugman = cordova_lib.plugman,
    cordova = cordova_lib.cordova;

describe("cordova cli", function () {
    beforeEach(function () {
        // Event registration is currently process-global. Since all jasmine
        // tests in a directory run in a single process (and in parallel),
        // logging events registered as a result of the "--verbose" flag in
        // CLI testing below would cause lots of logging messages printed out by other specs.
        spyOn(cordova, "on");
        spyOn(plugman, "on");
    });

    describe("options", function () {
        describe("version", function () {
            var version = require("../package").version;
            beforeEach(function () {
                spyOn(console, "log");
            });

            it("will spit out the version with -v", function () {
                new CLI(["node", "cordova", "-v"]);
                expect(console.log).toHaveBeenCalledWith(version);
            });

            it("will spit out the version with --version", function () {
                new CLI(["node", "cordova", "--version"]);
                expect(console.log).toHaveBeenCalledWith(version);
            });

            it("will spit out the version with -v anywher", function () {
                new CLI(["node", "cordova", "one", "-v", "three"]);
                expect(console.log).toHaveBeenCalledWith(version);
            });
        });
    });

    describe("project commands other than plugin and platform", function () {
        beforeEach(function () {
            spyOn(cordova.raw, "build").andReturn(Q());
        });

        it("will call command with all arguments passed through", function () {
            new CLI(["node", "cordova", "build", "blackberry10", "-k", "abcd1234"]);
            expect(cordova.raw.build).toHaveBeenCalledWith({verbose: false, silent: false, platforms: ["blackberry10"], options: ["-k", "abcd1234"]});
        });

        it("will consume the first instance of -d", function () {
            new CLI(["node", "cordova", "-d", "build", "blackberry10", "-k", "abcd1234", "-d"]);
            expect(cordova.raw.build).toHaveBeenCalledWith({verbose: true, silent: false, platforms: ["blackberry10"], options: ["-k", "abcd1234", "-d"]});
        });

        it("will consume the first instance of --verbose", function () {
            new CLI(["node", "cordova", "--verbose", "build", "blackberry10", "-k", "abcd1234", "--verbose"]);
            expect(cordova.raw.build).toHaveBeenCalledWith({verbose: true, silent: false, platforms: ["blackberry10"], options: ["-k", "abcd1234", "--verbose"]});
        });

        it("will consume the first instance of either --verbose of -d", function () {
            new CLI(["node", "cordova", "--verbose", "build", "blackberry10", "-k", "abcd1234", "-d"]);
            expect(cordova.raw.build).toHaveBeenCalledWith({verbose: true, silent: false, platforms: ["blackberry10"], options: ["-k", "abcd1234", "-d"]});
        });

        it("will consume the first instance of either --verbose of -d", function () {
            new CLI(["node", "cordova", "-d", "build", "blackberry10", "-k", "abcd1234", "--verbose"]);
            expect(cordova.raw.build).toHaveBeenCalledWith({verbose: true, silent: false, platforms: ["blackberry10"], options: ["-k", "abcd1234", "--verbose"]});
        });

        it("will consume the first instance of --silent", function () {
            new CLI(["node", "cordova", "--silent", "build", "blackberry10", "-k", "abcd1234", "--silent"]);
            expect(cordova.raw.build).toHaveBeenCalledWith({verbose: false, silent: true, platforms: ["blackberry10"], options: ["-k", "abcd1234", "--silent"]});
        });
    });

    describe("plugin", function () {
        beforeEach(function () {
            spyOn(cordova.raw, "plugin").andReturn(Q());
        });

        it("will call command with all arguments passed through", function () {
            new CLI(["node", "cordova", "plugin", "add", "facebook", "--variable", "FOO=foo"]);
            expect(cordova.raw.plugin).toHaveBeenCalledWith("add", ["facebook", "--variable", "FOO=foo"], {searchpath: undefined});
        });
    });
});
