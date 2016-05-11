import React, { Component, PropTypes } from 'react'

export default class UrlAcl extends Component {
  constructor (props) {
    super(props)

    this.handleChangeIp = this.handleChangeIp.bind(this)
    this.handleAddIp = this.handleAddIp.bind(this)

    this.state = {
      chosenIpAddress: ''
    }
  }

  handleChangeIp (e) {
    this.setState({
      chosenIpAddress: e.target.value
    })
  }

  handleAddIp (e) {
    e.preventDefault()
    this.props.addURLRule(this.state.chosenIpAddress)
  }

  render () {
    const { port, ipAddresses } = this.props

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
                  <a type='button' className='btn btn-primary' onClick={this.handleAddIp}>Allow connections to this IP</a>
                </div>
              </fieldset>
            </div>
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
  ruleAdded: PropTypes.bool.isRequired
}
