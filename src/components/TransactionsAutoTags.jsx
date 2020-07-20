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
import TextField from '@material-ui/core/TextField';
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper/Paper";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell/TableCell";
import TableBody from "@material-ui/core/TableBody";
import TableContainer from "@material-ui/core/TableContainer";
import { lighten, withStyles } from '@material-ui/core/styles';
import clsx from "clsx";
import SaveIcon from '@material-ui/icons/Save';
import Fab from "@material-ui/core/Fab";

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
    }
})

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
            startMonth: '',
            endMonth: '',
        }

        this.updateStartMonth = (startMonth) => {
            this.setState({startMonth})
        }
        this.updateEndMonth = (endMonth) => {
            this.setState({endMonth})
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
        const { classes } = this.props

        // add filter here + move start button next to filter fiels, after start filter, show only changed trans
        const filterOptions = _.pick(this.state, ['startMonth', 'endMonth'])
        const filteredTransactions = filter(this.props.transactions, filterOptions)
        const transactionToCheck = !this.state.isAutoActive ? filteredTransactions : _.filter(filteredTransactions, t => {
            const key = `${t.cardKey}-${t.transactionIndex}`

            return !!this.state.additionalDataUpdates[key]
        })
        const transactionsToShow = sortByDate(transactionToCheck)

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
                        <TableCell align="left"><span><input type="checkbox" checked={isRead} onChange={(event) => this.handleDataUpdate(key, {tags, isRead: event.target.checked}, initAdditionalData)}/></span></TableCell>
                        <TableCell align="left"><span>{t.name}</span></TableCell>
                        <TableCell align="left"><span>{t.date}</span></TableCell>
                        <TableCell align="left"><span>{t.amount}</span></TableCell>
                        <TableCell align="left"><span><TagsInput inputTabIndex="-1" tags={tags} onChange={() => {}}/></span></TableCell>
                    </TableRow>
                )
            })

        return (
            <div>
                <div className="toolbar">
                    <div className="row-4-inputs">
                        <TextField
                            label="מחודש"
                            type="month"
                            value={this.state.startMonth} onChange={event => this.updateStartMonth(event.target.value)}
                        />
                        {/*<div className="input-box with-top-label">*/}
                        {/*    <label className="date-label" htmlFor="start-month">מחודש</label>*/}
                        {/*    <input id="start-month" type="month" value={this.state.startMonth} onChange={event => this.updateStartMonth(event.target.value)}/>*/}
                        {/*</div>*/}


                        <TextField
                            label="עד חודש"
                            type="month"
                            value={this.state.endMonth} onChange={event => this.updateEndMonth(event.target.value)}
                        />
                        {/*<div className="input-box with-top-label">*/}
                        {/*    <label className="date-label" htmlFor="start-month">עד חודש</label>*/}
                        {/*    <input id="end-month" type="month" value={this.state.endMonth} onChange={event => this.updateEndMonth(event.target.value)}/>*/}
                        {/*</div>*/}
                        <Button variant="contained" color="primary" onClick={this.autoTag}>
                            הצע
                        </Button>
                    </div>
                </div>
                <ul className="transactions">
                    <TableContainer component={Paper}>
                        <Table >
                            <TableHead>
                                <TableRow>
                                    <TableCell align="left" className={classes.readColumn}>נקרא</TableCell>
                                    <TableCell align="left" className={classes.nameColumn} align="right">שם</TableCell>
                                    <TableCell align="left" className={classes.dateColumn} align="right">תאריך</TableCell>
                                    <TableCell align="left" className={classes.amountColumn} align="right">סכום</TableCell>
                                    <TableCell align="left">קטגוריות</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {transactions2}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </ul>
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

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(TransactionsAutoTags));
