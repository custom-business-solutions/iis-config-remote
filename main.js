var app = require('electron').app
var BrowserWindow = require('electron').BrowserWindow
var registerIpcListeners = require('./lib/ipcUtils').registerIpcListeners

const debug = /--debug/.test(process.argv[2])

let mainWindow

function createWindow () {
  mainWindow = new BrowserWindow({ width: 1280, height: 800 })
  mainWindow.loadURL('file://' + __dirname + '/public/index.html')
  if (debug) {
    mainWindow.openDevTools()
  }

  registerIpcListeners()

  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
})
