'use strict';

import React from 'react';
import {connect} from 'react-redux';
import AuthPage from './AuthPage.jsx'
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


const getPageContent = (authData) => {
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

class App extends React.Component {
    componentWillMount() {
        this.props.fetchAuthData();
    }

    render() {
        return (
            <div>
                <h1>Heshbon 2</h1>
                <button onClick={this.props.signOut}>
                    <span>Sign out</span>
                </button>
                {getPageContent(this.props.authData)}
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
