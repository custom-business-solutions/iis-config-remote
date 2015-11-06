require('bootstrap-sass!../bootstrap-sass.config.js')

'use strict';

import React from "react";
import ReactDOM from "react-dom";
import MainContainer from "./components/MainContainer";

ReactDOM.render(<MainContainer />,
    document.getElementById('content'));
