import React from "react";

var Message = React.createClass({
    render: function() {
        let message = this.props.message;
        let markUp = <div></div>;

        if (message) {
            markUp = <div className="alert alert-success" role="alert">
                {message}
            </div>;
        }

        return markUp;
    }
});

export default Message;
