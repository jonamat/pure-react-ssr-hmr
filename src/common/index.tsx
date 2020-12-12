import React, { FC } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

// Components
import Home from './components/Home';
import RouterTest from './components/RouterTest';

// Styles
import './assets/scss/index.scss';

const Wrapper: FC = () => (
    <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/router-test" component={RouterTest} />
        <Redirect from="/redirect-test" to="/router-test" />
        <Route render={() => '404 ok!'} />
    </Switch>
);

export default Wrapper;
