var app = require('electron').app
var BrowserWindow = require('electron').BrowserWindow
var registerIpcListeners = require('./lib/ipcUtils').registerIpcListeners
// var mb = require('menubar')({dir: 'public'})

require('crash-reporter').start()

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('ready', function () {
  var mainWindow = new BrowserWindow({width: 1280, height: 800})
  mainWindow.loadUrl('file://' + __dirname + '/public/index.html')
  mainWindow.openDevTools()

  registerIpcListeners()

  mainWindow.on('closed', function () {
    mainWindow = null
  })
})

// mb.on('ready', function () {
//   registerIpcListeners()
// })
