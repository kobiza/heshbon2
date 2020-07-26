import React, { Component } from 'react';
import {connect} from "react-redux";
import TagsInput from "./buildingBlocks/TagsInput.jsx";
import * as _ from "lodash";
import {filter} from "../utils/transactionsUtils";
import TransactionsGrid from './buildingBlocks/TransactionsGrid.jsx'
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField/TextField";
import Paper from "@material-ui/core/Paper/Paper";
import { withStyles } from '@material-ui/core/styles';
import CategoriesInMonthGraph from "./customGraphs/CategoriesInMonthGraph.jsx";
import TagDataLists from "./buildingBlocks/TagDataLists.jsx";

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

class CategoriesInMonthPage extends Component {
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

        return (
            <div className="graphs-page">
                <TagDataLists/>
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
                <CategoriesInMonthGraph transactions={filteredTransactions} style={{width: '100%', height: '300px'}}/>

                <TransactionsGrid transactions={filteredTransactions}/>
            </div>
        );
    }
}

export default connect(mapStateToProps)(withStyles(styles)(CategoriesInMonthPage));
