'use strict';

import React from 'react';
import {connect} from 'react-redux';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";

import Graphs from './Graphs.jsx'
import Transactions from './Transactions.jsx'
import {loginWithGoogle, fetchAuthData, signOut} from '../redux/actions/authActions'

function mapStateToProps(state) {
    return {
        authData: state.authData
    };
}

const mapDispatchToProps = (dispatch) => ({
    fetchAuthData: () => dispatch(fetchAuthData()),
    loginWithGoogle: () => dispatch(loginWithGoogle()),
    signOut: () => dispatch(signOut())
});

class App extends React.Component {
    componentWillMount() {
        this.props.fetchAuthData();
    }

    render() {
        return (
            <div>
                <Router>
                    <header>
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
                        {!this.props.authData && (
                            <button className="login-button" onClick={this.props.loginWithGoogle}>
                                <span>התחבר</span>
                            </button>
                        )}
                        {this.props.authData && (
                            <button className="logout-button" onClick={this.props.signOut}>
                                <span>התנתק</span>
                            </button>
                        )}
                    </header>

                    <Switch>
                        <Route path="/graphs">
                            {this.props.authData && <Graphs/>}
                        </Route>
                        <Route path="/">
                            {this.props.authData && <Transactions/>}
                        </Route>
                    </Switch>
                </Router>

            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
