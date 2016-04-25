import React, { Component } from 'react'

export default class Message extends Component {
  render () {
    let messageIp = this.props.messageIp
    let messagePort = this.props.messagePort
    let markUp = <div></div>

    if (messageIp && messagePort) {
      markUp = (
        <div className='alert alert-success' role='alert'>
          Ready to accept requests at <strong>http://{messageIp}:{messagePort}/</strong>
        </div>
      )
    }

    return markUp
  }
}
