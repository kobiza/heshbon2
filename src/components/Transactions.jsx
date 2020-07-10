import * as _ from 'lodash';
import React from 'react';
import {connect} from 'react-redux';
import {fetchTransactions} from '../redux/actions/transactionsActions'

function mapStateToProps(state) {
    return {
        transactions: state.transactions,
        authData: state.authData
    };
}

function mapDispatchToProps(dispatch) {
    return {
        fetchTransactions: () => dispatch(fetchTransactions()),
    };
}
class Transactions extends React.Component {
    componentWillMount() {
        this.props.fetchTransactions();
    }

    render() {
        const transactions = Object.values(this.props.transactions).map(t => (
            <li><span>{t.name}</span></li>
        ))
        return (
            <div>
                <p>{this.props.authData.uid}</p>
                <p>{this.props.authData.email}</p>
                <h1>Transactions</h1>
                {transactions}
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Transactions);
