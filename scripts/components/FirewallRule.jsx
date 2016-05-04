import React from 'react'

const FirewallRule = ({addFirewallRule}) => {
  return (
    <div className='row'>
      <div className='col-md-12'>
        <div className='panel panel-default'>
          <div className='panel-body'>
            <div className='form-inline'>
              <div className='form-group'>
                <label htmlFor='port'>Port</label>
                <input type='text' className='form-control' id='port' placeholder='55500' />
              </div>
              <a onClick={addFirewallRule} type='button' className='btn btn-default'>Add Firewall Rule</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FirewallRule
