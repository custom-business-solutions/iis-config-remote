import React, { Component } from 'react'
import FirewallRule from './FirewallRule'
import UrlAcl from './UrlAcl'
import ApplicationBinding from './ApplicationBinding'

var ipcRenderer = window.require('electron').ipcRenderer

export default class ConfigContainer extends Component {
  constructor (props) {
    super(props)

    this.state = {
      port: '',
      firewallRuleAdded: false,
      ipAddresses: []
    }
  }

  componentWillMount () {
    ipcRenderer.send('get-ip-addresses')
  }

  componentDidMount () {
    ipcRenderer.on('add-firewall-rule-reply', function (event, message, port) {
      const ruleAdded = message === 'Success'
      this.setState({
        port: port,
        firewallRuleAdded: ruleAdded
      })
    }.bind(this))

    ipcRenderer.on('delete-firewall-rule-reply', function (event, message) {
      const ruleDeleted = message === 'Success'
      this.setState({
        port: '',
        firewallRuleAdded: !ruleDeleted
      })
    }.bind(this))

    ipcRenderer.on('get-ip-addresses-reply', function (event, ipAddresses) {
      this.setState({
        ipAddresses: ipAddresses
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
        <FirewallRule addFirewallRule={this.addFirewallRule} deleteFirewallRule={this.deleteFirewallRule} ruleAdded={this.state.firewallRuleAdded} />
        <UrlAcl port={this.state.port} ipAddresses={this.state.ipAddresses} />
        <ApplicationBinding />
      </div>
    )
  }
}
