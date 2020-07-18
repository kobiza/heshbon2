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

const toTagsMap = (tags) => {
    return _.reduce(tags, (acc, tag) => {
        acc[tag] = true
        return acc
    }, {})
}

const joinTagsMap = (prevTags, newTags) => {
    if (_.isEmpty(prevTags)) {
        return newTags
    }
    if (_.isEmpty(newTags)) {
        return prevTags
    }
    const allTagsMap = {
        ...prevTags,
        ...newTags
    }

    return _.pickBy(_.mapValues(allTagsMap, (v, tagName) => {
        return prevTags[tagName] && newTags[tagName]
    }))
}

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
class TransactionsAutoTags extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            additionalDataUpdates: {},
            isAutoActive: false,
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

        this.handleDataUpdate = (rowKey, nextAdditionalData, initAdditionalData) => {
            const additionalDataUpdates = {
                ...this.state.additionalDataUpdates,
                [rowKey]: _.isEqual(nextAdditionalData, initAdditionalData) ? {} : nextAdditionalData
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

        this.autoTag = () => {
            const allReadTransactions = this.props.transactions.filter(t => t.isRead)
            const allUnreadTransactions = this.props.transactions.filter(t => !t.isRead)
            const allNamesTags = _.reduce(allReadTransactions, (names, t) => {
                const prevTagsMap = names[t.name] || {}
                const newTagsMap = toTagsMap(t.tags)
                names[t.name] = joinTagsMap(prevTagsMap, newTagsMap)

                return names;
            }, {})

            const allNamesTagsArr = _.mapValues(allNamesTags, tagsMap => _.keys(tagsMap))

            const additionalDataUpdates = _.reduce(allUnreadTransactions, (acc, t) => {
                const tagsToAdd = allNamesTagsArr[t.name]
                if (tagsToAdd) {
                    const key = `${t.cardKey}-${t.transactionIndex}`

                    acc[key] = {tags: tagsToAdd, isRead: true}
                }

                return acc
            })

            this.setState({additionalDataUpdates, isAutoActive: true})
        }
    }

    componentWillMount() {
        this.props.fetchTransactions();
    }

    render() {
        // add filter here + move start button next to filter fiels, after start filter, show only changed trans
        const filterOptions = _.pick(this.state, ['showRead', 'startMonth', 'endMonth', 'tagsFilter'])
        const filteredTransactions = filter(this.props.transactions, filterOptions)
        const transactionToCheck = !this.state.isAutoActive ? filteredTransactions : _.filter(filteredTransactions, t => {
            const key = `${t.cardKey}-${t.transactionIndex}`

            return !!this.state.additionalDataUpdates[key]
        })
        const transactionsToShow = sortByDate(transactionToCheck)
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
                        <span className="transaction-isRead"><input type="checkbox" checked={isRead} onChange={(event) => this.handleDataUpdate(key, {tags, isRead: event.target.checked}, initAdditionalData)}/></span>
                        <span className="transaction-name">{t.name}</span>
                        <span className="transaction-date">{t.date}</span>
                        <span className="transaction-amount">{t.amount}</span>
                        <span className="transaction-tags"><TagsInput inputTabIndex="-1" tags={tags} onChange={() => {}}/></span>
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
                    <div className="row-3-1-inputs">
                        <div className="input-box with-top-label">
                            <label className="date-label">קטגוריות</label>
                            <TagsInput tags={this.state.tagsFilter} onChange={this.updateTagsFilter}/>
                        </div>
                        <button onClick={this.autoTag}>הצע</button>
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
                <button className="action-button" onClick={this.saveChanges}>☁️ שמור</button>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TransactionsAutoTags);
