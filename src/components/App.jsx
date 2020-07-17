'use strict';

import React from 'react';
import {connect} from 'react-redux';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";

import AuthPage from './AuthPage.jsx'
import Graphs from './Graphs.jsx'
import Transactions from './Transactions.jsx'
import {fetchAuthData, signOut} from '../redux/actions/authActions'

function mapStateToProps(state) {
    return {
        authData: state.authData
    };
}

const mapDispatchToProps = (dispatch) => ({
    fetchAuthData: () => dispatch(fetchAuthData()),
    signOut: () => dispatch(signOut())
});


const getHomePageContent = (authData) => {
    if (!authData) {
        return (
            <div>
                <AuthPage />
            </div>
        );
    }

    return (
        <div>
            <Transactions />
        </div>
    );
}

const getGraphsPageContent = (authData) => {
    if (!authData) {
        return (
            <div>
                <AuthPage />
            </div>
        );
    }

    return (
        <div>
            <Graphs />
        </div>
    );
}


class App extends React.Component {
    componentWillMount() {
        this.props.fetchAuthData();
    }

    render() {
        return (
            <div>
                <h1>נותנים חשבון</h1>
                {this.props.authData && (
                    <button className="logout-button" onClick={this.props.signOut}>
                        <span>התנתק</span>
                    </button>
                )}
                <Router>
                    <nav id="menu">
                        <ul>
                            <li>
                                <Link to="/">טרנזקציות</Link>
                            </li>
                            <li>
                                <Link to="/graphs">גרפים</Link>
                            </li>
                        </ul>
                    </nav>

                    <Switch>
                        <Route path="/graphs">
                            {getGraphsPageContent(this.props.authData)}
                        </Route>
                        <Route path="/">
                            {getHomePageContent(this.props.authData)}
                        </Route>
                    </Switch>
                </Router>

            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
