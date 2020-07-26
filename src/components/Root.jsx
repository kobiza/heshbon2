'use strict';

import React from 'react';
import { Provider } from 'react-redux';
import makeStore from '../redux/makeStore';
import App2 from './App.jsx'

export default class Root extends React.Component {
    render() {
        return (
            <Provider store={makeStore()}>
                <App2/>
            </Provider>
        );
    }
}
