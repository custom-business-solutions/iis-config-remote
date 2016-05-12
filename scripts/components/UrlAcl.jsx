import React, { Component, PropTypes } from 'react'

export default class UrlAcl extends Component {
  constructor (props) {
    super(props)

    this.handleChangeIp = this.handleChangeIp.bind(this)
    this.renderExistingRules = this.renderExistingRules.bind(this)

    this.state = {
      chosenIpAddress: ''
    }
  }

  handleChangeIp (e) {
    this.setState({
      chosenIpAddress: e.target.value
    })
  }

  renderExistingRules (existingURLRules) {
    return (
      <table className='table'>
        <thead>
          <tr>
            <th>Existing URLs</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {existingURLRules.map((url) => <tr key={url}><td>{url}</td><td><a type='button' className='btn btn-danger' onClick={this.props.deleteURLRule.bind(this, url)}>Delete</a></td></tr>)}
        </tbody>
      </table>
    )
  }

  render () {
    const { port, ipAddresses, existingURLRules, addURLRule } = this.props

    return (
      <div className='row'>
        <div className='col-md-12'>
          <div className='panel panel-default'>
            <div className='panel-body'>
              <fieldset disabled={port === ''}>
                <div className='form-group'>
                  <label htmlFor='chosenIpAddress' className='control-label col-md-12'>IP Address</label>
                  <div className='col-md-4'>
                    <select className='form-control' id='chosenIpAddress' value={this.state.chosenIpAddress} onChange={this.handleChangeIp}>
                      <option>Choose...</option>
                      {ipAddresses.map((ip) => <option key={ip.ipAddress} value={ip.ipAddress}>{`${ip.name} - ${ip.ipAddress}`}</option>)}
                    </select>
                  </div>
                  <a type='button' className='btn btn-primary' onClick={addURLRule.bind(this, this.state.chosenIpAddress)}>Allow connections to this IP</a>
                </div>
              </fieldset>
            </div>
            {existingURLRules.length > 0 ? this.renderExistingRules(existingURLRules) : null}
          </div>
        </div>
      </div>
    )
  }
}

UrlAcl.propTypes = {
  port: PropTypes.string.isRequired,
  ipAddresses: PropTypes.array.isRequired,
  addURLRule: PropTypes.func.isRequired,
  ruleAdded: PropTypes.bool.isRequired,
  existingURLRules: PropTypes.array.isRequired,
  deleteURLRule: PropTypes.func.isRequired
}
