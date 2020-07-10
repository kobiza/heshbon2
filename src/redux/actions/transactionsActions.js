import * as _ from 'lodash';

import { TRANSACTIONS_RECEIVED } from './actionTypes';

import * as clientDB from '../../utils/clientDB';


const TRANSACTIONS_PATH = 'transactions';

// const fetchUserTransactions = uid =>
//     clientDB.read(`${TRANSACTIONS_PATH}/${uid}`)
//         .then(userTransactions => {
//             if (userTransactions) {
//                 return { [uid]: userTransactions };
//             }
//             return null;
//         });

const fetchAllTransactions = () =>
    clientDB.read(TRANSACTIONS_PATH);

export const transactionsReceived = transactions => ({
    type: TRANSACTIONS_RECEIVED,
    transactions
});

// export const transactionsCanceled = (uid, eventId) => ({
//     type: BOOKING_CANCELED,
//     uid,
//     eventId
// });

export const fetchTransactions = () => (dispatch, getState) => {
    // const uid = _.get(getState(), ['authData', 'uid']);
    // const isAdmin = _.get(getState(), ['authData', 'isAdmin']);
    // const fetchPromise = isAdmin ? fetchAllTransactions() : fetchUserTransactions(uid);

    return fetchAllTransactions()
        .then(transactions => {
            if (transactions) {
                dispatch(transactionsReceived(transactions));
            }
        });
};

// export const updateBooking = (uid, eventId, bookingData) => dispatch => {
//
//     const bookingDataToUpdate = _.pick(bookingData, BOOKING_DATA_KEYS);
//
//     return clientDB.update(`${TRANSACTIONS_PATH}/${uid}/${eventId}`, bookingDataToUpdate)
//         .then(() => dispatch(transactionsReceived({ [uid]: { [eventId]: bookingDataToUpdate } })))
//         .catch(() => dispatch(errorActions.reportError()))
// };
//
// export const cancelBooking = (uid, eventId) => dispatch => {
//     return clientDB.remove(`${TRANSACTIONS_PATH}/${uid}/${eventId}`)
//         .then(() => dispatch(transactionsCanceled(uid, eventId)))
//         .catch(() => dispatch(errorActions.reportError()))
// };
