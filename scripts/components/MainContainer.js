var ipc = window.require('ipc');

import React from "react";
import ConfigForm from "./ConfigForm";
import Message from "./Message";

var MainContainer = React.createClass({
    getInitialState: function() {
        var configInitialValues = {};
        configInitialValues.hostIp = this.getHostIpAddress();
        configInitialValues.port = '55500';
        configInitialValues.appHostConfigPath = 'C:\\temp\\individualshoppingapi\\.vs\\config\\applicationhost.bkp.config';

        return { message: '', configInitialValues: configInitialValues};
    },

    getHostIpAddress: function() {
        return ipc.sendSync('get-ip');
    },

    handleMessageUpdate: function(message) {
        this.setState({ message: message });
    },

    render: function() {
        return (
            <div className="row">
                <ConfigForm configInitialValues={this.state.configInitialValues} updateMessage={this.handleMessageUpdate}/>
                <Message message={this.state.message} />
            </div>
        );
    }
});

export default MainContainer;
