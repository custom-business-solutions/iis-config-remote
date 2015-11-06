import React from "react";

class ConfigForm extends React.Component {
    render() {
        return <form className="form-horizontal">
            <div className="form-group">
                <label for="host-ip" className="col-sm-2 control-label">Host IP</label>
                <div className="col-sm-4">
                    <input type="text" className="form-control" name="host-ip" placeholder="10.11.x.x" />
                </div>
            </div>
            <div className="form-group">
                <div className="col-sm-offset-2 col-sm-4">
                    <button className="btn btn-primary">Bam!</button>
                </div>
            </div>
        </form>;
    }
}

export default ConfigForm;
