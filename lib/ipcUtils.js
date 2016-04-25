"use strict";

var ipc = require('ipc');
var os = require('os');
var fs = require('fs');
var execSync = require('child_process').execSync;
var exec = require('child_process').exec;
var _ = require('lodash');

var registerIpcListeners = function() {
    ipc.on('get-ip', (event) => {
        var nifs = os.networkInterfaces();

        var wantedNifs = _.filter(nifs, (nif) => {
            return _.some(nif, (nifItem) => {
                if (nifItem.address.startsWith('10.')) {
                    return true;
                }
            });
        });

        event.returnValue = _.chain(wantedNifs).flatten().filter((nif) => nif.address.startsWith('10.')).map('address').first().value();
    });

    ipc.on('get-old-ip', (event, filePath, port) => {
        let fileContents = fs.readFileSync(filePath).toString().split("\n");
        let patternToFind = `:${port}:10.`;
        let lineWithOldIp = _.filter(fileContents, (line) => line.indexOf(patternToFind) > -1);

        let oldIp = "";
        if (lineWithOldIp.length > 0) {
            let regex = new RegExp(".+:" + port + ":(.+)\".+");
            oldIp = regex.exec(lineWithOldIp[0])[1];
        }

        event.returnValue = oldIp;
    });

    ipc.on('update-apphost-config', (event, data) => {
        let fileContents = fs.readFileSync(data.appConfig).toString().split("\n");
        let patternToFind = `:${data.port}:${data.oldIp}`;
        let lineWithOldIpIndex = _.findIndex(fileContents, (line) => line.indexOf(patternToFind) > -1);

        if (data.oldIp && lineWithOldIpIndex > -1) {
            fileContents[lineWithOldIpIndex] = fileContents[lineWithOldIpIndex].replace(patternToFind, `:${data.port}:${data.newIp}`);
        } else {
            let lineWithLocalhostIndex = _.findIndex(fileContents, (line) => line.indexOf(`:${data.port}:localhost`) > -1);
            let lineToAdd = `\t\t\t\t\t<binding protocol="http" bindingInformation="*:${data.port}:${data.newIp}" />`;
            fileContents.splice(lineWithLocalhostIndex + 1, 0, lineToAdd);
        }

        //Backup the file before modifying it
        try {
            let copyCommand = `copy /Y "${data.appConfig}" "${data.appConfig}.bkp"`
            execSync(copyCommand);
        }
        catch (e) {
            console.log('Error creating backup: ' + e.message);
        }

        fs.writeFile(data.appConfig, fileContents.join("\n"), (err) => {
            if (err) {
                console.log("Something went wrong writing to the app host config file: " + err);
                event.returnValue = false;
            }

            event.returnValue = true;
        })
    });

    ipc.on('add-urlacl-entry', (event, data) => {
        if (data.oldIp) {
            let deleteCommand = `netsh http delete urlacl url=http://${data.oldIp}:${data.port}/`;
            try {
                execSync(deleteCommand);
            }
            catch (e) {
                console.log('Error delete urlacl: ' + e.message);
            }
        }

        let addCommand = `netsh http add urlacl url=http://${data.newIp}:${data.port}/ user=everyone`;
        try {
            execSync(addCommand);
        }
        catch (e) {
            console.log('Error add urlacl: ' + e.message);
        }

        event.returnValue = "UrlAcl entry added successfully";
    });

    ipc.on('add-firewall-entry', (event, port) => {
        let deleteCommand = 'netsh advfirewall firewall delete rule name=IISExpressWeb';
        try {
            execSync(deleteCommand);
        }
        catch (e) {
            console.log('Error delete firewall rule: ' + e.message);
        }

        let addCommand = `netsh advfirewall firewall add rule name=IISExpressWeb dir=in protocol=tcp localport=${port} profile=private remoteip=localsubnet action=allow`;
        try {
            execSync(addCommand);
        }
        catch (e) {
            console.log('Error add firewall rule: ' + e.message);
        }

        event.returnValue = "Firewall entry added successfully";
    });
};

exports.registerIpcListeners = registerIpcListeners;
