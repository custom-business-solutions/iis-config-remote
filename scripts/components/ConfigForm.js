var ipc = window.require('ipc');

import React from "react";
import _ from "underscore";

var ConfigForm = React.createClass({

    getInitialState: function() {
        return {
            'host-ip': this.props.configInitialValues.hostIp,
            'port': this.props.configInitialValues.port,
            'app-host-config-path': this.props.configInitialValues.appHostConfigPath
        };
    },

    handleClick: function(e) {
        e.preventDefault();
        var data = {
            newIp: this.state['host-ip'],
            port: this.state['port'],
            appConfig: this.state['app-host-config-path']
        };
        data.oldIp = ipc.sendSync('get-old-ip', data.appConfig, data.port);

        if (this.updateAppConfig(data)) {
            this.addUrlAclEntry(data);
            this.addFirewallEntry(data.port);
        }
    },

    updateAppConfig: function(data) {
        return ipc.sendSync('update-apphost-config', data);
    },

    addUrlAclEntry: function(data) {
        return ipc.sendSync('add-urlacl-entry', data);
    },

    addFirewallEntry: function(port) {
        return ipc.sendSync('add-firewall-entry', port);
    },

    handleChange: function(e) {
        var nextState = {};
        nextState[e.target.id] = e.target.value;
        this.setState(nextState);
    },

    render: function() {
        let buttonDisabled = _.some(this.state, function(item) {
            return item === '';
        }) ? 'disabled' : '';

        let buttonClassNames = `btn btn-primary ${buttonDisabled}`;

        return (
            <form className="form-horizontal">
                <div className={this.state['host-ip'] === '' ? 'form-group has-error' : 'form-group'}>
                    <label htmlFor="host-ip" className="col-sm-3 control-label">Host IP</label>
                    <div className="col-sm-4">
                        <input type="text" className="form-control" id="host-ip" onChange={this.handleChange} placeholder="10.11.x.x" value={this.state['host-ip']} />
                    </div>
                </div>
                <div className={this.state['port'] === '' ? 'form-group has-error' : 'form-group'}>
                    <label htmlFor="port" className="col-sm-3 control-label">Port</label>
                    <div className="col-sm-4">
                        <input type="text" className="form-control" id="port" onChange={this.handleChange} placeholder="55500" value={this.state['port']} />
                    </div>
                </div>
                <div className={this.state['app-host-config-path'] === '' ? 'form-group has-error' : 'form-group'}>
                    <label htmlFor="app-host-config-path" className="col-sm-3 control-label">applicationhost.config Path</label>
                    <div className="col-sm-6">
                        <input type="text" className="form-control" id="app-host-config-path" onChange={this.handleChange} value={this.state['app-host-config-path']} />
                    </div>
                </div>
                <div className="form-group">
                    <div className="col-sm-offset-3 col-sm-4">
                        <a href="#" role="button" className={buttonClassNames} onClick={this.handleClick}>Bam!</a>
                    </div>
                </div>
            </form>
        );
    }
});

export default ConfigForm;
