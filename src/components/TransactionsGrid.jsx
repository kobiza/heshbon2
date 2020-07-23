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
                        <TableCell align="left"><span><input type="checkbox" tabIndex="-1" checked={t.isRead} disabled={true}/></span></TableCell>
                        <TableCell align="left"><span>{t.name}</span></TableCell>
                        <TableCell align="left"><span>{t.date}</span></TableCell>
                        <TableCell align="left"><span>{t.amount}</span></TableCell>
                        <TableCell align="left"><span><TagsInput tags={t.tags} isReadOnly={true}/></span></TableCell>
                    </TableRow>
                )
            })

        return (
            <div>
                <TableContainer component={Paper}>
                    <Table >
                        <TableHead>
                            <TableRow>
                                <TableCell align="left" className={classes.readColumn}>נקרא</TableCell>
                                <TableCell align="left" className={classes.nameColumn}>שם</TableCell>
                                <TableCell align="left" className={classes.dateColumn}>תאריך</TableCell>
                                <TableCell align="left" className={classes.amountColumn}>סכום</TableCell>
                                <TableCell align="left" >קטגוריות</TableCell>
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
