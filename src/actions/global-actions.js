// Actions
export const updateUser = value => ({
    type: 'UPDATE_USER',
    value
})

export const updateIsMobile = value => ({
    type: 'UPDATE_IS_MOBILE',
    value
})

export const updateMessage = value => ({
    type: 'UPDATE_MESSAGE',
    value
})

export const updateIsMessageOpened = value => ({
    type: 'UPDATE_IS_MESSAGE_OPENED',
    value
})

export const updateNotifications = value => ({
    type: 'UPDATE_NOTIFICATIONS',
    value
})



// Thunks
export const observeAuthChange = firebase => dispatch => {
    firebase.auth.onAuthStateChanged(authUser => {
        if (authUser) {
            if (authUser.emailVerified) {
                return firebase.db.collection('users').doc(authUser.uid).onSnapshot(doc => {
                    return dispatch(updateUser(doc.data()))
                }, error => {
                    console.error(error)
                })
            }

            dispatch(showMessage('Please verify your e-mail'))
        }
        dispatch(updateUser({}))
    })
}

export const observerNotificationChange = firebase => dispatch => {
    return firebase.db.collection('notifications')
        .where('receiver', '==', firebase.auth.currentUser.uid)
        .onSnapshot(snapshot => {
            const notifications = snapshot.docs.map(notification => {
                return {
                    ...notification.data(),
                    id: notification.id
                }
            })
            dispatch(updateNotifications(notifications.sort((a, b) => a.timestamp - b.timestamp)))
        })
}

export const showMessage = message => dispatch => {
    dispatch(updateMessage(message))
    dispatch(updateIsMessageOpened(true))
}

export const signOut = (firebase, history) => dispatch => {
    firebase.doSignOut()
        .then(() => {
            history.push('/')
            dispatch(showMessage('We hope to see you again soon!'))
        })
        .catch(error => {
            console.error(error)
        })
}


// Functions
export const getMostRecentProfiles = (firebase, limit = 8) =>
    firebase.db.collection('users').orderBy('timestamp', 'desc').limit(limit).get()
        .then(querySnapshot => querySnapshot.docs.map(user => user.data()))
        .catch(error => console.log(error))
