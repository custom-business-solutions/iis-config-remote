var ipc = window.require('ipc');

import React from "react";
import ConfigForm from "./ConfigForm";

var MainContainer = React.createClass({
    getInitialState: function() {
        var configInitialValues = {};
        configInitialValues.hostIp = this.getHostIpAddress();
        configInitialValues.port = '55500';
        configInitialValues.appHostConfigPath = 'C:\\temp\\individualshoppingapi\\.vs\\config\\applicationhost.bkp.config';

        return { configInitialValues: configInitialValues};
    },

    getHostIpAddress: function() {
        return ipc.sendSync('get-ip');
    },

    render: function() {
        return (
            <div className="row">
                <ConfigForm configInitialValues={this.state.configInitialValues} />
            </div>
        );
    }
});

export default MainContainer;
