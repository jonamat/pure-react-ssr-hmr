import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import Wrapper from '../common/';

ReactDOM.hydrate(
    <BrowserRouter>
        <Wrapper />
    </BrowserRouter>,
    document.getElementById('root'),
);
