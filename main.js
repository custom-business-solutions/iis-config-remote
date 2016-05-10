var app = require('electron').app
var BrowserWindow = require('electron').BrowserWindow
var registerIpcListeners = require('./lib/ipcUtils').registerIpcListeners
// var mb = require('menubar')({dir: 'public'})

require('crash-reporter').start({
  companyName: 'Custom Business Solutions',
  submitURL: 'http://54.249.141.255:1127/post'
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('ready', function () {
  var mainWindow = new BrowserWindow({width: 1280, height: 800})
  mainWindow.loadURL('file://' + __dirname + '/public/index.html')
  mainWindow.openDevTools()

  registerIpcListeners()

  mainWindow.on('closed', function () {
    mainWindow = null
  })
})

// mb.on('ready', function () {
//   registerIpcListeners()
// })
