import React, { Component } from 'react';
import {connect} from "react-redux";
import TagsInput from "./TagsInput.jsx";
import * as _ from "lodash";
import {filter, sortByDate} from "../utils/transactionsUtils";
import BarChart from './graphs/BarChart.jsx'
import TransactionsGrid from './TransactionsGrid.jsx'

const getTransactionMonth = t => t.date.slice(-7)

function mapStateToProps(state) {
    return {
        transactions: state.transactions
    };
}

class MonthCostsGraphs extends Component {
    constructor(props) {
        super(props);

        this.state = {
            startMonth: '',
            endMonth: '',
            tagsFilter: []
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
    }
    render() {
        const filterOptions = _.pick(this.state, ['startMonth', 'endMonth', 'tagsFilter'])
        const filteredTransactions = filter(this.props.transactions, filterOptions)
        const transactionsToShow = sortByDate(filteredTransactions)
        const transactionsInMonth = _.groupBy(transactionsToShow, getTransactionMonth)
        const monthCosts = _.mapValues(transactionsInMonth, (transactions, month) => ({
            month,
            costs: Math.ceil(_.sum(transactions.map(t => t.amount)))
        }))
        const monthCostsData = _.values(monthCosts)
        const bars = [
            {
                dataKey: 'costs',
                name: 'הוצאות',
                color: '#ffc658',
                stackId: undefined
            }
        ]

        return (
            <div className="graphs-page">
                <div className="toolbar month-graph-toolbar">
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
                    <div className="row-1-input">
                        <div className="input-box with-top-label">
                            <label className="date-label">קטגוריות</label>
                            <TagsInput tags={this.state.tagsFilter} onChange={this.updateTagsFilter}/>
                        </div>

                    </div>
                </div>
                <BarChart data={monthCostsData} groupKey="month" bars={bars}></BarChart>
                <TransactionsGrid transactions={transactionsToShow}/>
            </div>
        );
    }
}

export default connect(mapStateToProps)(MonthCostsGraphs);
