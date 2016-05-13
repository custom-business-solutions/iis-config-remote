import React, { Component, PropTypes } from 'react'

export default class ApplicationBinding extends Component {
  constructor (props) {
    super(props)

    this.handleChange = this.handleChange.bind(this)
    this.renderMessage = this.renderMessage.bind(this)

    this.state = {
      appHostPath: ''
    }
  }

  handleChange (e) {
    this.setState({
      appHostPath: e.target.value
    })
  }

  renderMessage () {
    return (
      <div className='alert alert-success' role='alert'>
        Ready to accept requests at <strong>http://{this.props.chosenIpAddress}:{this.props.port}/</strong>
      </div>
    )
  }

  render () {
    const { port, chosenIpAddress, bindApplicationToIp, appBoundInAppHost } = this.props
    return (
      <div className='row'>
        <div className='col-md-12'>
          <div className='panel panel-default'>
            <div className='panel-body'>
              <fieldset disabled={port === '' || chosenIpAddress === ''}>
                <div className='form-group'>
                  <label htmlFor='appHostPath' className='control-label col-md-12'>Path to applicationhost.config</label>
                  <div className='col-md-6'>
                    <input type='text' className='form-control' id='appHostPath' value={this.state.appHostPath} onChange={this.handleChange} />
                  </div>
                </div>
                <div className='form-group'>
                  <a type='button' className='btn btn-primary' onClick={bindApplicationToIp.bind(this, this.state.appHostPath)}>Bind Application</a>
                </div>
              </fieldset>
              {appBoundInAppHost ? this.renderMessage() : null}
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
  bindApplicationToIp: PropTypes.func.isRequired,
  appBoundInAppHost: PropTypes.bool.isRequired
}
