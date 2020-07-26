import React from 'react';
import TagsInput from './TagsInput.jsx'
import Paper from "@material-ui/core/Paper/Paper";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell/TableCell";
import TableBody from "@material-ui/core/TableBody";
import TableContainer from "@material-ui/core/TableContainer";
import { withStyles } from '@material-ui/core/styles';
import PropTypes from "prop-types";

const styles = {
    col70: {
        width: 70
    },
    col310: {
        width: 310
    }
}

class TransactionsGrid extends React.Component {
    render() {
        const { classes, isReadOnly = true } = this.props

        const transactions = this.props.transactions
            .map((t, index) => {
                const key = `${t.cardKey}-${t.transactionIndex}`

                return (
                    <TableRow key={key}>
                        <TableCell align="left"><span><input type="checkbox" tabIndex="-1" checked={t.isRead} disabled={isReadOnly}/></span></TableCell>
                        <TableCell align="left"><span>{t.name}</span></TableCell>
                        <TableCell align="left"><span>{t.date}</span></TableCell>
                        <TableCell align="left"><span>{t.amount}</span></TableCell>
                        <TableCell align="left"><span><TagsInput tags={t.tags} isReadOnly={isReadOnly}/></span></TableCell>
                    </TableRow>
                )
            })

        return (
            <div>
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
    isReadOnly: PropTypes.bool,
}

export default withStyles(styles)(TransactionsGrid);
