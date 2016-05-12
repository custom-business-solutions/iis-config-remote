import React, { Component } from 'react'
import FirewallRule from './FirewallRule'
import UrlAcl from './UrlAcl'
import ApplicationBinding from './ApplicationBinding'
import findIndex from 'lodash/findIndex'

var ipcRenderer = window.require('electron').ipcRenderer

export default class ConfigContainer extends Component {
  constructor (props) {
    super(props)

    this.addURLRule = this.addURLRule.bind(this)

    this.state = {
      port: '',
      firewallRuleAdded: false,
      ipAddresses: [],
      chosenIpAddress: '',
      URLRuleAdded: false,
      existingURLRules: []
    }
  }

  componentWillMount () {
    ipcRenderer.send('get-ip-addresses')
  }

  componentDidMount () {
    ipcRenderer.on('add-firewall-rule-reply', function (event, message, port) {
      const ruleAdded = message === 'Success'
      if (ruleAdded) {
        ipcRenderer.send('get-url-rules-by-port', port)
        this.setState({
          port: port,
          firewallRuleAdded: ruleAdded
        })
      }
    }.bind(this))

    ipcRenderer.on('delete-firewall-rule-reply', function (event, message) {
      const ruleDeleted = message === 'Success'
      if (ruleDeleted) {
        this.setState({
          port: '',
          firewallRuleAdded: !ruleDeleted
        })
      }
    }.bind(this))

    ipcRenderer.on('get-ip-addresses-reply', function (event, ipAddresses) {
      this.setState({
        ipAddresses: ipAddresses
      })
    }.bind(this))

    ipcRenderer.on('add-url-rule-reply', function (event, message, ipAddress) {
      const ruleAdded = message === 'Success'
      if (ruleAdded) {
        this.setState({
          chosenIpAddress: ipAddress,
          URLRuleAdded: ruleAdded,
          existingURLRules: [...this.state.existingURLRules, `http://${ipAddress}:${this.state.port}/`]
        })
      }
    }.bind(this))

    ipcRenderer.on('delete-url-rule-reply', function (event, message, url) {
      if (message === 'Success') {
        const existingURLRules = this.state.existingURLRules
        const urlIndex = findIndex(existingURLRules, (existingRule) => existingRule === url)
        if (urlIndex < 0) {
          return
        }

        this.setState({
          existingURLRules: [...existingURLRules.slice(0, urlIndex), ...existingURLRules.slice(urlIndex + 1)]
        })
      }
    }.bind(this))

    ipcRenderer.on('get-url-rules-by-port-reply', function (event, message, urls) {
      if (message === 'Success') {
        this.setState({
          existingURLRules: urls
        })
      }
    }.bind(this))
  }

  addFirewallRule (port) {
    ipcRenderer.send('add-firewall-rule', port)
  }

  deleteFirewallRule (port) {
    ipcRenderer.send('delete-firewall-rule', port)
  }

  addURLRule (ipAddress) {
    ipcRenderer.send('add-url-rule', ipAddress, this.state.port)
  }

  deleteURLRule (url) {
    ipcRenderer.send('delete-url-rule', url)
  }

  render () {
    return (
      <div className='container-fluid'>
        <FirewallRule addFirewallRule={this.addFirewallRule} deleteFirewallRule={this.deleteFirewallRule} ruleAdded={this.state.firewallRuleAdded} />
        <UrlAcl port={this.state.port} ipAddresses={this.state.ipAddresses} addURLRule={this.addURLRule} ruleAdded={this.state.URLRuleAdded}
          existingURLRules={this.state.existingURLRules} deleteURLRule={this.deleteURLRule} />
        <ApplicationBinding />
      </div>
    )
  }
}
