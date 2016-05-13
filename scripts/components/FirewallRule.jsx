import React, { Component, PropTypes } from 'react'

export default class FirewallRule extends Component {
  constructor (props) {
    super(props)

    this.handleChange = this.handleChange.bind(this)
    this.renderButton = this.renderButton.bind(this)

    this.state = {
      port: {
        value: '',
        error: '',
        touched: false
      }
    }
  }

  handleChange (e) {
    this.setState({
      port: { ...this.state.port, value: e.target.value }
    })
  }

  renderButton (ruleAdded) {
    const { addFirewallRule, deleteFirewallRule } = this.props
    if (ruleAdded) {
      return (<a type='button' className='btn btn-danger' onClick={deleteFirewallRule.bind(this, this.state.port.value)}>Delete Firewall Rule</a>)
    } else {
      return (<a type='button' className='btn btn-primary' onClick={addFirewallRule.bind(this, this.state.port.value)}>Add Firewall Rule</a>)
    }
  }

  render () {
    return (
      <div className='row'>
        <div className='col-md-12'>
          <div className='panel panel-default'>
            <div className='panel-body'>
              <div className='form-group'>
                <label htmlFor='port' className='control-label col-md-12'>Port</label>
                <div className='col-md-4'>
                  <input type='text' className='form-control' id='port' placeholder='55500' value={this.state.port.value} onChange={this.handleChange} readOnly={this.props.ruleAdded}/>
                </div>
              </div>
              <div className='form-group'>
                {this.renderButton(this.props.ruleAdded)}
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
  deleteFirewallRule: PropTypes.func.isRequired,
  ruleAdded: PropTypes.bool.isRequired
}
