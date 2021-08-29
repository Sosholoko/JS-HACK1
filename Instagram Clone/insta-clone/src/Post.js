import React,{useState, useEffect} from 'react';
import './Post.css';
import Avatar from '@material-ui/core/Avatar';
import firebase from 'firebase';
import {db} from './Firebase';

function Post({postId, user, username, caption, imageUrl, darkMode, setDarkMode}){
const [comments, setComments]= useState([]); 
const [comment, setComment]= useState([]);
const [counter, setCounter] = useState(0);

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
        if(comment.length <= 1){
            alert("You can't post empty comments")
        }
        else{
        db.collection('posts').doc(postId).collection('comments').add({
            text: comment,
            username: user.displayName,
            timestamp : firebase.firestore.FieldValue.serverTimestamp()
        });
        setComment('')
        setComments([]);
    }
    }


    //Random Id generator
    function randstr(prefix)
    {
    return Math.random().toString(36).replace('0.',prefix || '');
    }

    let div_id = randstr('heart_div_');
    let like_id = randstr('like_div');

    const redHeart = (e) =>{
        var selectHeart = e.target
        selectHeart.classList.toggle("redHeart");
        if(selectHeart.classList.contains("redHeart")){
            setCounter(1)
        }
        else{
            setCounter(0)
        }
    };

    // let userC = []
    // userC.push(username)
    // let userK = userC.concat(userC)
    // var count = {};
    // userC.forEach(function(i) { count[i] = (count[i]||0) + 1;});

    // function name(){username.forEach(element => console.log(element))};
    // name();
    // let userK = []
    // userK.push(userC)

    // let userN = typeof username

    return (
        <div className='post' data-theme={darkMode ? "dark" : "light"}>
            <div className='post__header'>
                <h2><Avatar className='post__avatar' alt={username} src='#'/>{username}</h2>
                <p id='dots'>...</p>
                {/* <i class="fas fa-ellipsis-v"/> */}
            </div>
            
            <img className='post__img' src ={imageUrl} alt='' onDoubleClick={redHeart}></img>
            <div className='post__like'>
                <i id={div_id} class="fas fa-heart" onClick={redHeart}></i><i class="far fa-comment"></i><i class="far fa-bookmark"></i><i class="far fa-paper-plane"></i>
            </div>
            <p id='post__likes'><span id={like_id}>{counter}</span> like</p><p id='comm_count'>{comments.length} comments</p>
            <h4 className='post__text'><strong>{username}</strong> {caption}</h4>
        {
            // console.log(comments)
        

            // console.log(userK)
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
