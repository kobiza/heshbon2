import * as _ from 'lodash';
import React from 'react';
import classNames from 'classnames'
import {connect} from 'react-redux';
import TagsInput from './TagsInput.jsx'
import {filter, sortByDate, getTags} from "../utils/transactionsUtils";
import {
    fetchTransactions,
    updateCardTransactionsAdditionalData,
} from '../redux/actions/transactionsActions'

import Table from '@material-ui/core/Table';
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
        left: 40,
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
class Transactions extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            additionalDataUpdates: {},
            showRead: false,
            startMonth: '',
            endMonth: '',
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
                        <TableCell align="right"><span><input type="checkbox" tabIndex="-1" checked={isRead} onChange={(event) => this.handleDataUpdate(key, {tags, isRead: event.target.checked}, currentAdditionalData, initAdditionalData)}/></span></TableCell>
                        <TableCell align="right"><span>{t.name}</span></TableCell>
                        <TableCell align="right"><span>{t.date}</span></TableCell>
                        <TableCell align="right"><span>{t.amount}</span></TableCell>
                        <TableCell align="right"><span><TagsInput chipColor={highlight ? 'secondary' : 'primary'} tags={tags} onChange={(_tags) => this.handleDataUpdate(key, {tags: _tags, isRead}, currentAdditionalData, initAdditionalData)}/></span></TableCell>
                    </TableRow>
                )
            })

        const emptyLine = (
            <li className={classNames("transaction", 'empty')}>
                <span>לא נמצאו שורות להציג</span>
            </li>
        )

        return (
            <div>
                { this.props.transactions.length > 0 && (
                    <datalist id="tag-list">
                        {getTags(this.props.transactions).map(tag => (
                            <option key={tag}>{tag}</option>
                        ))}
                    </datalist>
                )}
                <div className="toolbar">
                    <div className="row-4-inputs">
                        <div className="input-box with-top-label">
                            <label className="date-label" htmlFor="start-month">מחודש</label>
                            <input id="start-month" type="month" value={this.state.startMonth} onChange={event => this.updateStartMonth(event.target.value)}/>
                        </div>


                        <div className="input-box with-top-label">
                            <label className="date-label" htmlFor="start-month">עד חודש</label>
                            <input id="end-month" type="month" value={this.state.endMonth} onChange={event => this.updateEndMonth(event.target.value)}/>
                        </div>

                    </div>
                    <div className="row-1-3-inputs">
                        <div className="input-box show-read">
                            <input id="showRead" type="checkbox" checked={this.state.showRead} onChange={event => this.togglesSowRead(event.target.checked)}/>
                            <label htmlFor="showRead">הצג נקראו</label>
                        </div>
                        <div className="input-box with-top-label">
                            <label className="date-label">קטגוריות</label>
                            <TagsInput tags={this.state.tagsFilter} onChange={this.updateTagsFilter}/>
                        </div>

                    </div>
                </div>

                {this.props.transactions.length > 0 && (
                    <TableContainer component={Paper}>
                        <Table >
                            <TableHead>
                                <TableRow>
                                    <TableCell className={classes.readColumn}>נקרא</TableCell>
                                    <TableCell className={classes.nameColumn} align="right">שם</TableCell>
                                    <TableCell className={classes.dateColumn} align="right">תאריך</TableCell>
                                    <TableCell className={classes.amountColumn} align="right">סכום</TableCell>
                                    <TableCell align="right">קטגוריות</TableCell>
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
                >
                    <SaveIcon className={classes.extendedIcon} />
                </Fab>
                {/*<button className="action-button" onClick={this.saveChanges}>☁️ שמור</button>*/}
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Transactions));
