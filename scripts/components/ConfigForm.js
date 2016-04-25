var ipcRenderer = window.require('electron').ipcRenderer

import React, { Component, PropTypes } from 'react'
import _ from 'lodash'

export default class ConfigForm extends Component {
  constructor (props) {
    super(props)

    this.handleChange = this.handleChange.bind(this)
    this.handleClick = this.handleClick.bind(this)

    this.state = {
      'host-ip': props.configInitialValues.hostIp,
      'port': props.configInitialValues.port,
      'app-host-config-path': props.configInitialValues.appHostConfigPath
    }
  }

  handleClick (e) {
    e.preventDefault()
    var data = {
      newIp: this.state['host-ip'],
      port: this.state['port'],
      appConfig: this.state['app-host-config-path']
    }
    data.oldIp = ipcRenderer.sendSync('get-old-ip', data.appConfig, data.port)

    if (this.updateAppConfig(data)) {
      this.addUrlAclEntry(data)
      this.addFirewallEntry(data.port)

      return this.props.updateMessage(data.newIp, data.port)
    }
  }

  updateAppConfig (data) {
    return ipcRenderer.sendSync('update-apphost-config', data)
  }

  addUrlAclEntry (data) {
    return ipcRenderer.sendSync('add-urlacl-entry', data)
  }

  addFirewallEntry (port) {
    return ipcRenderer.sendSync('add-firewall-entry', port)
  }

  handleChange (e) {
    var nextState = {}
    nextState[e.target.id] = e.target.value
    this.setState(nextState)
  }

  render () {
    let buttonDisabled = _.some(this.state, function (item) {
      return item === ''
    }) ? 'disabled' : ''

    let buttonClassNames = `btn btn-primary ${buttonDisabled}`

    return (
      <form className='form-horizontal'>
        <div className={this.state['host-ip'] === '' ? 'form-group has-error' : 'form-group'}>
          <label htmlFor='host-ip' className='col-sm-3 control-label'>Host IP dawg</label>
          <div className='col-sm-4'>
            <input type='text' className='form-control' id='host-ip' onChange={this.handleChange} placeholder='10.11.x.x' value={this.state['host-ip']} />
          </div>
        </div>
        <div className={this.state['port'] === '' ? 'form-group has-error' : 'form-group'}>
          <label htmlFor='port' className='col-sm-3 control-label'>Port</label>
          <div className='col-sm-4'>
            <input type='text' className='form-control' id='port' onChange={this.handleChange} placeholder='55500' value={this.state['port']} />
          </div>
        </div>
        <div className={this.state['app-host-config-path'] === '' ? 'form-group has-error' : 'form-group'}>
          <label htmlFor='app-host-config-path' className='col-sm-3 control-label'>applicationhost.config Path</label>
          <div className='col-sm-6'>
            <input type='text' className='form-control' id='app-host-config-path' onChange={this.handleChange} value={this.state['app-host-config-path']} />
          </div>
        </div>
        <div className='form-group'>
          <div className='col-sm-offset-3 col-sm-4'>
            <a href='#' role='button' className={buttonClassNames} onClick={this.handleClick}>Bam!</a>
          </div>
        </div>
      </form>
    )
  }
}

ConfigForm.propTypes = {
  updateMessage: PropTypes.func
}
