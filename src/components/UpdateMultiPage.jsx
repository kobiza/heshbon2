import * as _ from 'lodash';
import React from 'react';
import classNames from 'classnames'
import {connect} from 'react-redux';
import TagsInput from './buildingBlocks/TagsInput.jsx'
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
import Grid from "@material-ui/core/Grid";

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
    suggestButton: {
        marginTop: 10
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
            startMonth: '',
            endMonth: '',
            searchText: '',
            tagsFilter: [],
            tagsToApply: [],
            filteredTransactions: []
        }

        this.updateStartMonth = (startMonth) => {
            this.setState({startMonth})
        }
        this.updateEndMonth = (endMonth) => {
            this.setState({endMonth})
        }
        this.updateSearchText = (searchText) => {
            this.setState({searchText})
        }
        this.updateTagsToApply = (tagsToApply) => {
            this.setState({tagsToApply})
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

        this.updateMultiLines = () => {
            const additionalDataUpdates = _.reduce(this.state.filteredTransactions, (acc, t) => {
                const key = `${t.cardKey}-${t.transactionIndex}`

                acc[key] = {tags: this.state.tagsToApply, isRead: true}

                return acc
            }, {})

            this.setState({additionalDataUpdates})
        }

        this.filter = () => {
            const filterOptions = _.pick(this.state, ['startMonth', 'endMonth', 'searchText', 'tagsFilter'])
            const filteredTransactions = filter(this.props.transactions, filterOptions)

            this.setState({filteredTransactions})
        }
    }

    componentWillMount() {
        this.props.fetchTransactions();
    }

    render() {
        const { classes } = this.props

        const transactionsToShow = sortByDate(this.state.filteredTransactions)

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
                        <Grid item xs={12} sm={6}>
                            <TextField label="טקסט חופשי" value={this.state.searchText} onChange={event => this.updateSearchText(event.target.value)}/>
                        </Grid>
                        <Grid item xs={12} sm={9}>
                            <div className="input-box with-top-label">
                                <label className="date-label">קטגוריות חיפוש</label>
                                <TagsInput tags={this.state.tagsFilter} onChange={this.updateTagsFilter}/>
                            </div>
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <Button className={classes.suggestButton} variant="contained" color="primary" onClick={this.filter}>
                                חפש
                            </Button>
                        </Grid>
                        <Grid item xs={12} sm={9}>
                            <div className="input-box with-top-label">
                                <label className="date-label">קטגוירות לעדכון</label>
                                <TagsInput tags={this.state.tagsToApply} onChange={this.updateTagsToApply}/>
                            </div>
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <Button className={classes.suggestButton} variant="contained" color="primary" onClick={() => this.updateMultiLines()}>
                                עדכן
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>
                <ul className="transactions">
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
