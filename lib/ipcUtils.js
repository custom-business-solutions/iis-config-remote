'use strict'

var ipcMain = require('electron').ipcMain
var os = require('os')
var fs = require('fs')
var execSync = require('child_process').execSync
var exec = require('child_process').exec
var _ = require('lodash')

var registerIpcListeners = function () {
  ipcMain.on('get-ip', (event) => {
    var nifs = os.networkInterfaces()

    var wantedNifs = _.filter(nifs, (nif) => {
      return _.some(nif, (nifItem) => {
        if (nifItem.address.startsWith('10.')) {
          return true
        }
      })
    })

    event.returnValue = _.chain(wantedNifs).flatten().filter((nif) => nif.address.startsWith('10.')).map('address').first().value()
  })

  ipcMain.on('get-old-ip', (event, filePath, port) => {
    let fileContents = fs.readFileSync(filePath).toString().split('\n')
    let patternToFind = `:${port}:10.`
    let lineWithOldIp = _.filter(fileContents, (line) => line.indexOf(patternToFind) > -1)

    let oldIp = ''
    if (lineWithOldIp.length > 0) {
      let regex = new RegExp('.+:' + port + ':(.+)\".+')
      oldIp = regex.exec(lineWithOldIp[0])[1]
    }

    event.returnValue = oldIp
  })

  ipcMain.on('update-apphost-config', (event, data) => {
    let fileContents = fs.readFileSync(data.appConfig).toString().split('\n')
    let patternToFind = `:${data.port}:${data.oldIp}`
    let lineWithOldIpIndex = _.findIndex(fileContents, (line) => line.indexOf(patternToFind) > -1)

    if (data.oldIp && lineWithOldIpIndex > -1) {
      fileContents[lineWithOldIpIndex] = fileContents[lineWithOldIpIndex].replace(patternToFind, `:${data.port}:${data.newIp}`)
    } else {
      let lineWithLocalhostIndex = _.findIndex(fileContents, (line) => line.indexOf(`:${data.port}:localhost`) > -1)
      let lineToAdd = `\t\t\t\t\t<binding protocol="http" bindingInformation="*:${data.port}:${data.newIp}" />`
      fileContents.splice(lineWithLocalhostIndex + 1, 0, lineToAdd)
    }

    // Backup the file before modifying it
    try {
      let copyCommand = `copy /Y "${data.appConfig}" "${data.appConfig}.bkp"`
      execSync(copyCommand)
    } catch (e) {
      console.log('Error creating backup: ' + e.message)
    }

    fs.writeFile(data.appConfig, fileContents.join('\n'), (err) => {
      if (err) {
        console.log('Something went wrong writing to the app host config file: ' + err)
        event.returnValue = false
      }

      event.returnValue = true
    })
  })

  ipcMain.on('bind-application-to-ip', (event, appHostPath, port, ipAddress) => {
    fs.access(appHostPath, fs.R_OK | fs.W_OK, (err) => {
      if (err) {
        event.sender.send('bind-application-to-ip-reply', 'Error')
      }

      fs.readFile(appHostPath, (err, data) => {
        if (err) {
          event.sender.send('bind-application-to-ip-reply', 'Error')
        }

        let fileContentsArray = data.toString().split('\n')
        const patternToFind = `:${port}:localhost`
        const patternIndex = _.findIndex(fileContentsArray, (line) => line.indexOf(patternToFind) > -1)
        const lineToAdd = `\t\t\t\t\t<binding protocol="http" bindingInformation="*:${port}:${ipAddress}" />`

        if (fileContentsArray[patternIndex + 1].indexOf(`*:${port}:`) < 0) {
          fileContentsArray.splice(patternIndex + 1, 0, lineToAdd)
        } else {
          fileContentsArray[patternIndex + 1] = lineToAdd
        }

        exec(`copy /Y "${appHostPath}" "${appHostPath}.bkp"`, (err, stdout, stderr) => {
          if (err) {
            event.sender.send('bind-application-to-ip-reply', 'Error')
          }

          fs.writeFile(appHostPath, fileContentsArray.join('\n'), (err) => {
            if (err) {
              event.sender.send('bind-application-to-ip-reply', 'Error')
            }

            event.sender.send('bind-application-to-ip-reply', 'Success')
          })
        })
      })
    })
  })

  ipcMain.on('add-url-rule', (event, ipAddress, port) => {
    const command = `netsh http add urlacl url=http://${ipAddress}:${port}/ user=everyone`

    exec(command, (err, stdout, stderr) => {
      if (err) {
        event.sender.send('add-url-rule-reply', 'Error')
      }

      event.sender.send('add-url-rule-reply', 'Success', ipAddress)
    })
  })

  ipcMain.on('delete-url-rule', (event, url) => {
    const command = `netsh http delete urlacl url=${url}`

    exec(command, (err, stdout, stderr) => {
      if (err) {
        event.sender.send('delete-url-rule-reply', 'Error')
      }

      event.sender.send('delete-url-rule-reply', 'Success', url)
    })
  })

  ipcMain.on('get-url-rules-by-port', (event, port) => {
    exec('netsh http show urlacl', (err, stdout, stderr) => {
      if (err) {
        event.sender.send('get-url-rules-by-port-reply', 'Error')
      }

      const linesContainingPort = _.filter(stdout.split('\n'), (line) => {
        return line.indexOf('Reserved URL') > -1 && line.indexOf(`:${port}/`) > -1
      })

      const urlsContainingPort = _.map(linesContainingPort, (line) => {
        return _.trimEnd(line.substr(line.indexOf('http')))
      })

      event.sender.send('get-url-rules-by-port-reply', 'Success', urlsContainingPort)
    })
  })

  ipcMain.on('get-ip-addresses', (event) => {
    var ipAddresses = []
    const netInterfaces = os.networkInterfaces()
    _.forEach(netInterfaces, (netInterfaceList, name) => {
      ipAddresses.push({
        name: name,
        ipAddress: _.find(netInterfaceList, (netInterface) => netInterface.family === 'IPv4').address
      })
    })

    event.sender.send('get-ip-addresses-reply', ipAddresses)
  })

  ipcMain.on('delete-firewall-rule', (event, port) => {
    const command = `netsh advfirewall firewall delete rule name=IISExpressWeb${port}`
    exec(command, (err, stdout, stderr) => {
      if (err) {
        event.sender.send('delete-firewall-rule-reply', 'Error')
      }

      event.sender.send('delete-firewall-rule-reply', 'Success')
    })
  })

  ipcMain.on('add-firewall-rule', (event, port) => {
    const command = `netsh advfirewall firewall add rule name=IISExpressWeb${port} dir=in protocol=tcp localport=${port} profile=private remoteip=localsubnet action=allow`
    exec(command, (err, stdout, stderr) => {
      if (err) {
        event.sender.send('add-firewall-rule-reply', 'Error')
      }

      event.sender.send('add-firewall-rule-reply', 'Success', port)
    })
  })
}

exports.registerIpcListeners = registerIpcListeners
