import { createStore, combineReducers, applyMiddleware } from 'redux';

import thunk from 'redux-thunk';

import authDataReducer from './reducers/authDataReducer';
import transactionsReducer from './reducers/transactionsReducer';
import tagsReducer from './reducers/tagsReducer';

export default function() {
    const reducers = combineReducers({
        authData: authDataReducer,
        transactions: transactionsReducer,
        tags: tagsReducer,
    });

    const middleware = applyMiddleware(
        thunk
    );

    return createStore(reducers, undefined, middleware);


};
