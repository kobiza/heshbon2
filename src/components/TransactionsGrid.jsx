import React from 'react';
import classNames from 'classnames'
import TagsInput from './TagsInput.jsx'

export default class TransactionsGrid extends React.Component {
    render() {
        const transactions = this.props.transactions
            .map((t) => {
                const key = `${t.cardKey}-${t.transactionIndex}`
                return (
                    <li className={classNames("transaction")} key={key}>
                        <span className="transaction-isRead"><input type="checkbox" tabIndex="-1" checked={t.isRead} disabled={true}/></span>
                        <span className="transaction-name">{t.name}</span>
                        <span className="transaction-date">{t.date}</span>
                        <span className="transaction-amount">{t.amount}</span>
                        <span className="transaction-tags"><TagsInput tags={t.tags} onChange={() => {}}/></span>
                    </li>
                )
            })

        const emptyLine = (
            <li className={classNames("transaction", 'empty')}>
                <span>לא נמצאו שורות להציג</span>
            </li>
        )

        return (
            <div>
                <ul className="transactions">
                    {this.props.transactions.length > 0 && (
                        <li className="transaction-head">
                            <span>נקרא?</span>
                            <span>שם</span>
                            <span>תאריך</span>
                            <span>סכום</span>
                            <span>קטגוריות</span>
                        </li>
                    )}
                    {this.props.transactions.length > 0 ? transactions : emptyLine}
                </ul>
            </div>
        );
    }
}
