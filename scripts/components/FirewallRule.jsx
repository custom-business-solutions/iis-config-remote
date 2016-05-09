import React, { Component, PropTypes } from 'react'

export default class FirewallRule extends Component {
  constructor (props) {
    super(props)

    this.handleChange = this.handleChange.bind(this)
    this.handleAdd = this.handleAdd.bind(this)
    this.handleDelete = this.handleDelete.bind(this)

    this.state = {
      'port': {
        'value': '',
        'error': '',
        'touched': false
      }
    }
  }

  handleChange (e) {
    this.setState({
      'port': { ...this.state.port, 'value': e.target.value }
    })
  }

  handleAdd (e) {
    e.preventDefault()

    this.props.addFirewallRule(this.state.port.value)
  }

  handleDelete (e) {
    e.preventDefault()
    this.props.deleteFirewallRule(this.state.port.value)
  }

  validate (portValue) {
    var newState = {
      'value': portValue,
      'touched': true,
      'error': ''
    }

    const regex = /^\d+$/
    if (!regex.test(portValue)) {
      newState.error = 'Port should include numbers only'
    }
    if (portValue === '') {
      newState.error = 'Required'
    }

    this.setState({
      'port': newState
    })
  }

  renderButton (ruleAdded) {
    if (ruleAdded) {
      return (<a type='button' className='btn btn-danger' onClick={this.handleDelete}>Delete Firewall Rule</a>)
    } else {
      return (<a type='button' className='btn btn-primary' onClick={this.handleAdd}>Add Firewall Rule</a>)
    }
  }

  render () {
    return (
      <div className='row'>
        <div className='col-md-12'>
          <div className='panel panel-default'>
            <div className='panel-body'>
              <div className='form-inline'>
                <div className='form-group'>
                  <label htmlFor='port' className='control-label'>Port</label>
                  <input type='text' className='form-control' id='port' placeholder='55500' value={this.state.port.value} onChange={this.handleChange}
                    readOnly={this.props.ruleAdded} />
                </div>
                <div className='form-group'>
                  {this.renderButton(this.props.ruleAdded)}
                </div>
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
