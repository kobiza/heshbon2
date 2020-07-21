import React, { Component } from 'react';
import {connect} from "react-redux";
import TagsInput from "./TagsInput.jsx";
import * as _ from "lodash";
import {filter, sortByDate} from "../utils/transactionsUtils";
import BarChart from './graphs/BarChart.jsx'
import TransactionsGrid from './TransactionsGrid.jsx'
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField/TextField";
import Paper from "@material-ui/core/Paper/Paper";
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    paper: {
        marginTop: theme.spacing(3),
            marginBottom: theme.spacing(3),
            padding: theme.spacing(2),
            [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
            marginTop: theme.spacing(1),
                marginBottom: theme.spacing(6),
                padding: theme.spacing(3),
        },
    },
})

const getTransactionMonth = t => t.date.slice(-7)

function mapStateToProps(state) {
    return {
        transactions: state.transactions
    };
}

const formatted2DigitsNumber = number =>  ("0" + number).slice(-2);

const toMonthInputDateFormat = (date) => {
    const month = formatted2DigitsNumber(date.getMonth() + 1)
    const year = date.getFullYear()

    return `${year}-${month}`
}

class MonthCostsGraphs extends Component {
    constructor(props) {
        super(props);

        const currentDate = new Date()
        const prev6MonthDate = new Date()
        prev6MonthDate.setMonth(prev6MonthDate.getMonth() - 6)

        this.state = {
            startMonth: toMonthInputDateFormat(prev6MonthDate),
            endMonth: toMonthInputDateFormat(currentDate),
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
        const { classes } = this.props

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
                <Paper className={classes.paper}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={3}>
                            <TextField
                                label="מחודש"
                                type="month"
                                value={this.state.startMonth} onChange={event => this.updateStartMonth(event.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <TextField
                                label="עד חודש"
                                type="month"
                                value={this.state.endMonth} onChange={event => this.updateEndMonth(event.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12}>
                            <div className="input-box with-top-label">
                                <label className="date-label">קטגוריות</label>
                                <TagsInput tags={this.state.tagsFilter} onChange={this.updateTagsFilter}/>
                            </div>
                        </Grid>
                    </Grid>
                </Paper>
                <div style={{height: '300px', width: '100%'}}>
                    <BarChart data={monthCostsData} groupKey="month" bars={bars}></BarChart>
                </div>

                <TransactionsGrid transactions={transactionsToShow}/>
            </div>
        );
    }
}

export default connect(mapStateToProps)(withStyles(styles)(MonthCostsGraphs));
