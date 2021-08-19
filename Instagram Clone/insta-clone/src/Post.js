import React,{useState, useEffect} from 'react';
import './Post.css';
import Avatar from '@material-ui/core/Avatar';
import firebase from 'firebase';
import {db} from './Firebase';

function Post({postId, user, username, caption, imageUrl}){
const [comments, setComments]= useState([]); 
const [comment, setComment]= useState([]);

useEffect(() => {
    let unsubscribe;
    if(postId){
        unsubscribe = db
        .collection("posts")
        .doc(postId)
        .collection("comments")
        .orderBy('timestamp', 'desc')
        .onSnapshot((snapshot)=>{
            setComments(snapshot.docs.map((doc)=>doc.data()));
        });
}
    return ()=>{
        unsubscribe();
    };
}, [postId]);

    const postComment = (event) =>{
        event.preventDefault();

        db.collection('posts').doc(postId).collection('comments').add({
            text: comment,
            username: user.displayName,
            timestamp : firebase.firestore.FieldValue.serverTimestamp()
        });
        setComments([]);
    }

    return (
        <div className='post'>
            <div className='post__header'>
                <Avatar
                className='post__avatar'
                alt={username}
                src='#'
                />
                <h2>{username}</h2>
                <i class="fas fa-ellipsis-v"/>
            </div>
            
            <img className='post__img' src ={imageUrl}></img>
            <div className='post__like'>
                <i class="far fa-heart"></i><i class="far fa-comment"></i><i class="far fa-bookmark"></i><i class="far fa-paper-plane"></i>
            </div>
            <h4 className='post__text'><strong>{username}</strong> {caption}</h4>
        {
            console.log(comments)
        }
        <div className='post__comments'>
            {
                comments.map((comment) => (
                    <p>
                            <strong>{comment.username}</strong> {comment.text}
                    </p>
            ))}
        </div>
            
        {/* comments.map((comment) */}
            <form className='post__commentBox'>
                <input
                className="post__input"
                type='text'
                placeholder='Add a comment'
                value={comment}
                onChange={(e)=> setComment(e.target.value)}
                ></input>
                <button
                className='post__button'
                disabled={!comment}
                type='button'
                onClick={postComment}
                >
                POST ➤
                </button>
            </form>
        </div>
    )
}

export default Post
