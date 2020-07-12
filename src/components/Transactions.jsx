import * as _ from 'lodash';
import React from 'react';
import {connect} from 'react-redux';
import TagsInput from './TagsInput.jsx'
import {fetchTransactions, updateRecordTags} from '../redux/actions/transactionsActions'

function mapStateToProps(state) {
    return {
        transactions: state.transactions,
        tags: state.tags
    };
}

function mapDispatchToProps(dispatch) {
    return {
        fetchTransactions: () => dispatch(fetchTransactions()),
    };
}
class Transactions extends React.Component {
    constructor(props) {
        super(props);
        // this.handleTagDelete = (cardKey, transactionIndex, tags, tagIndex) => {
        //     const updatedTags = tags.filter((tag, index) => index !== tagIndex)
        //
        //     updateRecordTags(cardKey, transactionIndex, updatedTags)
        // }
        // this.handleTagAdd = (cardKey, transactionIndex, tags, tag) => {
        //     const updatedTags = [...tags, tag]
        //
        //     updateRecordTags(cardKey, transactionIndex, updatedTags)
        // }
    }

    componentWillMount() {
        this.props.fetchTransactions();
    }

    render() {
        // const allTags = this.props.tags
        const transactions = Object.values(this.props.transactions).map(t => {
            // const tags = _.map(_.values(t.tags), (tagName) => ({id: tagName, text: tagName}))
            return (
                <li className="transaction">
                    <span className="transaction-name">{t.name}</span>
                    <span className="transaction-date">{t.date}</span>
                    <span className="transaction-amount">{t.amount}</span>
                    <span className="transaction-status">{t.status}</span>
                    <span className="transaction-isInIsrael">{t.isInIsrael.toString()}</span>
                    <TagsInput/>
                </li>
            )
        })
        return (
            <div>

                <ul className="transactions">
                    {transactions}
                </ul>

            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Transactions);
