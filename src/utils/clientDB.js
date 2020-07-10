import firebase from 'firebase';

export const initialize = config => {
    firebase.initializeApp(config);
};

export const setIn = (path, data) => new Promise((resolve, reject) => {
    firebase.database().ref(path).set(data)
        .then(resolve)
        .catch(reject);
});

export const read = path => new Promise((resolve, reject) => {
    firebase.database().ref(path).once('value')
        .then(snapshot => resolve(snapshot.val()))
        .catch(reject);
});

export const push = (path, data) => new Promise((resolve, reject) => {
    const uniqueKey = firebase.database().ref(path).push().key;
    setIn(path + '/' + uniqueKey, data)
        .then(() => resolve(uniqueKey))
        .catch(reject);
});

export const update = (path, data) => new Promise((resolve, reject) => {
    firebase.database().ref(path).update(data)
        .then(resolve)
        .catch(reject);
});

export const remove = path => new Promise((resolve, reject) => {
    firebase.database().ref(path).remove()
        .then(resolve)
        .catch(reject);
});

export const loginWithGoogle = () => new Promise(resolve => {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithRedirect(provider)
        .then(resolve);
});

// export const loginWithFacebook = () => new Promise(resolve => {
//     const provider = new firebase.auth.FacebookAuthProvider();
//     firebase.auth().signInWithRedirect(provider)
//         .then(resolve);
// });
//
// export const loginWithEmailAndPassword = (email, password) => new Promise((resolve, reject) => {
//     firebase.auth().signInWithEmailAndPassword(email, password)
//         .then(resolve)
//         .catch(reject);
// });

// export const sendPasswordResetEmail = email => new Promise((resolve, reject) => {
//     firebase.auth().sendPasswordResetEmail(email)
//         .then(resolve)
//         .catch(reject);
// });

// export const createUserWithEmailAndPassword = (email, password) => new Promise((resolve, reject) => {
//     firebase.auth().createUserWithEmailAndPassword(email, password)
//         .then(resolve)
//         .catch(reject);
// });

export const signOut = () => new Promise((resolve, reject) => {
    firebase.auth().signOut()
        .then(resolve)
        .catch(reject);
});

export const getLoggedInUser = () => new Promise((resolve, reject) => {
    firebase.auth().getRedirectResult()
        .then(result => {
            if (result.user) {
                resolve(result.user);
            } else {
                const onAuthStateChange = user => {
                    firebase.auth().removeAuthTokenListener(onAuthStateChange);
                    resolve(user);
                };
                firebase.auth().onAuthStateChanged(onAuthStateChange);
            }
        })
        .catch(reject);
});
