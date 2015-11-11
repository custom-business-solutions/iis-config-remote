"use strict";

var ipc = require('ipc');
var os = require('os');
var fs = require('fs');
var _ = require('underscore');

var registerIpcListeners = function() {
    ipc.on('get-ip', function(event) {
        var ip = '';
        var nifs = os.networkInterfaces();
        var wantedNif = _.filter(nifs, function(nif) {
            return _.some(nif, function(nifItem) {
                if (nifItem.address.startsWith("10.11")) {
                    ip = nifItem.address;
                    return true;
                }
            });
        });

        event.returnValue = ip;
    });

    ipc.on('get-old-ip', function(event, filePath, port) {
        let fileContents = fs.readFileSync(filePath).toString().split("\n");
        let patternToFind = `:${port}:10.11`;
        let lineWithOldIp = _.filter(fileContents, function(line) {
            return line.indexOf(patternToFind) > -1;
        });

        let oldIp = "";
        if (lineWithOldIp.length > 0) {
            let regex = new RegExp(".+:" + port + ":(.+)\".+");
            oldIp = regex.exec(lineWithOldIp[0])[1];
        }

        event.returnValue = oldIp;
    });
};

exports.registerIpcListeners = registerIpcListeners;
