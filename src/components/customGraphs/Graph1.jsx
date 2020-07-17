import _ from 'lodash'
import React, { Component } from 'react';
import BarChart from '../graphs/BarChart.jsx'


const getTransactionMonth = t => t.date.slice(-7)
const getTransactionCategory = t => {
    if (_.some(t.tags, tagName => tagName === 'קבועות')) {
        return 'fixed'
    }

    if (_.some(t.tags, tagName => tagName === 'משתנות')) {
        if (_.some(t.tags, tagName => tagName === 'חדפ')) {
            return 'variable_once'
        }

        return 'variable'
    }

    return 'unknown'
}

export default class Graph1 extends Component {

    render() {
        const transactionsInMonth = _.groupBy(this.props.transactions, getTransactionMonth)
        const monthCategories = _.mapValues(transactionsInMonth, monthTransactions => {
            const monthCategories = _.groupBy(monthTransactions, getTransactionCategory)

            return _.defaults(monthCategories, {
                'fixed': [],
                'variable_once': [],
                'variable': [],
                'unknown': [],
            })
        })

        const dataObj = _.mapValues(monthCategories, (categories, month) => {
            const categoriesNumbers = _.mapValues(categories, catTransactions => _.sum(catTransactions.map(t => t.amount)))

            return {
                month,
                ...categoriesNumbers
            }
        })

        const data = _.values(dataObj)
        const bars = [
            {
                dataKey: 'fixed',
                name: 'קבועות',
                color: '#ffc658',
                stackId: undefined
            },
            {
                dataKey: 'variable_once',
                name: 'חדפ',
                color: '#8884d8',
                stackId: 'variable'
            },
            {
                dataKey: 'variable',
                name: 'משתנות',
                color: '#82ca9d',
                stackId: 'variable'
            },
            {
                dataKey: 'unknown',
                name: 'לא ידוע',
                color: '#95a5a6',
                stackId: undefined
            },
        ]
        return (
            <div className="graphs-page">
                <BarChart data={data} groupKey="month" bars={bars}></BarChart>
            </div>
        );
    }
}
