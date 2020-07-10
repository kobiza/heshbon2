'use strict';

import React from 'react';
import {render} from 'react-dom';
import Root from './components/Root.jsx';
import * as clientDB from './utils/clientDB';

const firebaseConfig = {
    apiKey: "AIzaSyA4emxQpGmx794Joaf3GrSTTSR-7gqUk10",
    authDomain: "abcd-aa6b5.firebaseapp.com",
    databaseURL: "https://abcd-aa6b5.firebaseio.com",
    projectId: "abcd-aa6b5",
    storageBucket: "abcd-aa6b5.appspot.com",
    messagingSenderId: "316375328458",
    appId: "1:316375328458:web:2baeed2074016b6323f633",
    measurementId: "G-J861XLY0ZV"
};

clientDB.initialize(firebaseConfig);


render(
    <Root/>,
    document.getElementById('app')
);
