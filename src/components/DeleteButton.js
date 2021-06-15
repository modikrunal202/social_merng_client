import React, { useState } from 'react'
import gql from 'graphql-tag'
import { useMutation } from '@apollo/client'
import { Icon, Button, Confirm, Popup } from "semantic-ui-react";
import { FETCH_POSTS_QUERY } from '../utils/graphql';


export default function DeleteButton(props) {
    const { postId, user, username, callback, commentId } = props
    const [confirmOpen, setConfirmOpen] = useState(false)
    const mutation = commentId ? DELTE_COMMENT_MUTATION : DELETE_POST_MUTATION
    const [deletePost] = useMutation(mutation, {
        variables: { postId, commentId },
        update(_, { data: { deletePost } }) {
            setConfirmOpen(false);
            if (callback) {
                callback()
            }
        },
        refetchQueries: [{ query: FETCH_POSTS_QUERY }],
    })
    let deleteMarkUp = ''
    if (user && user.username === username) {
        return (
            <>
                <Popup
                    inverted
                    trigger={
                        <Button floated="right" as="div" color="red" size='small' onClick={() => setConfirmOpen(true)}>
                            <Icon name="trash" style={{ margin: "0px" }} />
                        </Button>
                    }
                    position='top right'
                    content={commentId ? "Delete Comment" : "Delete post."}
                />
                <Confirm
                    open={confirmOpen}
                    onCancel={() => setConfirmOpen(false)}
                    onConfirm={deletePost}
                />
            </>
        )
    }
    return deleteMarkUp;
}

const DELETE_POST_MUTATION = gql`
    mutation deltePost($postId: ID!) {
        deletePost(postId: $postId)
    }
`

const DELTE_COMMENT_MUTATION = gql`
    mutation delteComment($postId: ID!, $commentId: ID!){
        deleteComment(postId: $postId, commentId: $commentId){
            id
            body
            comments {
                id
                createdAt
                username
                body
            }
            commentCount
        }
    }
`