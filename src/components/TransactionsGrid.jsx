import React from 'react';
import classNames from 'classnames'
import TagsInput from './TagsInput.jsx'
import Paper from "@material-ui/core/Paper/Paper";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell/TableCell";
import TableBody from "@material-ui/core/TableBody";
import TableContainer from "@material-ui/core/TableContainer";
import { withStyles } from '@material-ui/core/styles';

const styles = {
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
}

class TransactionsGrid extends React.Component {
    render() {
        const { classes } = this.props
        const transactions2 = this.props.transactions
            .map((t, index) => {
                const key = `${t.cardKey}-${t.transactionIndex}`

                return (
                    <TableRow key={key}>
                        <TableCell align="right"><span><input type="checkbox" tabIndex="-1" checked={t.isRead} disabled={true}/></span></TableCell>
                        <TableCell align="right"><span>{t.name}</span></TableCell>
                        <TableCell align="right"><span>{t.date}</span></TableCell>
                        <TableCell align="right"><span>{t.amount}</span></TableCell>
                        <TableCell align="right"><span><TagsInput tags={t.tags} onChange={() => {}}/></span></TableCell>
                    </TableRow>
                )
            })

        return (
            <div>
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
            </div>
        );
    }
}

export default withStyles(styles)(TransactionsGrid);
