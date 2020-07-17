import * as _ from 'lodash';
import React from 'react';
import classNames from 'classnames'
import {connect} from 'react-redux';
import TagsInput from './TagsInput.jsx'
import {
    fetchTransactions,
    updateCardTransactionsAdditionalData,
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
            additionalDataUpdates: {},
            showRead: false
        }

        this.togglesSowRead = (showRead) => {
            this.setState({showRead})
        }

        this.handleDataUpdate = (rowKey, nextAdditionalData, prevAdditionalData, initAdditionalData) => {
            const {tags: prevTags} = prevAdditionalData

            const newData = {
                ...nextAdditionalData
            }

            if (newData.tags.length === 1 && prevTags.length === 0 && !newData.isRead) {
                newData.isRead = true
            }

            const additionalDataUpdates = {
                ...this.state.additionalDataUpdates,
                [rowKey]: _.isEqual(newData, initAdditionalData) ? {} : newData
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
            const hasChanges = !_.isEmpty(dataOverrides)
            const initAdditionalData = {
                isRead: t.isRead,
                tags: t.tags,
            }
            const currentAdditionalData = {
                ...initAdditionalData,
                ...dataOverrides
            }
            const {isRead, tags} = currentAdditionalData
            return (
                <li className={classNames("transaction", {'has-changes': hasChanges})} key={key}>
                    <span className="transaction-isRead"><input type="checkbox" tabIndex="-1" checked={isRead} onChange={(event) => this.handleDataUpdate(key, {tags, isRead: event.target.checked}, currentAdditionalData, initAdditionalData)}/></span>
                    <span className="transaction-name">{t.name}</span>
                    <span className="transaction-date">{t.date}</span>
                    <span className="transaction-amount">{t.amount}</span>
                    <span className="transaction-tags"><TagsInput tags={tags} onChange={(_tags) => this.handleDataUpdate(key, {tags: _tags, isRead}, currentAdditionalData, initAdditionalData)}/></span>
                </li>
            )
        })
        return (
            <div>
                <div className="toolbar">
                    <button onClick={this.saveChanges}>
                        <span>שמור</span>
                    </button>
                    <input type="checkbox" checked={this.state.showRead} onChange={event => this.togglesSowRead(event.target.checked)}/>
                </div>
                <ul className="transactions">
                    {this.props.transactions.length > 0 && (
                        <li className="transaction-head">
                            <span>נקרא?</span>
                            <span>שם</span>
                            <span>תאריך</span>
                            <span>סכום</span>
                            <span>קטגוריות</span>
                        </li>
                    )}
                    {transactions}
                </ul>

            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Transactions);
