import * as _ from 'lodash';
import React from 'react';
import {connect} from 'react-redux';
import {filter} from "../utils/transactionsUtils";
import {
    fetchTransactions,
    updateCardTransactionsAdditionalData,
} from '../redux/actions/transactionsActions'
import TextField from '@material-ui/core/TextField';
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper/Paper";
import { lighten, withStyles } from '@material-ui/core/styles';
import SaveIcon from '@material-ui/icons/Save';
import Fab from "@material-ui/core/Fab";
import Grid from "@material-ui/core/Grid";
import TransactionsGrid from "./buildingBlocks/TransactionsGrid.jsx";

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
class AutoTagPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            additionalDataUpdates: {},
            isAutoActive: false,
            startMonth: '',
            endMonth: '',
            filteredTransactions: []
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
            // const allUnreadTransactions = this.props.transactions.filter(t => !t.isRead)
            const allNamesTags = _.reduce(allReadTransactions, (names, t) => {
                const prevTagsMap = names[t.name] || {}
                const newTagsMap = toTagsMap(t.tags)
                names[t.name] = joinTagsMap(prevTagsMap, newTagsMap)

                return names;
            }, {})

            const allNamesTagsArr = _.mapValues(allNamesTags, tagsMap => _.keys(tagsMap))

            const additionalDataUpdates = _.reduce(this.state.filteredTransactions, (acc, t) => {
                const tagsToAdd = allNamesTagsArr[t.name]
                if (tagsToAdd) {
                    const key = `${t.cardKey}-${t.transactionIndex}`

                    acc[key] = {tags: tagsToAdd, isRead: true}
                }

                return acc
            }, {})

            this.setState({additionalDataUpdates, isAutoActive: true})
        }

        this.filter = () => {
            const filterOptions = _.pick(this.state, ['startMonth', 'endMonth'])
            const filteredTransactions = filter(this.props.transactions, {...filterOptions, showRead: false})

            this.setState({filteredTransactions})
        }
    }

    componentWillMount() {
        this.props.fetchTransactions();
    }

    render() {
        const { classes } = this.props

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
                            <Button className={classes.suggestButton} variant="contained" color="primary" onClick={this.filter}>
                                חפש
                            </Button>
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <Button className={classes.suggestButton} variant="contained" color="primary" onClick={this.autoTag}>
                                הצע
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>
                <TransactionsGrid transactions={this.state.filteredTransactions} isTagsReadOnly={true} isReadReadOnly={false} onTransactionChanged={this.handleDataUpdate} additionalDataUpdates={this.state.additionalDataUpdates}/>
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

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(AutoTagPage));
