import React, { Component, PropTypes } from 'react'

export default class UrlAcl extends Component {
  constructor (props) {
    super(props)

    this.state = {
      chosenIpAddress: ''
    }
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
                  <label htmlFor='chosenIpAddress' className='control-label col-md-12'>Choose IP Address</label>
                  <div className='col-md-4'>
                    <select className='form-control' id='chosenIpAddress'>
                      {ipAddresses.map((ip) => <option key={ip.ipAddress} value={ip.ipAddress}>{`${ip.name} - ${ip.ipAddress}`}</option>)}
                    </select>
                  </div>
                  <a type='button' className='btn btn-primary'>Allow connections to this IP</a>
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
  ipAddresses: PropTypes.array.isRequired
}
