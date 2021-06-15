import React, { useReducer, createContext } from 'react'
import jwtDecode from 'jwt-decode';
const intitalState = {
    user: null
}
if (localStorage.getItem('token')) {
    const decodedToken = jwtDecode(localStorage.getItem('token'))
    if (decodedToken.exp * 1000 < Date.now()) {
        localStorage.removeItem('token')
    } else {
        intitalState.user = decodedToken
    }
}
const AuthContext = createContext({
    user: null,
    login: (data) => { },
    logout: () => { }
})

function authReducer(state, action) {
    switch (action.type) {
        case 'LOGIN':
            return {
                ...state,
                user: action.payload
            }
        case 'LOGOUT':
            return {
                ...state,
                user: null
            }
        default:
            return {
                ...state,
                user: null
            };
    }
}

function AuthProvider(props) {
    const [state, dispatch] = useReducer(authReducer, intitalState);
    const login = (data) => {
        localStorage.setItem('token', data.token);
        dispatch({
            type: "LOGIN",
            payload: data
        })
    }

    const logout = () => {
        localStorage.removeItem('token');
        dispatch({
            type: "LOGOUT",
            payload: null
        })
    }
    return (
        <AuthContext.Provider
            value={{ user: state.user, login, logout }}
            {...props}
        />
    )
}

export { AuthContext, AuthProvider }