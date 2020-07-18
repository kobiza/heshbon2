'use strict';

import React from 'react';
import {connect} from 'react-redux';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";

import FixedAndVariableCostsGraphs from './FixedAndVariableCostsGraphs.jsx'
import MonthCostsGraphs from './MonthCostsGraphs.jsx'
import Transactions from './Transactions.jsx'
import TransactionsAutoTags from './TransactionsAutoTags.jsx'
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
                                    <Link to="/fixedAndVariableCostsGraphs">גרף קממ</Link>
                                </li>
                                <li>
                                    <Link to="/monthCostsGraphs">גרף חודשים</Link>
                                </li>
                                <li>
                                    <Link to="/TransactionsAutoTags">אוטוטאג</Link>
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
                        <Route path="/fixedAndVariableCostsGraphs">
                            {this.props.authData && <FixedAndVariableCostsGraphs/>}
                        </Route>
                        <Route path="/monthCostsGraphs">
                            {this.props.authData && <MonthCostsGraphs/>}
                        </Route>
                        <Route path="/TransactionsAutoTags">
                            {this.props.authData && <TransactionsAutoTags/>}
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
