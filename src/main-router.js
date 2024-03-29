import React, { useEffect } from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { observeAuthChange, updateIsMobile } from './actions/global-actions'
import { connect } from 'react-redux'
import { withFirebase } from './firebase'
import variables from './assets/scss/app.scss'
import Loading from './components/shared/loading'
import Message from './components/shared/message'

import GuestRouter from './guest-router'
import UserRouter from './user-router'

const MainRouter = ({ user, isMobile, updateIsMobile, observeAuthChange, firebase }) => {
    useEffect(() => {
        window.addEventListener('resize', onResize)

        return () => window.removeEventListener('resize', onResize)
    }, [isMobile])

    useEffect(() => {
        observeAuthChange(firebase)
        onResize()
    }, [])

    const onResize = () => {
        let isCurrMobile = false

        if ( window.innerWidth <= parseInt(variables.breakpointSmall.replace('px', '')) ) isCurrMobile = true
        
        if (isCurrMobile !== isMobile) return updateIsMobile(isCurrMobile)
    }

    return (
        <Router>
            <Loading isLoading={!user}>
                <div className="page">
                    <Message />
                    <Switch>
                        {user && Object.keys(user).length <= 0 && <Route path="/" component={GuestRouter} />}
                        {user && Object.keys(user).length > 0 && <Route path="/" component={UserRouter} />}
                    </Switch>
                </div>
            </Loading>
        </Router>
    )
}

const mapStateToProps = state => ({
    user: state.global.user,
    isMobile: state.global.isMobile
})

const mapDispatchToProps = dispatch => ({
    observeAuthChange: firebase => dispatch(observeAuthChange(firebase)),
    updateIsMobile: value => dispatch(updateIsMobile(value))
})

export default connect(mapStateToProps, mapDispatchToProps)(withFirebase(MainRouter))