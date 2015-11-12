"use strict";

var ipc = require('ipc');
var os = require('os');
var fs = require('fs');
var execSync = require('child_process').execSync;
var exec = require('child_process').exec;
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

    ipc.on('update-apphost-config', function(event, data) {
        let fileContents = fs.readFileSync(data.appConfig).toString().split("\n");
        let patternToFind = `:${data.port}:${data.oldIp}`;
        let lineWithOldIpIndex = _.findIndex(fileContents, function(line) {
            return line.indexOf(patternToFind) > -1;
        });

        if (lineWithOldIpIndex > -1) {
            fileContents[lineWithOldIpIndex] = fileContents[lineWithOldIpIndex].replace(patternToFind, `:${data.port}:${data.newIp}`);
        } else {
            let lineWithLocalhostIndex = _.findIndex(fileContents, function(line) {
                return line.indexOf(`:${data.port}:localhost`) > -1;
            });
            let lineToAdd = `<binding protocol="http" bindingInformation="*:${data.port}:${data.newIp}" />`;
            fileContents.splice(lineWithLocalhostIndex + 1, 0, lineToAdd);
        }

        fs.writeFile(data.appConfig, fileContents.join("\n"), function(err) {
            if (err) {
                console.log("Something went wrong writing to the app host config file");
                event.returnValue = false;
            }

            event.returnValue = true;
        })
    });

    ipc.on('add-urlacl-entry', function(event, data) {
        let deleteCommand = `netsh http delete urlacl url=http://${data.oldIp}:${data.port}/`;
        try {
            execSync(deleteCommand);
        }
        catch (e) {
            console.log(e);
        }

        let addCommand = `netsh http add urlacl url=http://${data.newIp}:${data.port}/ user=everyone`;
        try {
            execSync(addCommand);
        }
        catch (e) {
            console.log(e);
        }

        event.returnValue = "UrlAcl entry added successfully";
    });
};

exports.registerIpcListeners = registerIpcListeners;
