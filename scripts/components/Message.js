import React from "react";

var Message = React.createClass({
    render: function() {
        let messageIp = this.props.messageIp;
        let messagePort = this.props.messagePort;
        let markUp = <div></div>;

        if (messageIp && messagePort) {
            markUp = <div className="alert alert-success" role="alert">
                Ready to accept requests at <strong>http://{messageIp}:{messagePort}/</strong>
            </div>;
        }

        return markUp;
    }
});

export default Message;
