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

    ipc.on('get-username', function(event) {
        var user = '';
        var fullUserProfile = process.env['USERPROFILE'];
        if (fullUserProfile.indexOf('admin') > -1) {
            user = fullUserProfile.substring(fullUserProfile.indexOf('admin') + 5);
        } else {
            user = fullUserProfile.substring(fullUserProfile.lastIndexOf('/') + 1);
        }

        event.returnValue = user;
    });

    ipc.on('edit-app-host-config', function(event) {
        var fileContents = fs.readFileSync('C:\\temp\\applicationhost.bkp.config').toString().split("\n");

        event.returnValue = fileContents;
    });
};

exports.registerIpcListeners = registerIpcListeners;
