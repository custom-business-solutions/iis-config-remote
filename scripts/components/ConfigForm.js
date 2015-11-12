var ipc = window.require('ipc');

import React from "react";

var ConfigForm = React.createClass({

    handleClick: function(e) {
        e.preventDefault();
        var data = {
            newIp: this.hostIp.value,
            port: this.port.value,
            appConfig: this.appHostConfigPath.value
        };
        data.oldIp = ipc.sendSync('get-old-ip', data.appConfig, data.port);

        if (this.updateAppConfig(data)) {
            console.log(this.addUrlAclEntry(data));
        }
    },

    updateAppConfig: function(data) {
        return ipc.sendSync('update-apphost-config', data);
    },

    addUrlAclEntry: function(data) {
        return ipc.sendSync('add-urlacl-entry', data);
    },

    render: function() {
        return (
            <form className="form-horizontal">
                <div className="form-group">
                    <label htmlFor="host-ip" className="col-sm-3 control-label">Host IP</label>
                    <div className="col-sm-4">
                        <input type="text" className="form-control" placeholder="10.11.x.x" defaultValue={this.props.configInitialValues.hostIp} ref={(ref) => this.hostIp = ref} />
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="port" className="col-sm-3 control-label">Port</label>
                    <div className="col-sm-4">
                        <input type="text" className="form-control" id="port" placeholder="55500" defaultValue={this.props.configInitialValues.port} ref={(ref) => this.port = ref} />
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="app-host-config-path" className="col-sm-3 control-label">applicationhost.config Path</label>
                    <div className="col-sm-6">
                        <input type="text" className="form-control" id="app-host-config-path" defaultValue={this.props.configInitialValues.appHostConfigPath} ref={(ref) => this.appHostConfigPath = ref} />
                    </div>
                </div>
                <div className="form-group">
                    <div className="col-sm-offset-3 col-sm-4">
                        <button type="button" className="btn btn-primary" onClick={this.handleClick}>Bam!</button>
                    </div>
                </div>
            </form>
        );
    }
});

export default ConfigForm;
