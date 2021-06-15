import React, { useState } from 'react'
import { Form, Button } from 'semantic-ui-react'
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag'
import { FETCH_POSTS_QUERY } from '../utils/graphql';

export default function PostForm({ refetch }) {
    const initialState = {}
    const [body, setBody] = useState('')
    const [errors, setErrors] = useState(initialState)

    const [createPost, { error }] = useMutation(CREATE_POST_MUTATION, {
        variables: { body },
        awaitRefetchQueries: true,
        update(proxy, result) {
            const data = proxy.readQuery({
                query: FETCH_POSTS_QUERY
            })
            data.getPosts = [result.data.createPost, ...data.getPosts];
        },
        refetchQueries: [{ query: FETCH_POSTS_QUERY }],
        onError(err) {
            setErrors(err.graphQLErrors[0].extensions.exception.errors);
        },
    })
    function onChange(e) {
        setBody(e.target.value)
    }
    function onSubmit(e) {
        e.preventDefault()
        createPost()
        setErrors(initialState)
        setBody("")
    }
  
    return (
        <>
            <Form onSubmit={onSubmit}>
                <h2>Create a Post</h2>
                <Form.Field>
                    <Form.Input
                        placeholder='Hi World..'
                        name='body'
                        onChange={onChange}
                        value={body}
                        error={error ? true : false}
                    />
                    <Button type='submint' color='teal'>
                        Submit
                    </Button>
                </Form.Field>
            </Form>
            {Object.keys(errors).length > 0 && (
                <div className="ui error message" style={{ marginBottom: '10px' }}>
                    <ul className="list">
                        {Object.values(errors).map(value => (
                            <li key={value}>{value}</li>
                        ))}
                    </ul>
                </div>
            )}
        </>

    )
}

const CREATE_POST_MUTATION = gql`
    mutation createPost($body: String!){
        createPost(body: $body) {
            id body username 
            likes {
                id username createdAt
            }
            comments {
                id username createdAt body
            }
        }
    }
`