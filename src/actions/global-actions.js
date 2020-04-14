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

export const showMessage = message => dispatch => {
    dispatch(updateMessage(message))
    dispatch(updateIsMessageOpened(true))
}