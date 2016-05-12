import React, { Component, PropTypes } from 'react'

export default class ApplicationBinding extends Component {
  constructor (props) {
    super(props)

    this.state = {
      appHostPath: ''
    }
  }

  render () {
    const { port, chosenIpAddress } = this.props
    return (
      <div className='row'>
        <div className='col-md-12'>
          <div className='panel panel-default'>
            <div className='panel-body'>
              <fieldset disabled={port === '' || chosenIpAddress === ''}>
                <div className='form-group'>
                  <label htmlFor='appHostPath' className='control-label col-md-12'>Path to applicationhost.config</label>
                  <div className='col-md-6'>
                    <input type='text' className='form-control' id='appHostPath' value={this.state.appHostPath} />
                  </div>
                </div>
                <div className='form-group'>
                  <a type='button' className='btn btn-primary'>Bind Application</a>
                </div>
              </fieldset>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

ApplicationBinding.propTypes = {
  port: PropTypes.string.isRequired,
  chosenIpAddress: PropTypes.string.isRequired,
  bindApplicationToIp: PropTypes.func.isRequired
}
