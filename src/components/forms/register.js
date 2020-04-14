import React from 'react'
import { useHistory } from 'react-router-dom'
import { composeValidators, required, minLength, maxLength, alphaNumeric, email, passwordConfirmation } from '../../helpers/validate'
import { Form, Field } from 'react-final-form'
import { FORM_ERROR } from 'final-form'
import { withFirebase } from '../../firebase'
import RenderField from './render-field'

const RegisterForm = ({ firebase }) => {
    const history = useHistory()

    const register = values => 
        firebase.doCreateUserWithEmailAndPassword(values.email, values.password)
            .then(authUser => {
                return firebase.db.collection('users').doc(authUser.user.uid).set({
                    username: values.username
                })
            })
            .then(() => history.push('/'))
            .catch(error => {
                return { [FORM_ERROR]: error.message }
            })

    return (
        <Form
            onSubmit={register}
            render={({ handleSubmit, submitError }) => (
                <form onSubmit={handleSubmit}>
                    <h2 className="heading heading--primary">Register</h2>
                    <p className="text">Please enter the fields below to create an account</p>

                    <Field 
                        name="email"
                        component={RenderField}
                        type="email"
                        label="email"
                        validate={composeValidators(required, minLength(3), email)}
                    />

                    <Field 
                        name="username"
                        component={RenderField}
                        type="text"
                        label="Username"
                        validate={composeValidators(required, minLength(3), maxLength(16), alphaNumeric)}
                    />

                    <Field 
                        name="password"
                        component={RenderField}
                        type="password"
                        label="password"
                        validate={required}
                    />

                    <Field 
                        name="passwordConfirmation"
                        component={RenderField}
                        type="password"
                        label="password confirmation"
                        validate={passwordConfirmation}
                    />

                    {submitError && <p className="form__error">{submitError}</p>}

                    <div className="action__container">
                        <button className="button">Submit</button>  
                    </div>
                </form>
            )}
        />
    )
}

export default withFirebase(RegisterForm)