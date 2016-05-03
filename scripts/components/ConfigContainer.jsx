import React, { Component } from 'react'
import FirewallRule from './FirewallRule'
import UrlAcl from './UrlAcl'
import ApplicationBinding from './ApplicationBinding'

export default class ConfigContainer extends Component {
  render () {
    return (
      <div className='container-fluid'>
        <FirewallRule />
        <UrlAcl />
        <ApplicationBinding />
      </div>
    )
  }
}
