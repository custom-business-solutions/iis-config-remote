import React, { Component } from 'react'
import FirewallRule from './FirewallRule'
import UrlAcl from './UrlAcl'
import ApplicationBinding from './ApplicationBinding'

var ipcRenderer = window.require('electron').ipcRenderer

export default class ConfigContainer extends Component {
  constructor (props) {
    super(props)

    this.state = {
      'firewall-rule-added': false
    }
  }

  componentDidMount () {
    ipcRenderer.on('add-firewall-rule-reply', function (event, message) {
      const ruleAdded = message === 'Success'
      this.setState({
        'firewall-rule-added': ruleAdded
      })
    }.bind(this))

    ipcRenderer.on('delete-firewall-rule-reply', function (event, message) {
      const ruleDeleted = message === 'Success'
      this.setState({
        'firewall-rule-added': !ruleDeleted
      })
    }.bind(this))
  }

  addFirewallRule (port) {
    ipcRenderer.send('add-firewall-rule', port)
  }

  deleteFirewallRule (port) {
    ipcRenderer.send('delete-firewall-rule', port)
  }

  render () {
    return (
      <div className='container-fluid'>
        <FirewallRule addFirewallRule={this.addFirewallRule} deleteFirewallRule={this.deleteFirewallRule} ruleAdded={this.state['firewall-rule-added']} />
        <UrlAcl />
        <ApplicationBinding />
      </div>
    )
  }
}
