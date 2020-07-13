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

        //tags: []
        //isChecked: bool
        //isSuspicious: bool
        this.state = {
            additionalDataUpdates: {}
        }
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
        // this.handleTagUpdate = (cardKey, transactionIndex, tags) => updateRecordTags(cardKey, transactionIndex, tags)
        this.handleDataUpdate = (rowKey, additionalData) => {
            const prevTags = this.state.additionalDataUpdates[rowKey] ? this.state.additionalDataUpdates[rowKey].tags : []

            const newData = {
                ...additionalData
            }

            if (newData.tags.length === 1 && prevTags.length === 0 && newData.status === TRANSACTION_STATUSES.NEW) {
                newData.status = TRANSACTION_STATUSES.CHECKED
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
        // const allTags = this.props.tags
        const transactions = this.props.transactions.map((t, index) => {
            const key = `${t.cardKey}-${t.transactionIndex}`
            const dataOverrides = this.state.additionalDataUpdates[key] || {}
            const {status, tags} = {
                status: t.status,
                tags: t.tags,
                ...dataOverrides
            }
            return (
                <li className="transaction" key={key}>
                    <span className="transaction-name">{t.name}</span>
                    <span className="transaction-date">{t.date}</span>
                    <span className="transaction-amount">{t.amount}</span>
                    <span className="transaction-isInIsrael">{t.isInIsrael ? 'IL' : 'COM'}</span>
                    <span className="transaction-status">{status}</span>
                    <TagsInput tags={tags} onChange={(_tags) => this.handleDataUpdate(key, {tags: _tags, status})}/>
                </li>
            )
        })
        return (
            <div>
                <button onClick={this.saveChanges}>
                    <span>שמור</span>
                </button>
                <ul className="transactions">
                    {transactions}
                </ul>

            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Transactions);
