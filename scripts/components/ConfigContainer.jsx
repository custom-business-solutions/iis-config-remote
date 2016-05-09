import React, { Component } from 'react'
import FirewallRule from './FirewallRule'
import UrlAcl from './UrlAcl'
import ApplicationBinding from './ApplicationBinding'

var ipcRenderer = window.require('electron').ipcRenderer

export default class ConfigContainer extends Component {
  constructor (props) {
    super(props)

    this.state = {
      'firewall-port': ''
    }
  }

  componentDidMount () {
    ipcRenderer.on('add-firewall-rule-reply', function (event, port) {
      this.setState({
        'firewall-port': port
      })
    }.bind(this))
  }

  addFirewallRule (port) {
    // console.log(port)
    ipcRenderer.send('add-firewall-rule', port)
  }

  render () {
    return (
      <div className='container-fluid'>
        <FirewallRule addFirewallRule={this.addFirewallRule} port={this.state['firewall-port']} />
        <UrlAcl />
        <ApplicationBinding />
      </div>
    )
  }
}
