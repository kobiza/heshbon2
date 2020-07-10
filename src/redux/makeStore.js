import { createStore, combineReducers, applyMiddleware } from 'redux';

import thunk from 'redux-thunk';

import authDataReducer from './reducers/authDataReducer';
import transactionsReducer from './reducers/transactionsReducer';

export default function() {
    const reducers = combineReducers({
        authData: authDataReducer,
        transactions: transactionsReducer,
    });

    const middleware = applyMiddleware(
        thunk
    );

    return createStore(reducers, undefined, middleware);


};
