import * as _ from 'lodash';
import React from 'react';
import {connect} from 'react-redux';
import TagsInput from './TagsInput.jsx'
import {
    fetchTransactions,
    updateRecordTags,
    updateCardTransactionsAdditionalData,
    additionalDataDefaults,
    TRANSACTION_STATUSES
} from '../redux/actions/transactionsActions'

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

        this.state = {
            additionalDataUpdates: {}
        }

        this.handleDataUpdate = (rowKey, nextAdditionalData, prevAdditionalData) => {
            const {tags: prevTags} = prevAdditionalData

            const newData = {
                ...nextAdditionalData
            }

            if (newData.tags.length === 1 && prevTags.length === 0 && !newData.isRead) {
                newData.isRead = true
            }

            const additionalDataUpdates = {
                ...this.state.additionalDataUpdates,
                [rowKey]: newData
            }
            this.setState({additionalDataUpdates})
        }

        this.saveChanges = () => {
            const cardsTransactionsToUpdate = _.reduce(this.state.additionalDataUpdates, (acc, data, key) => {
                const [cardKey, transactionIndex] = key.split('-')

                acc[cardKey] = acc[cardKey] || {}
                acc[cardKey][transactionIndex] = data

                return acc
            }, {})

            _.forEach(cardsTransactionsToUpdate, (cardAdditionalData, cardKey) => updateCardTransactionsAdditionalData(cardKey, cardAdditionalData))
        }
    }

    componentWillMount() {
        this.props.fetchTransactions();
    }

    render() {
        const transactions = this.props.transactions.map((t, index) => {
            const key = `${t.cardKey}-${t.transactionIndex}`
            const dataOverrides = this.state.additionalDataUpdates[key] || {}
            const currentAdditionalData = {
                isRead: t.isRead,
                tags: t.tags,
                ...dataOverrides
            }
            const {isRead, tags} = currentAdditionalData
            return (
                <li className="transaction" key={key}>
                    <span className="transaction-isRead"><input type="checkbox" tabIndex="-1" checked={isRead} onChange={(event) => this.handleDataUpdate(key, {tags, isRead: event.target.checked}, currentAdditionalData)}/></span>
                    <span className="transaction-name">{t.name}</span>
                    <span className="transaction-date">{t.date}</span>
                    <span className="transaction-amount">{t.amount}</span>
                    <span className="transaction-tags"><TagsInput tags={tags} onChange={(_tags) => this.handleDataUpdate(key, {tags: _tags, isRead}, currentAdditionalData)}/></span>
                </li>
            )
        })
        return (
            <div>
                <button onClick={this.saveChanges}>
                    <span>שמור</span>
                </button>
                <ul className="transactions">
                    <li className="transaction-head">
                        <span>נקרא?</span>
                        <span>שם</span>
                        <span>תאריך</span>
                        <span>סכום</span>
                        <span>קטגוריות</span>
                    </li>
                    {transactions}
                </ul>

            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Transactions);
