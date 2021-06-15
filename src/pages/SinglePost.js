import React, { useContext, useRef, useState } from 'react'
import gql from 'graphql-tag'
import { useMutation, useQuery } from '@apollo/react-hooks';
import { Card, Icon, Label, Image, Button, Grid, Form } from "semantic-ui-react";
import moment from 'moment'
import LikeButton from '../components/LikeButton';
import { AuthContext } from '../context/auth';
import DeleteButton from '../components/DeleteButton';

export default function SinglePost(props) {
    const postId = props.match.params.postId;
    const [commentBody, setCommentBody] = useState('')
    const commentInputRef = useRef(null)
    const { user } = useContext(AuthContext)
    console.log('postId', postId);
    const { data } = useQuery(FETCH_SINGLE_POST_QUERY, {
        variables: {
            postId
        }
    })
    function deletePostCallback() {
        props.history.push('/')
    }
    const [submitComment] = useMutation(CREATE_COMMENT_MUTATION, {
        variables: { postId, body: commentBody },
        update() {
            setCommentBody('')
            commentInputRef.current.blur();
        }
    })
    let postMarkUp;
    if (!data || !data.getPost) {
        postMarkUp = <p>Loading here...</p>
    } else {
        const { id, body, createdAt, username, comments, commentCount } = data.getPost;
        postMarkUp = (
            <Grid>
                <Grid.Row>
                    <Grid.Column width={2}>
                        <Image
                            floated='right'
                            size='mini'
                            src='https://react.semantic-ui.com/images/avatar/large/steve.jpg'
                        />
                    </Grid.Column>
                    <Grid.Column width={10}>
                        <Card fluid>
                            <Card.Content>
                                <Card.Header>{username}</Card.Header>
                                <Card.Meta>{moment.unix(createdAt / 1000).fromNow(true)} Ago</Card.Meta>
                                <Card.Description>
                                    {body}
                                </Card.Description>
                            </Card.Content>
                            <hr />
                            <Card.Content extra>
                                <LikeButton user={user} post={data.getPost} />
                                <Button labelPosition='right' size='small' as="div">
                                    <Button color='blue' basic>
                                        <Icon name='comments' />
                                    </Button>
                                    <Label basic color='blue' pointing='left'>
                                        {commentCount}
                                    </Label>
                                </Button>
                                <DeleteButton user={user} postId={id} username={username} callback={deletePostCallback} />
                            </Card.Content>
                        </Card>
                        {user && <Card fluid>
                            <Card.Content>
                                <p>Post a Comment</p>
                                <Form>
                                    <div className="ui action input fluid">
                                        <input
                                            type="text"
                                            placeholder="Comment.."
                                            name="comment"
                                            value={commentBody}
                                            onChange={(e) => setCommentBody(e.target.value)}
                                            ref={commentInputRef}
                                        />
                                        <button type="submit"
                                            className="ui button teal"
                                            disabled={commentBody.trim() === ""}
                                            onClick={submitComment}
                                        >
                                            Submit
                                        </button>
                                    </div>
                                </Form>
                            </Card.Content>
                        </Card>}
                        {comments.map(comment => (
                            <Card fluid key={comment.id}>
                                <Card.Content>
                                    {user && user.username === username && (
                                        <DeleteButton postId={id} user={user} commentId={comment.id} username={comment.username} />
                                    )}
                                    <Card.Header>{comment.username}</Card.Header>
                                    <Card.Meta>{moment(comment.createdAt).fromNow(true)} Ago</Card.Meta>
                                    <Card.Description>
                                        {comment.body}
                                    </Card.Description>
                                </Card.Content>
                            </Card>
                        ))}
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }
    return postMarkUp;
}

const FETCH_SINGLE_POST_QUERY = gql`
    query($postId: ID!) {
        getPost(postId: $postId) {
            id body createdAt username likeCount commentCount
            likes {
                username
            }
            comments {
                id username body createdAt
            }
        }
    }
`

const CREATE_COMMENT_MUTATION = gql`
    mutation createComment($postId: ID!, $body: String!) {
        createComment(postId: $postId, body: $body) {
            id, 
            body,
            comments {
                id,
                createdAt,
                username,
                body
            },
            commentCount
        }
    }
`