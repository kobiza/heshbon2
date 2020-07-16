import * as _ from 'lodash';

import {TAGS_RECEIVED, TRANSACTIONS_RECEIVED} from './actionTypes';

import * as clientDB from '../../utils/clientDB';


const TRANSACTIONS_PATH = 'transactions';
const TRANSACTIONS_ADDITIONAL_DATA_PATH = 'additionalData';

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

const fetchAllTransactionsAdditionalData = () =>
    clientDB.read(TRANSACTIONS_ADDITIONAL_DATA_PATH);

export const transactionsReceived = transactions => ({
    type: TRANSACTIONS_RECEIVED,
    transactions
});

export const updateTags = tags => ({
    type: TAGS_RECEIVED,
    tags
});

// export const transactionsCanceled = (uid, eventId) => ({
//     type: BOOKING_CANCELED,
//     uid,
//     eventId
// });

export const additionalDataDefaults = {
    tags: [],
    isRead: false,
    isFishy: false
}

export const fetchTransactions = () => (dispatch, getState) => {
    // const uid = _.get(getState(), ['authData', 'uid']);
    // const isAdmin = _.get(getState(), ['authData', 'isAdmin']);
    // const fetchPromise = isAdmin ? fetchAllTransactions() : fetchUserTransactions(uid);

    return Promise.all([fetchAllTransactions(), fetchAllTransactionsAdditionalData()])
        .then(([transactions, transactionsAdditionalData]) => {
            if (transactionsAdditionalData) {
                const tagsToAdd = _.map(_.flatMap(_.values(transactionsAdditionalData), data => _.get(data, ['rows'], [])), _data => _.get(_data, ['tags']))
                const allTags = _.values(_.reduce(tagsToAdd, _.assign, {}))
                dispatch(updateTags(allTags));
            }

            if (transactions) {
                const flatTransactions = _.flatMap(_.mapValues(transactions, (cardData, cardKey) => _.map(cardData.rows, (transactionData, transactionIndex) => {
                    //path: `/transactions/${cardKey}/${transactionIndex}/`
                    const additionalData = _.defaults(_.get(transactionsAdditionalData, [cardKey, 'rows', transactionIndex], {}), additionalDataDefaults)
                    return Object.assign({}, transactionData, {cardKey, transactionIndex}, additionalData)
                })))
                dispatch(transactionsReceived(flatTransactions));
            }
        });
};

const updateTransactionsAdditionalData = (additionalDataTitle) => (cardKey, index, data ) => {
    clientDB.setIn(`/additionalData/${cardKey}/rows/${index}/${additionalDataTitle}/`, data)
}

export const updateCardTransactionsAdditionalData = (cardKey, rowAdditionalData ) => {
    clientDB.update(`/additionalData/${cardKey}/rows/`, rowAdditionalData)
}

export const updateRecordTags = updateTransactionsAdditionalData('tags')
export const updateRecordStatus = updateTransactionsAdditionalData('status')

export const updateTagsInDB = () => (dispatch, getState) => {
    // const uid = _.get(getState(), ['authData', 'uid']);
    // const isAdmin = _.get(getState(), ['authData', 'isAdmin']);
    // const fetchPromise = isAdmin ? fetchAllTransactions() : fetchUserTransactions(uid);

    return Promise.all([fetchAllTransactions(), fetchAllTransactionsAdditionalData()])
        .then(([transactions, transactionsAdditionalData]) => {
            if (transactionsAdditionalData) {
                const tagsToAdd = _.map(_.flatMap(_.values(transactionsAdditionalData), data => _.get(data, ['rows'], [])), _data => _.get(_data, ['tags']))
                const allTags = _.values(_.reduce(tagsToAdd, _.assign, {}))
                dispatch(updateTags(allTags));
            }

            if (transactions) {
                const flatTransactions = _.flatMap(_.mapValues(transactions, (cardData, cardKey) => _.map(cardData.rows, (transactionData, transactionIndex) => {
                    //path: `/transactions/${cardKey}/${transactionIndex}/`
                    const additionalData = _.defaults(_.get(transactionsAdditionalData, [cardKey, 'rows', transactionIndex], {}), additionalDataDefaults)
                    return Object.assign({}, transactionData, {cardKey, transactionIndex}, additionalData)
                })))
                dispatch(transactionsReceived(flatTransactions));
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
