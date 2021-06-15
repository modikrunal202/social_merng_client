import React, { useContext, useState } from 'react'
import { Form, Button } from 'semantic-ui-react'
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag'
import { useForm } from '../utils/hooks';
import { AuthContext } from '../context/auth';
export default function Login(props) {
    const context = useContext(AuthContext)
    const [errors, setErrors] = useState({})
    const initialState = {
        username: '',
        password: '',
    }
    const { onChange, onSubmit, values } = useForm(makeLogin, initialState)
    const [loginUser, { loading }] = useMutation(LOGIN_USER, {
        update(proxy, result) {
            context.login(result.data.login)
            props.history.push('/')
        },
        onError(err) {
            setErrors(err.graphQLErrors[0].extensions.exception.errors);
        },
        variables: values
    })
    function makeLogin() {
        loginUser()
    }
    return (
        <div className="form-container">
            <Form onSubmit={onSubmit} noValidate className={loading ? "loading" : ""}>
                <h1>Login</h1>
                <Form.Input
                    label="Username"
                    placeholder="Username"
                    name="username"
                    type="text"
                    value={values.username}
                    error={errors.username ? true : false}
                    onChange={onChange}
                />
                <Form.Input
                    label="Password"
                    placeholder="Password"
                    name="password"
                    type="password"
                    value={values.password}
                    error={errors.password ? true : false}
                    onChange={onChange}
                />
                <Button type="submit" primary>
                    Login
                </Button>
            </Form>
            {Object.keys(errors).length > 0 && (
                <div className="ui error message">
                    <ul className="list">
                        {Object.values(errors).map(value => (
                            <li key={value}>{value}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}

const LOGIN_USER = gql`
    mutation login(
        $username: String!
        $password: String!
    ) {
        login(
            username: $username
            password: $password
        ) {
            id email token username
        }
    }
`