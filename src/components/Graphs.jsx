import _ from 'lodash'
import React, { Component } from 'react';
import AreaChart from './AreaChart.jsx'
import BarChart from './BarChart.jsx'
import {connect} from "react-redux";
import {Bar} from "recharts";

// const data = [
//     {
//         name: 'Page A', 'קבועות': 4000, 'חדפ': 2400, 'משתנות': 2400,
//     },
//     {
//         name: 'Page B', 'קבועות': 3000, 'חדפ': 1398, 'משתנות': 2210,
//     },
//     {
//         name: 'Page C', 'קבועות': 2000, 'חדפ': 9800, 'משתנות': 2290,
//     },
//     {
//         name: 'Page D', 'קבועות': 2780, 'חדפ': 3908, 'משתנות': 2000,
//     },
//     {
//         name: 'Page E', 'קבועות': 1890, 'חדפ': 4800, 'משתנות': 2181,
//     },
//     {
//         name: 'Page F', 'קבועות': 2390, 'חדפ': 3800, 'משתנות': 2500,
//     },
//     {
//         name: 'Page G', 'קבועות': 3490, 'חדפ': 4300, 'משתנות': 2100,
//     },
// ];

function mapStateToProps(state) {
    return {
        transactions: state.transactions
    };
}

const getTransactionMonth = t => t.date.slice(-7)
// use obj has instead of array some
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

class Graphs extends Component {

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
            // <Bar dataKey="קבועות" name="cl" fill="#ffc658" />
            // <Bar dataKey="חדפ" stackId="a" fill="#8884d8" />
            // <Bar dataKey="משתנות" stackId="a" fill="#82ca9d" />
            // <Bar dataKey="לא ידוע" fill="#95a5a6" />
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

export default connect(mapStateToProps)(Graphs);
