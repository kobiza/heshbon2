import React from 'react';
import TagsInput from './TagsInput.jsx'
import TagDataLists from './TagDataLists.jsx'
import Paper from "@material-ui/core/Paper/Paper";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell/TableCell";
import TableBody from "@material-ui/core/TableBody";
import TableContainer from "@material-ui/core/TableContainer";
import {lighten, withStyles} from '@material-ui/core/styles';
import PropTypes from "prop-types";
import * as _ from "lodash";
import clsx from "clsx";
import {sortByDate} from "../../utils/transactionsUtils";

const styles = theme => ({
    col70: {
        width: 70
    },
    col310: {
        width: 310
    },
    highlight: {
        backgroundColor: lighten(theme.palette.secondary.light, 0.85),
    },
})

class TransactionsGrid extends React.Component {
    render() {
        const { classes, isTagsReadOnly = true, isReadReadOnly = true, onTransactionChanged = _.noop, additionalDataUpdates = {} } = this.props

        const transactions = sortByDate(this.props.transactions)
            .map((t, index) => {
                const key = `${t.cardKey}-${t.transactionIndex}`
                const dataOverrides = additionalDataUpdates[key] || {}
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
                        <TableCell align="left"><span><input type="checkbox" tabIndex="-1" checked={isRead} disabled={isReadReadOnly}  onChange={(event) => onTransactionChanged(key, {tags, isRead: event.target.checked}, currentAdditionalData, initAdditionalData)}/></span></TableCell>
                        <TableCell align="left"><span>{t.name}</span></TableCell>
                        <TableCell align="left"><span>{t.date}</span></TableCell>
                        <TableCell align="left"><span>{t.amount}</span></TableCell>
                        <TableCell align="left"><span><TagsInput chipColor={highlight ? 'secondary' : 'primary'} tags={tags} isReadOnly={isTagsReadOnly} onChange={(_tags) => onTransactionChanged(key, {tags: _tags, isRead}, currentAdditionalData, initAdditionalData)}/></span></TableCell>
                    </TableRow>
                )
            })

        return (
            <div>
                { !isTagsReadOnly && <TagDataLists/>}
                <TableContainer component={Paper}>
                    <Table >
                        <TableHead>
                            <TableRow>
                                <TableCell align="left" className={classes.col70}>נקרא</TableCell>
                                <TableCell align="left" className={classes.col310}>שם</TableCell>
                                <TableCell align="left" className={classes.col70}>תאריך</TableCell>
                                <TableCell align="left" className={classes.col70}>סכום</TableCell>
                                <TableCell align="left" >קטגוריות</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {transactions}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        );
    }
}

TransactionsGrid.propTypes = {
    transactions: PropTypes.array,
    additionalDataUpdates: PropTypes.object,
    onTransactionChanged: PropTypes.func,
    isTagsReadOnly: PropTypes.bool,
    isReadReadOnly: PropTypes.bool,
}

export default withStyles(styles)(TransactionsGrid);
