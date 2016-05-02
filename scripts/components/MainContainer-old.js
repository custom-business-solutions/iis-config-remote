var ipcRenderer = window.require('electron').ipcRenderer

import React, { Component } from 'react'
import ConfigForm from './ConfigForm'
import Message from './Message'

import '../../sass/main.scss'

export default class MainContainer extends Component {
  constructor (props) {
    super(props)

    this.handleMessageUpdate = this.handleMessageUpdate.bind(this)

    var configInitialValues = {}
    configInitialValues.hostIp = this.getHostIpAddress()
    configInitialValues.port = '55500'
    configInitialValues.appHostConfigPath = 'C:\\stash\\individualshoppingapi\\.vs\\config\\applicationhost.config'

    this.state = {
      messageIp: '',
      messageHost: '',
      configInitialValues: configInitialValues
    }
  }

  getHostIpAddress () {
    return ipcRenderer.sendSync('get-ip')
  }

  handleMessageUpdate (ip, port) {
    this.setState({ messageIp: ip, messagePort: port })
  }

  render () {
    return (
      <div className='row'>
        <ConfigForm configInitialValues={this.state.configInitialValues} updateMessage={this.handleMessageUpdate}/>
        <Message messageIp={this.state.messageIp} messagePort={this.state.messagePort}/>
      </div>
    )
  }
}
