import * as _ from 'lodash';
import React from 'react';
import {connect} from 'react-redux';
import TagsInput from './TagsInput.jsx'
import {filter, sortByDate, getTags} from "../utils/transactionsUtils";
import {
    fetchTransactions,
    updateCardTransactionsAdditionalData,
} from '../redux/actions/transactionsActions'

import Table from '@material-ui/core/Table';
import Grid from '@material-ui/core/Grid';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Fab from '@material-ui/core/Fab';
import SaveIcon from '@material-ui/icons/Save';
import Paper from '@material-ui/core/Paper';
import { lighten, withStyles } from '@material-ui/core/styles';
import clsx from "clsx";
import TextField from "@material-ui/core/TextField/TextField";


//70px 310px 100px 70px 1fr
const styles = theme => ({
    readColumn: {
        width: 70
    },
    nameColumn: {
        width: 310
    },
    dateColumn: {
        width: 70
    },
    amountColumn: {
        width: 70
    },
    saveButton: {
        position: 'fixed',
        bottom: 40,
        right: 40,
    },
    // margin: {
    //     margin: theme.spacing(1)
    // },
    extendedIcon: {
        margin: theme.spacing(1)
    },
    highlight: {
        backgroundColor: lighten(theme.palette.secondary.light, 0.85),
    },
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
        transactions: state.transactions,
        tags: state.tags
    };
}

function mapDispatchToProps(dispatch) {
    return {
        fetchTransactions: () => dispatch(fetchTransactions()),
    };
}

const formatted2DigitsNumber = number =>  ("0" + number).slice(-2);

const toMonthInputDateFormat = (date) => {
    const month = formatted2DigitsNumber(date.getMonth() + 1)
    const year = date.getFullYear()

    return `${year}-${month}`
}

class Transactions extends React.Component {
    constructor(props) {
        super(props);

        const currentDate = new Date()
        const prev1MonthDate = new Date()
        prev1MonthDate.setMonth(prev1MonthDate.getMonth() - 1)

        this.state = {
            additionalDataUpdates: {},
            showRead: false,
            startMonth: toMonthInputDateFormat(prev1MonthDate),
            endMonth: toMonthInputDateFormat(currentDate),
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
        const { classes } = this.props
        const filterOptions = _.pick(this.state, ['showRead', 'startMonth', 'endMonth', 'tagsFilter'])
        const transactionsToShow = sortByDate(filter(this.props.transactions, filterOptions))

        const transactions2 = transactionsToShow
            .map((t, index) => {
                const key = `${t.cardKey}-${t.transactionIndex}`
                const dataOverrides = this.state.additionalDataUpdates[key] || {}
                const highlight = !_.isEmpty(dataOverrides)
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
                    <TableRow key={key} className={clsx(highlight && classes.highlight)}>
                        <TableCell align="left"><span><input type="checkbox" tabIndex="-1" checked={isRead} onChange={(event) => this.handleDataUpdate(key, {tags, isRead: event.target.checked}, currentAdditionalData, initAdditionalData)}/></span></TableCell>
                        <TableCell align="left"><span>{t.name}</span></TableCell>
                        <TableCell align="left"><span>{t.date}</span></TableCell>
                        <TableCell align="left"><span>{t.amount}</span></TableCell>
                        <TableCell align="left"><span><TagsInput chipColor={highlight ? 'secondary' : 'primary'} tags={tags} onChange={(_tags) => this.handleDataUpdate(key, {tags: _tags, isRead}, currentAdditionalData, initAdditionalData)}/></span></TableCell>
                    </TableRow>
                )
            })

        return (
            <div>
                { this.props.transactions.length > 0 && (
                    <datalist id="tag-list">
                        {getTags(this.props.transactions).map(tag => (
                            <option key={tag}>{tag}</option>
                        ))}
                    </datalist>
                )}
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
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={this.state.showRead} onChange={event => this.togglesSowRead(event.target.checked)}
                                        name="checkedB"
                                        color="primary"
                                    />
                                }
                                label="נקראו"
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
                {this.props.transactions.length > 0 && (
                    <TableContainer component={Paper}>
                        <Table >
                            <TableHead>
                                <TableRow>
                                    <TableCell align="left" className={classes.readColumn}>נקרא</TableCell>
                                    <TableCell align="left" className={classes.nameColumn}>שם</TableCell>
                                    <TableCell align="left" className={classes.dateColumn}>תאריך</TableCell>
                                    <TableCell align="left" className={classes.amountColumn}>סכום</TableCell>
                                    <TableCell align="left">קטגוריות</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {transactions2}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
                <Fab
                    color="secondary"
                    aria-label="save"
                    className={classes.saveButton}
                    onClick={this.saveChanges}
                >
                    <SaveIcon className={classes.extendedIcon} />
                </Fab>
                {/*<button className="action-button" onClick={this.saveChanges}>☁️ שמור</button>*/}
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Transactions));
