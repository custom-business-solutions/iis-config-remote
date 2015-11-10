var ipc = window.require('ipc');

import React from "react";

class ConfigForm extends React.Component {
    componentDidMount() {
        this.refs.hostIp.value = this.getHostIpAddress();
        this.refs.port.value = '55500';
        this.refs.windowsUser.value = 'ber21413';
        this.refs.appHostConfigPath.value = 'C:\\Users\\ber21413\\My Documents\\IISExpress\\config\\applicationhost.config';
    }

    getHostIpAddress() {
        return ipc.sendSync('get-ip');
    }

    render() {
        return <form className="form-horizontal">
            <div className="form-group">
                <label htmlFor="host-ip" className="col-sm-3 control-label">Host IP</label>
                <div className="col-sm-4">
                    <input type="text" className="form-control" id="host-ip" placeholder="10.11.x.x" ref="hostIp" />
                </div>
            </div>
            <div className="form-group">
                <label htmlFor="port" className="col-sm-3 control-label">Port</label>
                <div className="col-sm-4">
                    <input type="text" className="form-control" id="port" placeholder="55500" ref="port" />
                </div>
            </div>
            <div className="form-group">
                <label htmlFor="windows-user" className="col-sm-3 control-label">Windows User</label>
                <div className="col-sm-4">
                    <input type="text" className="form-control" id="windows-user" ref="windowsUser" />
                </div>
            </div>
            <div className="form-group">
                <label htmlFor="app-host-config-path" className="col-sm-3 control-label">applicationhost.config Path</label>
                <div className="col-sm-6">
                    <input type="text" className="form-control" id="app-host-config-path" ref="appHostConfigPath" />
                </div>
            </div>
            <div className="form-group">
                <div className="col-sm-offset-3 col-sm-4">
                    <button className="btn btn-primary">Bam!</button>
                </div>
            </div>
        </form>;
    }
}

export default ConfigForm;
