var app = require('electron').app;
var BrowserWindow = require('electron').BrowserWindow;
var registerIpcListeners = require('./lib/ipcUtils').registerIpcListeners;

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

    registerIpcListeners();

    mainWindow.on('closed', function() {
        mainWindow = null;
    });
});
