import React, { useContext } from 'react'
import { Card, Icon, Label, Image, Button, Popup } from "semantic-ui-react";
import moment from 'moment'
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/auth';
import LikeButton from './LikeButton'
import DeleteButton from './DeleteButton';
export default function PostCard({ post }) {
    const { user } = useContext(AuthContext)
    const { body, createdAt, username, likeCount, commentCount, id, likes } = post
    return (
        <Card fluid>
            <Card.Content>
                <Image
                    floated='right'
                    size='mini'
                    src='https://react.semantic-ui.com/images/avatar/large/steve.jpg'
                />
                <Card.Header>{username}</Card.Header>
                <Card.Meta as={Link} to={`/posts/${id}`}>{moment.unix(createdAt / 1000).fromNow(true)} Ago</Card.Meta>
                <Card.Description>
                    {body}
                </Card.Description>
            </Card.Content>
            <Card.Content extra >
                <LikeButton user={user} post={{ id, likes, likeCount }} />
                <Popup
                    inverted
                    trigger={
                        <Button labelPosition='right' size='small' as={Link} to={`/posts/${id}`}>
                            <Button color='blue' basic>
                                <Icon name='comments' />
                            </Button>
                            <Label basic color='blue' pointing='left'>
                                {commentCount}
                            </Label>
                        </Button>
                    }
                    content="Comment on post."
                    
                />

                <DeleteButton user={user} postId={id} username={username} />

            </Card.Content>
        </Card>
    )
}