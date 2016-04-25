var ipcRenderer = window.require('electron').ipcRenderer;

import React from "react";
import ConfigForm from "./ConfigForm";
import Message from "./Message";

import '../../sass/main.scss';

var MainContainer = React.createClass({
    getInitialState: function() {
        var configInitialValues = {};
        configInitialValues.hostIp = this.getHostIpAddress();
        configInitialValues.port = '55500';
        configInitialValues.appHostConfigPath = 'C:\\stash\\individualshoppingapi\\.vs\\config\\applicationhost.config';

        return {
            messageIp: '',
            messageHost: '',
            configInitialValues: configInitialValues
        };
    },

    getHostIpAddress: function() {
        return ipcRenderer.sendSync('get-ip');
    },

    handleMessageUpdate: function(ip, port) {
        this.setState({ messageIp: ip, messagePort: port });
    },

    render: function() {
        return (
            <div className="row">
                <ConfigForm configInitialValues={this.state.configInitialValues} updateMessage={this.handleMessageUpdate}/>
                <Message messageIp={this.state.messageIp} messagePort={this.state.messagePort}/>
            </div>
        );
    }
});

export default MainContainer;
