import _ from 'lodash'
import React, { Component } from 'react';
import BarChart from '../graphs/BarChart.jsx'

const getTransactionMonth = t => t.date.slice(-7)
const getTransactionCategory = t => {
    const categoriesMap = _.reduce(t.tags, (acc, tag) => {
        acc[tag] = true

        return acc
    }, {})

    const hasCategory = (category) => !!categoriesMap[category]

    if (hasCategory('חד פעמי')) {
        return 'once'
    }

    if (hasCategory('מגורים וחשבונות תקופתיים')) {
        return 'fixed'
    }

    if (hasCategory('מחיה וקניות שוטפות')) {
        return 'variable'
    }

    if (hasCategory('הוצאות נסיעה ורכב')) {
        return 'car'
    }

    if (hasCategory('פנאי ובילויים')) {
        return 'pleasure'
    }

    if (hasCategory('שונות')) {
        return 'others'
    }

    if (hasCategory('חריג')) {
        return 'irregular'
    }

    return 'unknown'
}

export default class CategoriesInMonthGraph extends Component {

    render() {
        const transactionsInMonth = _.groupBy(this.props.transactions, getTransactionMonth)
        const monthCategories = _.mapValues(transactionsInMonth, monthTransactions => {
            const monthCategories = _.groupBy(monthTransactions, getTransactionCategory)

            return _.defaults(monthCategories, {
                'fixed': [],
                'once': [],
                'variable': [],
                'car': [],
                'pleasure': [],
                'others': [],
                'irregular': [],
                'unknown': [],
            })
        })

        const dataObj = _.mapValues(monthCategories, (categories, month) => {
            const categoriesNumbers = _.mapValues(categories, catTransactions => Math.ceil(_.sum(catTransactions.map(t => t.amount))))

            return {
                month,
                ...categoriesNumbers
            }
        })

        const tagsColors = {
            'fixed': '#f9ca24',
            'once': '#ffbe76',
            'variable': '#badc58',
            'car': '#686de0',
            'pleasure': '#e056fd',
            'others': '#c7ecee',
            'irregular': '#ff7979',
            'unknown': '#cccccc',
        }

        const data = _.values(dataObj)
        const bars = [
            {
                dataKey: 'fixed',
                name: 'מגורים וחשבונות תקופתיים',
                color: tagsColors.fixed,
                stackId: 'a'
            },
            {
                dataKey: 'variable',
                name: 'מחיה וקניות שוטפות',
                color: tagsColors.variable,
                stackId: 'a'
            },
            {
                dataKey: 'car',
                name: 'הוצאות נסיעה ורכב',
                color: tagsColors.car,
                stackId: 'a'
            },
            {
                dataKey: 'pleasure',
                name: 'פנאי ובילויים',
                color: tagsColors.pleasure,
                stackId: 'a'
            },
            {
                dataKey: 'others',
                name: 'שונות',
                color: tagsColors.others,
                stackId: 'a'
            },
            {
                dataKey: 'once',
                name: 'חד פעמי',
                color: tagsColors.once,
                stackId: 'a'
            },
            {
                dataKey: 'unknown',
                name: 'לא ידוע',
                color: tagsColors.unknown,
                stackId: 'a'
            },
            {
                dataKey: 'irregular',
                name: 'חריג',
                color: tagsColors.irregular,
                stackId: 'a'
            },
        ]
        return (
            <div className="graph-1" style={this.props.style}>
                <BarChart data={data} groupKey="month" bars={bars}></BarChart>
            </div>
        );
    }
}
