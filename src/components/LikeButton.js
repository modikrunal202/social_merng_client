import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useMutation } from '@apollo/client'
import gql from 'graphql-tag'
import { Icon, Label, Button, Popup } from "semantic-ui-react";


export default function LikeButton({ post: { id, likes, likeCount }, user }) {
    const [liked, setLiked] = useState(false);
    useEffect(() => {
        if (user && likes.find(like => like.username === user.username)) {
            setLiked(true)
        }
    }, [user, likes])
    const [likePost] = useMutation(LIKE_POST_MUTATION, {
        variables: { postId: id },
        update(_, { data: { likePost } }) {
            if (user && likePost.likes.find(like => like.username === user.username)) {
                setLiked(true)
            } else {
                setLiked(false)
            }
        }
    })
    const likeButton = user ? (
        liked ? (
            <Button color='teal'>
                <Icon name='heart' />
            </Button>
        ) : (
            <Button color='teal' basic>
                <Icon name='heart' />
            </Button>
        )
    ) : (
        <Button as={Link} to="/login" color='teal' basic>
            <Icon name='heart' />
        </Button>
    )
    return (
        <Popup
            inverted
            trigger={
                <Button as='div' labelPosition='right' onClick={likePost}>
                    {likeButton}
                    <Label basic color='teal' pointing='left'>
                        {likeCount}
                    </Label>
                </Button>
            }
            content="Like on post."
        />

    )
}

const LIKE_POST_MUTATION = gql`
    mutation likePost($postId: ID!) {
        likePost(postId: $postId) {
            id
            likes {
                id username
            }
            likeCount
        }
    }
`