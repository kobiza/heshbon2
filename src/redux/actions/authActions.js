import { SET_AUTH_DATA, SIGN_OUT } from './actionTypes';

import * as clientDB from '../../utils/clientDB';

const setAuthData = (uid, email, isAdmin) => ({
    type: SET_AUTH_DATA,
    uid,
    email,
    isAdmin
});


const userSignedOut = () => ({
    type: SIGN_OUT
});

export const loginWithGoogle = () => () => clientDB.loginWithGoogle();

export const signOut = () => (dispatch) => clientDB.signOut().then(() => dispatch(userSignedOut()));

export const fetchAuthData = () => (dispatch) => {
        return clientDB.getLoggedInUser()
        .then(user => {
            if (user) {
                dispatch(setAuthData(user.uid, user.email, false))
                // return clientDB.read('admins/' + user.uid)
                //     .then(isAdmin => dispatch(setAuthData(user.uid, user.email, !!isAdmin)))
            }
            return null;
        })
        .catch(dbError => {
            console.error(dbError); // eslint-disable-line no-console
        })
};
