import React from 'react';
import {connect} from 'react-redux';
import * as authActions from '../redux/actions/authActions'

function mapDispatchToProps(dispatch) {
    return {
        loginWithGoogle: () => dispatch(authActions.loginWithGoogle()),

    };
}
class AuthPage extends React.Component {
    render() {
        return (
            <div>
                <button className="login-button" onClick={this.props.loginWithGoogle}>
                    <span>התחבר</span>
                </button>
            </div>
        );
    }
}

export default connect(() => ({}), mapDispatchToProps)(AuthPage);
