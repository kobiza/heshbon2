import { SET_AUTH_DATA, SIGN_OUT } from '../actions/actionTypes';

const initialState = null;

export default function authDataReducer(state = initialState, action = {}) {
    switch (action.type) {
        case SET_AUTH_DATA:
            return { uid: action.uid, email: action.email, isAdmin: action.isAdmin };
        case SIGN_OUT:
            return initialState;
        default:
            return state;
    }
}
