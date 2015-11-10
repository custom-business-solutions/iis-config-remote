var ipc = require('ipc');
var os = require('os');
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
};

exports.registerIpcListeners = registerIpcListeners;
