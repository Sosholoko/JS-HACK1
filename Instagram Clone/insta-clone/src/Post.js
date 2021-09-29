import React,{useState, useEffect} from 'react';
import './Post.css';
import Avatar from '@material-ui/core/Avatar';
import firebase from 'firebase';
import {db} from './Firebase';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { FacebookShareButton, TwitterShareButton, TelegramShareButton, RedditShareButton } from "react-share";
import { FacebookIcon, TwitterIcon, TelegramIcon, RedditIcon } from "react-share";


function getModalStyle() {
    const top = 50;
    const left = 50;

    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
    };
}

    const useStyles = makeStyles((theme) => ({
    paper: {
        position: 'absolute',
        width: 280,
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        borderRadius: '15px',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
        outline: 'none',
    },
    }));



function Post({postId, user, username, caption, imageUrl, darkMode, setDarkMode}){
const classes = useStyles();
const [modalStyle] = useState(getModalStyle);
const [comments, setComments]= useState([]); 
const [comment, setComment]= useState([]);
const [counter, setCounter] = useState(0);
const [combutton, setCombutton] = useState(false);
const [share, setShare] = useState(false);
const [emptyCom, setEmptyCom] = useState(false);

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
            // alert("You can't post empty comments")
            setEmptyCom(true)
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
    let com_id = randstr('com_div');

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

    const blueCom = (e) =>{
        var selectedCom = e.target
        selectedCom.classList.toggle("blueComm");
        setCombutton(b=>!b)
    }

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

        <Modal
        open={share}
        onClose={()=> setShare(false)}
        >
        <div style={modalStyle} className={classes.paper}>
        <form className='post__share'>
        <center>
            <h3>Share your post on your<br/> social medias</h3><br></br><br></br>
        <div className='post__sharebtn'>
        <FacebookShareButton
        url={"https://instagram-clone-604db.web.app"}
        quote={"Check out my new post on Familygram"}
        hashtag={"#familygram"}
        description={"Drop a like ;)"}
        className="Demo__some-network__share-button"
        >
        <FacebookIcon size={45} round={true} id='fb-icon' />
        </FacebookShareButton>
        
        <TwitterShareButton
        title={"Check out my new post on Familygram"}
        url={"https://instagram-clone-604db.web.app"}
        hashtags={["familygram", "new post"]}
        >
        <TwitterIcon size={45} round={true} id='tw-icon' />
        </TwitterShareButton>

        <TelegramShareButton
        title={"Check out my new post on Familygram"}
        url={"https://instagram-clone-604db.web.app"}
        >
        <TelegramIcon size={45} round={true} id='tg-icon'/>
        </TelegramShareButton>

        <RedditShareButton
        title={"Check out my new post on Familygram"}
        url={"https://instagram-clone-604db.web.app"}
        >
        <RedditIcon size={45} round={true} id='rd-icon'/>
        </RedditShareButton>
        </div><br/>
        <button id='post__cancel' onClick={()=>setShare(false)}>Cancel</button>
        </center>
        </form>
        </div>
    </Modal>

        <Modal
            open={emptyCom}
            onClose={()=> setEmptyCom(false)}
        >
            <div style={modalStyle} className={classes.paper}>
            <form className='post__empty'>
            <center>
                <h3><span id='post__warning'>⚠︎</span><br/>A comment needs to be at least two characters.</h3><br></br><br/>
                <button id='ok__btn' onClick={()=>setEmptyCom(false)}>OK</button>
            </center>
            </form>
            </div>
        </Modal>


            <div className='post__header'>
                <h2><Avatar className='post__avatar' alt={username} src='#'/>{username}</h2>
                <p id='dots'>...</p>
                {/* <i class="fas fa-ellipsis-v"/> */}
            </div>
            
            <img className='post__img' src ={imageUrl} alt='' onDoubleClick={redHeart}></img>
            <div className='post__like'>
                <i id={div_id} class="fas fa-heart" onClick={redHeart}></i><i id={com_id} class="far fa-comment" onClick={blueCom}></i><i class="far fa-bookmark"></i><i onClick={()=>setShare(true)} class="far fa-paper-plane"></i>
            </div>
            <p id='post__likes'><span id={like_id}>{counter}</span> like</p><p id='comm_count'>{comments.length} comments</p>
            <h4 className='post__text'><strong>{username}</strong> {caption}</h4>
        {
            // console.log(comments)
        

            // console.log(userK)
        }
        {combutton ?(
            <div className='post__comments'>
            {
                comments.map((comment) => (
                    <p>
                            <strong>{comment.username}</strong> {comment.text}
                    </p>
            ))}
        </div>
        ):(
            <>
            </>
        )}
        
            
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
