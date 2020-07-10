import * as _ from 'lodash';
import { TRANSACTIONS_RECEIVED } from '../actions/actionTypes';

const initialState = {};

export default function eventsReducer(state = initialState, action = {}) {
    switch (action.type) {
        case TRANSACTIONS_RECEIVED:
            return _.merge({}, state, action.transactions);
        default:
            return state;
    }
}
