import * as _ from 'lodash';
import React from 'react';
import {connect} from 'react-redux';
import TagsInput from './buildingBlocks/TagsInput.jsx'
import TransactionsGrid from './buildingBlocks/TransactionsGrid.jsx'
import {filter, getTags} from "../utils/transactionsUtils";
import {
    fetchTransactions,
    updateCardTransactionsAdditionalData,
} from '../redux/actions/transactionsActions'

import Grid from '@material-ui/core/Grid';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Fab from '@material-ui/core/Fab';
import SaveIcon from '@material-ui/icons/Save';
import Paper from '@material-ui/core/Paper';
import { lighten, withStyles } from '@material-ui/core/styles';
import TextField from "@material-ui/core/TextField/TextField";


const styles = theme => ({
    saveButton: {
        position: 'fixed',
        bottom: 40,
        right: 40,
    },
    extendedIcon: {
        margin: theme.spacing(1)
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

class TransactionsPage extends React.Component {
    constructor(props) {
        super(props);

        const currentDate = new Date()
        const prev2MonthDate = new Date()
        prev2MonthDate.setMonth(prev2MonthDate.getMonth() - 2)

        this.state = {
            additionalDataUpdates: {},
            showRead: false,
            startMonth: toMonthInputDateFormat(prev2MonthDate),
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
        const transactionsToShow = filter(this.props.transactions, filterOptions)

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
                <TransactionsGrid transactions={transactionsToShow} isTagsReadOnly={false} isReadReadOnly={false} onTransactionChanged={this.handleDataUpdate} additionalDataUpdates={this.state.additionalDataUpdates}/>
                <Fab
                    color="secondary"
                    aria-label="save"
                    className={classes.saveButton}
                    onClick={this.saveChanges}
                >
                    <SaveIcon className={classes.extendedIcon} />
                </Fab>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(TransactionsPage));
