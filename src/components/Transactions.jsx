import * as _ from 'lodash';
import React from 'react';
import classNames from 'classnames'
import {connect} from 'react-redux';
import TagsInput from './TagsInput.jsx'
import {filter, sortByDate} from "../utils/transactionsUtils";
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
            showRead: false,
            startMonth: '',
            endMonth: '',
            tagsFilter: []
        }

        this.togglesSowRead = (showRead) => {
            this.setState({showRead})
        }
        this.updateStartMonth = (startMonth) => {
            this.setState({startMonth})
        }
        this.updateEndMonth = (endMonth) => {
            this.setState({endMonth})
        }
        this.updateTagsFilter = (tagsFilter) => {
            this.setState({tagsFilter})
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
        const filterOptions = _.pick(this.state, ['showRead', 'startMonth', 'endMonth', 'tagsFilter'])
        const transactionsToShow = sortByDate(filter(this.props.transactions, filterOptions))
        const transactions = transactionsToShow
            .map((t, index) => {
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

        const emptyLine = (
            <li className={classNames("transaction", 'empty')}>
                <span>לא נמצאו שורות להציג</span>
            </li>
        )

        return (
            <div>
                <div className="toolbar">
                    <div className="row-4-inputs">
                        <div className="input-box with-top-label">
                            <label className="date-label" htmlFor="start-month">מחודש</label>
                            <input id="start-month" type="month" value={this.state.startMonth} onChange={event => this.updateStartMonth(event.target.value)}/>
                        </div>


                        <div className="input-box with-top-label">
                            <label className="date-label" htmlFor="start-month">עד חודש</label>
                            <input id="end-month" type="month" value={this.state.endMonth} onChange={event => this.updateEndMonth(event.target.value)}/>
                        </div>

                    </div>
                    <div className="row-1-3-inputs">
                        <div className="input-box show-read">
                            <input id="showRead" type="checkbox" checked={this.state.showRead} onChange={event => this.togglesSowRead(event.target.checked)}/>
                            <label htmlFor="showRead">הצג נקראו</label>
                        </div>
                        <div className="input-box with-top-label">
                            <label className="date-label">קטגוריות</label>
                            <TagsInput tags={this.state.tagsFilter} onChange={this.updateTagsFilter}/>
                        </div>

                    </div>
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
                    {this.props.transactions.length > 0 && _.isEmpty(transactionsToShow) ? emptyLine : transactions}
                </ul>
                <button className="save-button" onClick={this.saveChanges}>☁️ שמור</button>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Transactions);
