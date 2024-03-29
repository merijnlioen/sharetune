import React, { Fragment, useEffect } from 'react'
import { Switch, Route } from 'react-router-dom'
import { UserHeader } from './components/shared/header'
import { connect } from 'react-redux'
import { observerNotificationChange } from './actions/global-actions'
import { withFirebase } from './firebase'
import Home from './components/pages/user/home'
import Settings from './components/pages/user/settings'
import Upload from './components/pages/user/upload'
import Search from './components/pages/user/search'
import Notifications from './components/pages/user/notifications'
import SharedRoutes from './shared-routes'
import NotificationContainer from './components/shared/notification'
import MainPlayer from './components/shared/main-player'

const UserRouter = ({ observerNotificationChange, firebase }) => {
    useEffect(() => {
        observerNotificationChange(firebase)
    }, [])

    return (
        <Fragment>
            <div className="user__container">
                <UserHeader />
                
                <div className="page page--user">
                    <Switch>
                        <Route path="/" exact component={Home} />
                        <Route path="/settings" exact component={Settings} />
                        <Route path="/upload" exact component={Upload} />
                        <Route path="/search" component={Search} />
                        <Route path="/notifications" exact component={Notifications} />
                        <SharedRoutes />
                    </Switch>
                </div>

                <NotificationContainer />

                <MainPlayer />
            </div>
        </Fragment>
    )
}

const mapDispatchToProps = dispatch => ({
    observerNotificationChange: firebase => dispatch(observerNotificationChange(firebase))
})

export default connect(null, mapDispatchToProps)(withFirebase(UserRouter))