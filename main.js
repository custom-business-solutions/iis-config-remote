var app = require('app');
var BrowserWindow = require('browser-window');
var ipc = require('ipc');

require('crash-reporter').start();

app.on('window-all-closed', function() {
    if (process.platform != 'darwin') {
        app.quit();
    }
});

app.on('ready', function() {
    mainWindow = new BrowserWindow({width: 1280, height: 800});
    mainWindow.loadUrl('file://' + __dirname + '/public/index.html');
    mainWindow.openDevTools();

    ipc.on('get-ip', function(event, arg) {
        console.log(arg);
        event.returnValue = 'sup';
    });

    mainWindow.on('closed', function() {
        mainWindow = null;
    });
});
