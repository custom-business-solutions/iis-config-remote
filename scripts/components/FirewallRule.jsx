import React, { Component, PropTypes } from 'react'

export default class FirewallRule extends Component {
  constructor (props) {
    super(props)

    this.handleChange = this.handleChange.bind(this)
    this.handleClick = this.handleClick.bind(this)

    this.state = {
      'port': ''
    }
  }

  handleChange (e) {
    this.setState({
      'port': e.target.value
    })
  }

  handleClick (e) {
    e.preventDefault()
    this.props.addFirewallRule(this.state.port)
  }

  render () {
    return (
      <div className='row'>
        <div className='col-md-12'>
          <div className='panel panel-default'>
            <div className='panel-body'>
              <div className='form-inline'>
                <div className='form-group'>
                  <label htmlFor='port'>Port</label>
                  <input type='text' className='form-control' id='port' placeholder='55500' value={this.state.port} onChange={this.handleChange} />
                </div>
                <a type='button' className='btn btn-default' onClick={this.handleClick}>Add Firewall Rule</a>
              </div>
              <div>
                {this.props.port}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

FirewallRule.propTypes = {
  addFirewallRule: PropTypes.func.isRequired,
  port: PropTypes.string.isRequired
}
